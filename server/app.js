import Fastify, { LogController } from "fastify";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { authRoutes } from "./auth.js";
import { catalogRoutes } from "./catalog.js";
import { commerceRoutes } from "./commerce.js";
import { mediaRoutes } from "./media.js";

export async function buildApp({
  db,
  env = {
    ...process.env,
    APP_ORIGIN: process.env.APP_ORIGIN || "http://127.0.0.1:5173",
  },
  sendReset,
  logger = false,
}) {
  const app = Fastify({
    logger,
    bodyLimit: 1024 * 1024,
    trustProxy: Number(env.TRUST_PROXY_HOPS || 0),
    logController: new LogController({ disableRequestLogging: true }),
  });
  await app.register(cookie);
  await app.register(rateLimit, { max: 300, timeWindow: "1 minute" });
  app.addHook("onRequest", async (request, reply) => {
    reply.header("Cache-Control", "no-store");
    reply.header("X-Content-Type-Options", "nosniff");
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      // The browser frontend and API share one origin via reverse proxy.
      // CORS is intentionally not enabled. Non-browser clients use JSON.
      if (request.headers.origin && request.headers.origin !== env.APP_ORIGIN)
        return reply.code(403).send({ error: "ORIGIN_REJECTED" });
      if (request.headers["sec-fetch-site"] === "cross-site")
        return reply.code(403).send({ error: "ORIGIN_REJECTED" });
      const type = request.headers["content-type"]?.split(";")[0];
      if (
        type !== "application/json" &&
        !(request.url === "/api/media" && type === "multipart/form-data")
      )
        return reply.code(415).send({ error: "JSON_REQUIRED" });
    }
  });
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError)
      return reply.code(400).send({
        error: "VALIDATION_FAILED",
        fields: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    if (error.statusCode >= 400 && error.statusCode < 500)
      return reply.code(error.statusCode).send({ error: error.message });
    if (error.statusCode === 503)
      return reply.code(503).send({ error: error.message });
    // Never log request bodies, passwords, session cookies or database error detail.
    request.log.error(
      { code: error.code || "INTERNAL_ERROR" },
      "API request failed",
    );
    return reply.code(500).send({ error: "INTERNAL_ERROR" });
  });
  app.get("/api/health", async () => {
    await db.query("SELECT 1");
    return { ok: true };
  });
  await authRoutes(app, { db, env, sendReset });
  await mediaRoutes(app, { env });
  catalogRoutes(app, { db });
  commerceRoutes(app, { db });
  return app;
}
