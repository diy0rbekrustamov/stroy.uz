import { readFile,mkdir } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

export async function connectDatabase(env = process.env) {
  if (env.DATABASE_URL) {
    const pool = new pg.Pool({connectionString:env.DATABASE_URL,max:10,connectionTimeoutMillis:5000});
    return {
      query:(sql,params) => pool.query(sql,params),
      exec:sql => pool.query(sql),
      async transaction(work) {
        const client = await pool.connect();
        try { await client.query("BEGIN"); const result = await work(client); await client.query("COMMIT"); return result; }
        catch(error) { await client.query("ROLLBACK"); throw error; }
        finally { client.release(); }
      },
      close:() => pool.end(),
    };
  }
  if (env.API_EMBEDDED_DB !== "1" || env.NODE_ENV === "production")
    throw new Error("Set DATABASE_URL. API_EMBEDDED_DB=1 is only allowed for local development.");
  const { PGlite } = await import("@electric-sql/pglite");
  const directory=env.API_DATA_DIR || ".data/postgres";
  if(directory !== "memory://")await mkdir(path.dirname(path.resolve(directory)),{recursive:true});
  const db = new PGlite(directory);
  return {query:(...args)=>db.query(...args),exec:sql=>db.exec(sql),transaction:work=>db.transaction(work),close:()=>db.close()};
}

export async function migrate(db) {
  const sql = await readFile(new URL("./migrations/001_initial.sql",import.meta.url),"utf8");
  await db.transaction(async tx => {
    // SQL is checked in; never interpolate request data here.
    if(tx.exec) await tx.exec(sql); else await tx.query(sql);
  });
}
