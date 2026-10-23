import { randomUUID } from "node:crypto";
import { z } from "zod";
import { listing, fail } from "./validation.js";
export const presentListing = item => ({
 ...item.data,details:item.data.details || item.data.description || "",id:item.id,sellerId:item.seller_id,kind:item.kind,price:item.price,
 stock:item.stock,inStock:item.stock>0,available:item.published,published:item.published,
});
export function catalogRoutes(app,{db}) {
  for(const [path,kind] of [["products","product"],["services","service"]]) {
    app.get("/api/"+path,async request => {
      const {q="",limit=100,offset=0} = z.object({q:z.string().max(150).optional(),limit:z.coerce.number().int().min(1).max(100).optional(),offset:z.coerce.number().int().min(0).max(100000).optional()}).parse(request.query);
      const {rows} = await db.query("SELECT * FROM listings WHERE kind=$1 AND published=true AND ($2='' OR data->>'name' ILIKE $3 OR data->>'category' ILIKE $3) ORDER BY created_at DESC,id LIMIT $4 OFFSET $5",[kind,q,"%"+q+"%",limit,offset]);
      return {items:rows.map(presentListing)};
    });
    app.get("/api/"+path+"/:id",async request => {
      const item = (await db.query("SELECT * FROM listings WHERE id=$1 AND kind=$2 AND published=true",[request.params.id,kind])).rows[0];
      if(!item) fail(404,"NOT_FOUND");
      return {item:presentListing(item)};
    });
    app.get("/api/seller/"+path,{preHandler:app.sellerOnly},async request => {
      return {items:(await db.query("SELECT * FROM listings WHERE seller_id=$1 AND kind=$2 ORDER BY created_at DESC",[request.account.id,kind])).rows.map(presentListing)};
    });
    app.post("/api/seller/"+path,{preHandler:app.sellerOnly},async(request,reply) => {
      const {price,stock,published,...data} = listing.parse(request.body);
      const item = (await db.query("INSERT INTO listings(id,seller_id,kind,data,price,stock,published) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [randomUUID(),request.account.id,kind,JSON.stringify(data),price,stock,published])).rows[0];
      reply.code(201); return {item:presentListing(item)};
    });
    app.put("/api/seller/"+path+"/:id",{preHandler:app.sellerOnly},async request => {
      const {price,stock,published,...data} = listing.parse(request.body);
      const item = (await db.query("UPDATE listings SET data=$1,price=$2,stock=$3,published=$4 WHERE id=$5 AND seller_id=$6 AND kind=$7 RETURNING *",
        [JSON.stringify(data),price,stock,published,request.params.id,request.account.id,kind])).rows[0];
      if(!item) fail(404,"NOT_FOUND");
      return {item:presentListing(item)};
    });
    app.delete("/api/seller/"+path+"/:id",{preHandler:app.sellerOnly},async request => {
      const result = await db.query("UPDATE listings SET published=false WHERE id=$1 AND seller_id=$2 AND kind=$3 RETURNING id",[request.params.id,request.account.id,kind]);
      if(!result.rows.length) fail(404,"NOT_FOUND");
      return {ok:true};
    });
  }
}
