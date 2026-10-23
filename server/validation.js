import { z } from "zod";
export const email = z.string().trim().toLowerCase().email().max(254);
export const password = z.string().min(8).max(128).regex(/\p{L}/u).regex(/\d/);
export const phone = z
  .string()
  .transform((value) => value.replace(/[\s()-]/g, ""))
  .pipe(z.string().regex(/^\+998\d{9}$/));
export const text = (max = 250) => z.string().trim().min(1).max(max);
export const registration = z
  .object({
    email,
    password,
    name: text(100),
    phone,
    role: z.enum(["buyer", "seller"]),
    storeName: z.string().trim().max(150).default(""),
    consent: z.literal(true),
  })
  .refine((data) => data.role !== "seller" || data.storeName.length > 0, {
    path: ["storeName"],
    message: "Store name is required",
  });
export const listing = z.object({
  name: text(150),
  description: z.string().trim().max(4000).default(""),
  details: z.string().trim().max(2000).default(""),
  category: text(100),
  categoryId: z.string().max(40).default(""),
  price: z.number().int().min(0).max(1000000000),
  stock: z.number().int().min(0).max(1000000).default(0),
  unit: text(30),
  city: text(100),
  brand: z.string().trim().max(100).default(""),
  image: z
    .string()
    .max(500)
    .refine(
      (value) =>
        value === "" ||
        /^https:\/\//.test(value) ||
        /^\/api\/media\/[a-f0-9-]+\.(png|jpg|webp)$/.test(value),
    )
    .default(""),
  published: z.boolean().default(false),
});
export function fail(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
}
