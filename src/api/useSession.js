import { useEffect,useState } from "react";
import { api } from "./client.js";
export function useSession() {
 const [session,setSession]=useState({user:null,loading:true,error:""});
 useEffect(()=>{
  let active=true;
  const reload=()=>api("/auth/me").then(data=>{if(active)setSession({...data,loading:false,error:""});}).catch(error=>{if(active)setSession({user:null,loading:false,error:error.message});});
  reload();window.addEventListener("stroy-session",reload);
  return ()=>{active=false;window.removeEventListener("stroy-session",reload);};
 },[]);
 return session;
}
