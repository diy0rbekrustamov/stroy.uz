import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectDatabase, migrate } from "../db.js";
import { buildApp } from "../app.js";

test("Delivery stores coordinates, isolates buyers/sellers and accepts only fresh locations through revocable driver links", async () => {
  const db = await connectDatabase({API_EMBEDDED_DB:"1",API_DATA_DIR:"memory://"});
  await migrate(db);
  const app = await buildApp({db});
  const call = async (method,url,body,auth={}) => {
    const result = await app.inject({method,url,...(body !== undefined ? {payload:body} : {}),headers:{...(body !== undefined ? {"content-type":"application/json"} : {}),...auth}});
    return {status:result.statusCode,data:result.json(),headers:result.headers};
  };
  const register = async role => {
    const result = await call("POST","/api/auth/register",{email:randomUUID()+"@example.test",name:"Test",password:"test-pass-123",phone:"+998901234567",role,storeName:role==="seller" ? "Store" : "",consent:true});
    assert.equal(result.status,201);
    return {cookie:result.headers["set-cookie"].split(";")[0],"x-csrf-token":result.data.csrf};
  };
  try {
    const buyer = await register("buyer"), stranger = await register("buyer"), seller = await register("seller"), otherSeller = await register("seller");
    const product = await call("POST","/api/seller/products",{name:"Blocks",city:"Bukhara",category:"Materials",categoryId:"bricks",unit:"pc",price:100,stock:20,published:true},seller);
    assert.equal(product.status,201);
    const body = {idempotencyKey:randomUUID(),address:"Bukhara site 12",phone:"+998901234567",consent:true,delivery:{point:{lat:39.77,lng:64.42},note:"Gate 2"},items:[{id:product.data.item.id,quantity:2}]};
    assert.equal((await call("POST","/api/orders",{...body,delivery:{point:{lat:999,lng:0}}},buyer)).status,400);
    const created = await call("POST","/api/orders",body,buyer);assert.equal(created.status,201);
    const id = created.data.order.id;
    assert.deepEqual(created.data.order.delivery,body.delivery);
    const delivery = await call("GET",`/api/orders/${id}/delivery`,undefined,buyer);
    const item = delivery.data.items[0].id;
    assert.equal((await call("GET",`/api/orders/${id}/delivery`,undefined,stranger)).status,404);
    assert.equal((await call("GET",`/api/orders/${id}/delivery`)).status,401);
    assert.equal((await call("POST",`/api/seller/orders/${item}/driver`,{},otherSeller)).status,404);
    assert.equal((await call("POST",`/api/seller/orders/${item}/driver`,{},seller)).status,409);
    await call("PATCH",`/api/seller/orders/${item}`,{status:"accepted"},seller);
    const link = await call("POST",`/api/seller/orders/${item}/driver`,{},seller);assert.equal(link.status,200);
    const driver = {"x-delivery-token":link.data.token};
    const info = await call("GET","/api/delivery/driver",undefined,driver);
    assert.equal(info.data.address,body.address);assert.equal(info.data.phone,undefined);
    const location = {lat:39.78,lng:64.43,accuracy:10,capturedAt:new Date().toISOString()};
    assert.equal((await call("POST","/api/delivery/driver/location",location,driver)).status,409);
    await call("PATCH",`/api/seller/orders/${item}`,{status:"shipped"},seller);
    assert.equal((await call("POST","/api/delivery/driver/location",{...location,capturedAt:new Date(Date.now()-300000).toISOString()},driver)).status,400);
    assert.equal((await call("POST","/api/delivery/driver/location",location,driver)).status,200);
    const live = (await call("GET",`/api/orders/${id}/delivery`,undefined,buyer)).data.items[0];
    assert.deepEqual(live.position,location);assert.equal(live.sharing,true);assert.equal(live.token_hash,undefined);
    await call("POST","/api/delivery/driver/location",{...location,lat:10,capturedAt:new Date(Date.parse(location.capturedAt)-1000).toISOString()},driver);
    assert.equal((await call("GET",`/api/orders/${id}/delivery`,undefined,buyer)).data.items[0].position.lat,location.lat);
    await call("POST","/api/delivery/driver/stop",{},driver);
    assert.equal((await call("GET",`/api/orders/${id}/delivery`,undefined,buyer)).data.items[0].sharing,false);
    await call("POST",`/api/seller/orders/${item}/driver`,{},seller);
    assert.equal((await call("POST","/api/delivery/driver/location",location,driver)).status,401);
    const fresh = await call("POST",`/api/seller/orders/${item}/driver`,{},seller);
    const newDriver = {"x-delivery-token":fresh.data.token};
    await call("DELETE",`/api/seller/orders/${item}/driver`,{},seller);
    assert.equal((await call("GET","/api/delivery/driver",undefined,newDriver)).status,401);
    const final = await call("POST",`/api/seller/orders/${item}/driver`,{},seller);
    await call("PATCH",`/api/seller/orders/${item}`,{status:"completed"},seller);
    assert.equal((await call("POST","/api/delivery/driver/location",location,{"x-delivery-token":final.data.token})).status,409);
    assert.equal((await call("GET",`/api/orders/${id}/delivery`,undefined,buyer)).data.items[0].position,null);
  } finally {await app.close();await db.close();}
});
