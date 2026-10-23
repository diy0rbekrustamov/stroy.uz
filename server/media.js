import multipart from "@fastify/multipart";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fail } from "./validation.js";
export async function mediaRoutes(app, { env }) {
  await app.register(multipart, {
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 0 },
  });
  const root = path.resolve(env.MEDIA_DIR || ".data/uploads");
  app.post(
    "/api/media",
    {
      preHandler: app.sellerOnly,
      config: { rateLimit: { max: 15, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      const file = await request.file();
      if (!file) fail(400, "IMAGE_REQUIRED");
      const bytes = await file.toBuffer();
      const ext = bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        ? "png"
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          ? "jpg"
          : bytes.toString("ascii", 0, 4) === "RIFF" &&
              bytes.toString("ascii", 8, 12) === "WEBP"
            ? "webp"
            : null;
      if (!ext || bytes.length < 32) fail(400, "INVALID_IMAGE");
      await mkdir(root, { recursive: true });
      const name = randomUUID() + "." + ext;
      await writeFile(path.join(root, name), bytes, { flag: "wx" });
      reply.code(201);
      return { url: "/api/media/" + name };
    },
  );
  app.get("/api/media/:name", async (request, reply) => {
    if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(request.params.name))
      fail(404, "NOT_FOUND");
    try {
      const bytes = await readFile(path.join(root, request.params.name));
      const ext = request.params.name.split(".").pop();
      reply
        .type("image/" + (ext === "jpg" ? "jpeg" : ext))
        .header("Cache-Control", "public,max-age=86400");
      return reply.send(bytes);
    } catch {
      fail(404, "NOT_FOUND");
    }
  });
}
