import { connectDatabase, migrate } from "./db.js";
import { buildApp } from "./app.js";
import nodemailer from "nodemailer";

const env = {
  ...process.env,
  APP_ORIGIN: process.env.APP_ORIGIN || "http://127.0.0.1:5173",
};
if (
  env.NODE_ENV === "production" &&
  (!env.APP_ORIGIN.startsWith("https://") || !env.DATABASE_URL)
)
  throw new Error("Production requires HTTPS APP_ORIGIN and DATABASE_URL.");
const db = await connectDatabase(env);
await migrate(db);
let sendReset;
if (env.SMTP_HOST && env.SMTP_FROM) {
  const transport = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT || 587),
    secure: env.SMTP_SECURE === "true",
    auth: env.SMTP_USER
      ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
      : undefined,
  });
  sendReset = (to, url) =>
    transport.sendMail({
      from: env.SMTP_FROM,
      to,
      subject: "STROY UZ — password reset",
      text: "Reset your password within 30 minutes:\n" + url,
    });
}
const app = await buildApp({ db, env, sendReset, logger: true });
app.addHook("onClose", () => db.close());
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
await app.listen({
  host: env.API_HOST || "127.0.0.1",
  port: Number(env.API_PORT || 3001),
});
