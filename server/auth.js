import { randomUUID } from "node:crypto";
import { z } from "zod";
import { email, password, registration, fail } from "./validation.js";
import {
  digest,
  token,
  hashPassword,
  verifyPassword,
  publicUser,
} from "./security.js";

export async function authRoutes(app, { db, env, sendReset }) {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: "/",
  };
  const sessionUser = async (request) => {
    const raw = request.cookies.stroy_session;
    if (!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
    return (
      (
        await db.query(
          "SELECT u.*, s.csrf FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",
          [digest(raw)],
        )
      ).rows[0] || null
    );
  };
  app.decorate("authenticate", async (request) => {
    request.account = await sessionUser(request);
    if (!request.account) fail(401, "AUTH_REQUIRED");
    if (
      !["GET", "HEAD"].includes(request.method) &&
      request.headers["x-csrf-token"] !== request.account.csrf
    )
      fail(403, "CSRF_FAILED");
  });
  app.decorate("sellerOnly", async (request) => {
    await app.authenticate(request);
    if (request.account.role !== "seller") fail(403, "SELLER_REQUIRED");
  });
  const createSession = async (reply, user, remember = false) => {
    const raw = token(),
      csrf = token();
    const seconds = remember ? 30 * 86400 : 86400;
    await db.query(
      "INSERT INTO sessions(token_hash,user_id,csrf,expires_at) VALUES($1,$2,$3,$4)",
      [digest(raw), user.id, csrf, new Date(Date.now() + seconds * 1000)],
    );
    reply.setCookie("stroy_session", raw, {
      ...cookieOptions,
      ...(remember ? { maxAge: seconds } : {}),
    });
    return { user: publicUser(user), csrf };
  };
  app.get("/api/auth/me", async (request) => {
    const user = await sessionUser(request);
    return { user: user ? publicUser(user) : null, csrf: user?.csrf || null };
  });
  app.post("/api/auth/seller", { preHandler: app.authenticate }, async request => {
    const {storeName}=z.object({storeName:z.string().trim().min(1).max(150)}).parse(request.body);
    const user=(await db.query("UPDATE users SET role='seller',store_name=CASE WHEN role='seller' THEN store_name ELSE $1 END WHERE id=$2 RETURNING *",[storeName,request.account.id])).rows[0];
    return {user:publicUser(user)};
  });
  app.post(
    "/api/auth/register",
    { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const data = registration.parse(request.body);
      const hash = await hashPassword(data.password);
      let user;
      try {
        user = (
          await db.query(
            "INSERT INTO users(id,email,password_hash,name,phone,role,store_name) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
            [
              randomUUID(),
              data.email,
              hash,
              data.name,
              data.phone,
              data.role,
              data.role === "seller" ? data.storeName : "",
            ],
          )
        ).rows[0];
      } catch (error) {
        if (error.code === "23505") fail(409, "EMAIL_UNAVAILABLE");
        throw error;
      }
      reply.code(201);
      return createSession(reply, user);
    },
  );
  // Equal-cost comparison for unknown accounts avoids an obvious timing leak.
  const dummyHash = await hashPassword(token());
  app.post(
    "/api/auth/login",
    { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } },
    async (request, reply) => {
      const data = z
        .object({
          email,
          password: z.string().min(1).max(128),
          remember: z.boolean().default(false),
        })
        .parse(request.body);
      const user = (
        await db.query("SELECT * FROM users WHERE email=$1", [data.email])
      ).rows[0];
      const valid = await verifyPassword(
        data.password,
        user?.password_hash || dummyHash,
      );
      if (!user || !valid) fail(401, "INVALID_CREDENTIALS");
      if (request.cookies.stroy_session)
        await db.query("DELETE FROM sessions WHERE token_hash=$1", [
          digest(request.cookies.stroy_session),
        ]);
      return createSession(reply, user, data.remember);
    },
  );
  app.post(
    "/api/auth/logout",
    { preHandler: app.authenticate },
    async (request, reply) => {
      await db.query("DELETE FROM sessions WHERE token_hash=$1", [
        digest(request.cookies.stroy_session),
      ]);
      reply.clearCookie("stroy_session", cookieOptions);
      return { ok: true };
    },
  );
  app.post(
    "/api/auth/forgot-password",
    { config: { rateLimit: { max: 3, timeWindow: "15 minutes" } } },
    async (request) => {
      const data = z
        .object({ email, consent: z.literal(true) })
        .parse(request.body);
      if (!sendReset) fail(503, "MAIL_NOT_CONFIGURED");
      const user = (
        await db.query("SELECT * FROM users WHERE email=$1", [data.email])
      ).rows[0];
      if (user) {
        const raw = token();
        await db.query("DELETE FROM password_resets WHERE user_id=$1", [
          user.id,
        ]);
        await db.query(
          "INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
          [digest(raw), user.id, new Date(Date.now() + 30 * 60000)],
        );
        try {
          await sendReset(
            user.email,
            new URL("/reset-password?token=" + raw, env.APP_ORIGIN).href,
          );
        } catch {
          /* Never disclose account existence or SMTP details to the caller. */
        }
      }
      return { ok: true };
    },
  );
  app.post(
    "/api/auth/reset-password",
    { config: { rateLimit: { max: 10, timeWindow: "15 minutes" } } },
    async (request) => {
      const data = z
        .object({ token: z.string().regex(/^[a-f0-9]{64}$/), password })
        .parse(request.body);
      const hash = await hashPassword(data.password);
      await db.transaction(async (tx) => {
        const reset = (
          await tx.query(
            "DELETE FROM password_resets WHERE token_hash=$1 AND expires_at>now() RETURNING user_id",
            [digest(data.token)],
          )
        ).rows[0];
        if (!reset) fail(400, "RESET_EXPIRED");
        await tx.query("UPDATE users SET password_hash=$1 WHERE id=$2", [
          hash,
          reset.user_id,
        ]);
        await tx.query("DELETE FROM sessions WHERE user_id=$1", [
          reset.user_id,
        ]);
        await tx.query("DELETE FROM password_resets WHERE user_id=$1", [
          reset.user_id,
        ]);
      });
      return { ok: true };
    },
  );
}
