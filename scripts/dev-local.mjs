// One-command local demo: persistent embedded PostgreSQL, API, Vite.
// This script is for development only; no accounts/passwords are stored in the browser.
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { existsSync } from "node:fs";

if (process.env.NODE_ENV === "production") {
  throw new Error("Local demo mode is disabled in production.");
}
if (existsSync(resolve(".env")) && process.loadEnvFile) {
  process.loadEnvFile(resolve(".env"));
}
if (process.env.DATABASE_URL) {
  throw new Error("Local demo script cannot seed a remote DATABASE_URL. Use npm run dev:web and npm run api separately.");
}
const env = {
  ...process.env,
  NODE_ENV: "development",
  API_EMBEDDED_DB: "1",
  APP_ORIGIN: process.env.APP_ORIGIN || "http://127.0.0.1:5173",
  API_HOST: process.env.API_HOST || "127.0.0.1",
  API_PORT: process.env.API_PORT || "3001",
};
const children = [];
let stopping = false;
const launch = (path, args = [], stopOnExit = true) => {
  const child = spawn(process.execPath, ["--env-file-if-exists=.env", resolve(path), ...args], {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
    windowsHide: true,
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(error);
    shutdown(1);
  });
  child.on("exit", (code) => {
    if (!stopping && stopOnExit) shutdown(code || 1);
  });
  return child;
};
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (child.exitCode === null) child.kill();
  process.exitCode = code;
}
process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
process.on("exit", () => { for (const child of children) if (child.exitCode === null) child.kill(); });

// First seed the demo products, then release the PGlite file lock and start API.
// Existing accounts and listings are retained (seed uses ON CONFLICT DO NOTHING).
console.log("[STROY UZ] Preparing persistent local database…");
if (!existsSync(resolve("node_modules/vite/bin/vite.js"))) {
  throw new Error("Run npm install before starting the project.");
}
const seed = launch("scripts/seed-api.mjs", ["--local"], false);
const status = await new Promise((resolveStatus) => seed.once("exit", resolveStatus));
if (status !== 0) {
  console.error("[STROY UZ] Database seed failed; API and storefront were not started.");
  process.exitCode = status || 1;
} else if (!stopping) {
  console.log(`[STROY UZ] Storefront: ${env.APP_ORIGIN}`);
  console.log(`[STROY UZ] API:       http://${env.API_HOST}:${env.API_PORT}/api/health`);
  console.log("[STROY UZ] Registration: /register  |  Login: /login");
  launch("server/local.js");
  const host = new URL(env.APP_ORIGIN).hostname;
  launch("node_modules/vite/bin/vite.js", ["--host", host === "127.0.0.1" || host === "localhost" ? host : "0.0.0.0", "--port", "5173", "--strictPort"]);
}
