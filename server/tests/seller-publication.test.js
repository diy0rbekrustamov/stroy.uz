import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectDatabase, migrate } from "../db.js";
import { buildApp } from "../app.js";

test("A buyer can open their store; only published owned listings appear publicly, never seeded demos",async()=>{
  const db=await connectDatabase({API_EMBEDDED_DB:"1",API_DATA_DIR:"memory://"});await migrate(db);
  const app=await buildApp({db});
  const call=async(method,url,payload,auth={})=>{
    const result=await app.inject({method,url,payload,headers:{...(payload?{"content-type":"application/json"}:{}),...(auth.cookie?{cookie:auth.cookie,"x-csrf-token":auth.csrf}:{})}});
    return {status:result.statusCode,body:result.json(),headers:result.headers};
  };
  try {
    const registration=await call("POST","/api/auth/register",{email:"owner@example.test",name:"Owner",password:"test-pass-123",phone:"+998901234567",role:"buyer",consent:true});
    const auth={cookie:registration.headers["set-cookie"].split(";")[0],csrf:registration.body.csrf};
    assert.equal((await call("POST","/api/auth/seller",{storeName:"Store"})).status,401);
    assert.equal((await call("POST","/api/auth/seller",{storeName:"Store"},{...auth,csrf:"invalid"})).status,403);
    assert.equal((await call("POST","/api/auth/seller",{storeName:""},auth)).status,400);
    const upgrade=await call("POST","/api/auth/seller",{storeName:"Real Store"},auth);
    assert.equal(upgrade.body.user.role,"seller");assert.equal(upgrade.body.user.id,registration.body.user.id);
    assert.equal((await call("GET","/api/auth/me",undefined,auth)).body.user.storeName,"Real Store");
    for(const [path,kind]of[["products","product"],["services","service"],["rentals","rental"]]){
      await db.query("INSERT INTO listings(id,kind,data,price,stock,published) VALUES($1,$2,$3,10,10,true)",[randomUUID(),kind,JSON.stringify({demo:true,name:"Old demo"})]);
      assert.equal((await call("GET","/api/"+path)).body.items.length,0);
      const body={name:"Created by owner",category:"Tools",categoryId:"tools",unit:kind==="rental"?"сутки":"шт.",price:250,stock:2,city:"Бухара",description:"Owner description",published:false,...(kind==="rental"?{equipmentType:"crane",capacity:"25 t",operatorIncluded:true,deliveryAvailable:true,minDays:1}:{})};
      const created=await call("POST","/api/seller/"+path,body,auth);assert.equal(created.status,201);
      const id=created.body.item.id;
      assert.equal((await call("GET","/api/"+path)).body.items.length,0);
      assert.equal((await call("GET","/api/"+path+"/"+id)).status,404);
      assert.equal((await call("GET","/api/seller/"+path,undefined,auth)).body.items.length,1);
      await call("PUT","/api/seller/"+path+"/"+id,{...body,published:true},auth);
      const publicItems=(await call("GET","/api/"+path)).body.items;
      assert.equal(publicItems.length,1);assert.equal(publicItems[0].id,id);assert.equal(publicItems[0].sellerName,"Real Store");
      assert.equal((await call("GET","/api/"+path+"/"+id)).status,200);
      await call("DELETE","/api/seller/"+path+"/"+id,{},auth);
      assert.equal((await call("GET","/api/"+path)).body.items.length,0);
    }
  }finally{await app.close();await db.close();}
});
