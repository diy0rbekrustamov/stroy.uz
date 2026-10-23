const messages = {
 AUTH_REQUIRED:"Войдите в аккаунт, чтобы продолжить.",
 INVALID_CREDENTIALS:"Неверный email или пароль.",
 EMAIL_UNAVAILABLE:"Этот email уже используется.",
 SELLER_REQUIRED:"Для этого действия нужен аккаунт продавца.",
 VALIDATION_FAILED:"Проверьте заполнение полей.",
 OUT_OF_STOCK:"Недостаточно товара в наличии. Обновите корзину.",
 MAIL_NOT_CONFIGURED:"Почтовый сервис ещё не настроен.",
 RESET_EXPIRED:"Ссылка недействительна или срок её действия истёк.",
 NOT_FOUND:"Запись не найдена.",
 CSRF_FAILED:"Сессия изменилась. Обновите страницу.",
 INVALID_TRANSITION:"Это изменение статуса недоступно.",
};
export async function api(path,{method="GET",body}={}) {
 try {
  let csrf;
  if(method !== "GET" && !["/auth/login","/auth/register","/auth/forgot-password","/auth/reset-password"].includes(path)) {
   const session=await api("/auth/me");csrf=session.csrf;
  }
  const response=await fetch("/api"+path,{
   method,credentials:"same-origin",
   headers:{...(body !== undefined ? {"Content-Type":"application/json"} : {}),...(csrf ? {"X-CSRF-Token":csrf} : {})},
   ...(body !== undefined ? {body:JSON.stringify(body)} : {}),
  });
  const data=await response.json();
  if(!response.ok) {
   const error=new Error(messages[data.error] || (response.status===429 ? "Слишком много попыток. Повторите позже." : "Сервис временно недоступен. Повторите позже."));
   error.code=data.error;throw error;
  }
  if(["/auth/login","/auth/register","/auth/logout","/auth/reset-password"].includes(path))
   window.dispatchEvent(new Event("stroy-session"));
  return data;
 } catch(error) {
  if(error.code) throw error;
  const failure=new Error("Сервис временно недоступен. Повторите позже.");failure.code="NETWORK_ERROR";throw failure;
 }
}
