import { api } from "./client.js";
export async function uploadImage(file) {
 if(!file)return "";
 const session=await api("/auth/me"),body=new FormData();body.append("file",file);
 const response=await fetch("/api/media",{method:"POST",credentials:"same-origin",headers:{"X-CSRF-Token":session.csrf || ""},body});
 const data=await response.json();
 if(!response.ok)throw new Error("Не удалось загрузить изображение. Используйте JPG, PNG или WebP до 5 МБ.");
 return data.url;
}
