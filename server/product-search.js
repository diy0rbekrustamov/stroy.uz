import { z } from "zod";

const schema = z.object({
  q: z.string().trim().max(150).default(""),
  category: z.string().trim().max(40).default("all"),
  brand: z.string().trim().max(100).default("all"),
  min: z.coerce.number().int().min(0).max(1_000_000_000_000).optional(),
  max: z.coerce.number().int().min(0).max(1_000_000_000_000).optional(),
  stock: z.enum(["0", "1"]).default("0"),
  sort: z.enum(["popular", "price-asc", "price-desc", "name"]).default("popular"),
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(6),
  offset: z.coerce.number().int().min(0).max(1000000).optional(),
});

const orderBy = {
  popular: "created_at DESC, id ASC",
  "price-asc": "price ASC, id ASC",
  "price-desc": "price DESC, id ASC",
  name: "LOWER(COALESCE(data->>'name', '')) ASC, id ASC",
};

// This function is also used by tests. All user values are parameterized.
export async function searchProducts(db, rawQuery) {
  const query = schema.parse(rawQuery);
  const parameters = [];
  const bind = (value) => {
    parameters.push(value);
    return `$${parameters.length}`;
  };
  const where = ["kind='product'", "published=true"];
  if (query.q) {
    // Treat '%' and '_' as literal characters in search terms.
    const pattern = `%${query.q.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const marker = bind(pattern);
    where.push(`(COALESCE(data->>'name','') ILIKE ${marker} ESCAPE '\\' OR COALESCE(data->>'category','') ILIKE ${marker} ESCAPE '\\' OR COALESCE(data->>'details','') ILIKE ${marker} ESCAPE '\\' OR COALESCE(data->>'brand','') ILIKE ${marker} ESCAPE '\\')`);
  }
  if (query.category !== "all") where.push(`data->>'categoryId' = ${bind(query.category)}`);
  if (query.brand !== "all") where.push(`data->>'brand' = ${bind(query.brand)}`);
  if (query.min !== undefined) where.push(`price >= ${bind(query.min)}`);
  if (query.max !== undefined) where.push(`price <= ${bind(query.max)}`);
  if (query.stock === "1") where.push("stock > 0");
  const filter = `WHERE ${where.join(" AND ")}`;
  const total = Number((await db.query(`SELECT COUNT(*)::integer AS total FROM listings ${filter}`, parameters)).rows[0].total);
  const pages = Math.max(1, Math.ceil(total / query.limit));
  const page = query.offset === undefined ? Math.min(query.page, pages) : Math.floor(query.offset / query.limit) + 1;
  const offset = query.offset ?? (page - 1) * query.limit;
  const items = (await db.query(
    `SELECT * FROM listings ${filter} ORDER BY ${orderBy[query.sort]} LIMIT ${bind(query.limit)} OFFSET ${bind(offset)}`,
    parameters,
  )).rows;
  return { items, total, page, pages, pageSize: query.limit };
}

export async function productFacets(db) {
  const [categories, brands, maxPrice] = await Promise.all([
    db.query("SELECT data->>'categoryId' AS id, COUNT(*)::integer AS count FROM listings WHERE kind='product' AND published=true AND COALESCE(data->>'categoryId','')<>'' GROUP BY data->>'categoryId'"),
    db.query("SELECT DISTINCT data->>'brand' AS brand FROM listings WHERE kind='product' AND published=true AND COALESCE(data->>'brand','')<>'' ORDER BY brand"),
    db.query("SELECT COALESCE(MAX(price),0) AS max FROM listings WHERE kind='product' AND published=true"),
  ]);
  return {
    categories: Object.fromEntries(categories.rows.map((row) => [row.id, Number(row.count)])),
    brands: brands.rows.map((row) => row.brand),
    maxPrice: Number(maxPrice.rows[0].max),
  };
}
