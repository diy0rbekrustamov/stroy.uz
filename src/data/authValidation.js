export function validateAuthForm({ email, password, consent }, mode = "login") {
  const errors = {};
  if (!email.trim()) errors.email = "Введите email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Введите корректный email";
  if (mode === "login" && !password) errors.password = "Введите пароль";
  if (!consent) errors.consent = "Подтвердите согласие перед продолжением.";
  return errors;
}
