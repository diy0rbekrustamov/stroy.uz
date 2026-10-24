export function validateAuthForm({ email, password, consent }, mode = "login") {
  const errors = {};
  if (!email.trim()) errors.email = "Введите email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Введите корректный email";
  if (mode === "login" && !password) errors.password = "Введите пароль";
  if (mode !== "login" && !consent) errors.consent = "Подтвердите согласие перед продолжением.";
  return errors;
}

export function validateRegistration(form, role) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Введите имя";
  if (role === "seller" && !form.storeName.trim())
    errors.storeName = "Введите название";
  if (!/^\+998\d{9}$/.test(form.phone.replace(/[\s()-]/g, "")))
    errors.phone = "Введите телефон в формате +998 XX XXX XX XX";
  const shared = validateAuthForm(form, "reset");
  if (shared.email) errors.email = shared.email;
  if (
    form.password.length < 8 ||
    !/\p{L}/u.test(form.password) ||
    !/\d/.test(form.password)
  )
    errors.password = "Не менее 8 символов, буквы и цифры";
  if (!form.confirmPassword || form.confirmPassword !== form.password)
    errors.confirmPassword = "Пароли должны совпадать";
  if (shared.consent) errors.consent = shared.consent;
  return errors;
}
