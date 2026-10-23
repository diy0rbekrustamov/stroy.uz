import { createServer } from "vite";
import { connectDatabase,migrate } from "../server/db.js";
if(process.argv.includes("--local")) {
 if(process.env.NODE_ENV==="production")throw new Error("Local seed is not allowed in production.");
 process.env.API_EMBEDDED_DB="1";
}
if(process.env.NODE_ENV==="production")throw new Error("Demo seed must not be run in production.");
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:"custom"});
const db=await connectDatabase();
try {
 await migrate(db);
 const {catalogProducts}=await vite.ssrLoadModule("/src/data/catalogData.js");
 const {serviceCatalog}=await vite.ssrLoadModule("/src/data/serviceCatalog.js");
 await db.transaction(async tx=>{
  for(const [items,kind] of [[catalogProducts,"product"],[serviceCatalog,"service"]])for(const item of items) {
   const {image:_image,...data}=item;
   data.imageKey=item.id;data.image="";data.demo=true;
   await tx.query("INSERT INTO listings(id,kind,data,price,stock,published) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO NOTHING",
    [item.id,kind,JSON.stringify(data),item.price,kind==="product" ? 100 : 0,kind==="product" || item.available]);
  }
 });
 process.stdout.write("Demo catalog seeded. No login accounts were created.\n");
} finally {await vite.close();await db.close();}
