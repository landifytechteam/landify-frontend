const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Nigerian numbers: +234 / 234 / 0, then 10 digits starting 7, 8 or 9.
const NG_PHONE_RE = /^(\+?234|0)[789]\d{9}$/;

export const isEmail = (value) => EMAIL_RE.test(value.trim());
export const isNigerianPhone = (value) => NG_PHONE_RE.test(value.replace(/[\s-]/g, ""));
export const isStrongPassword = (value) =>
  value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

export function validateSignup(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!isNigerianPhone(values.phone)) errors.phone = "Enter a valid Nigerian phone number.";
  if (!isStrongPassword(values.password)) errors.password = "Password doesn't meet the rules below.";
  if (!values.confirmPassword) errors.confirmPassword = "Repeat your password.";
  else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match.";
  if (!values.accountType) errors.accountType = "Choose an account type.";
  if (!values.agree) errors.agree = "Please accept the terms to continue.";
  return errors;
}

export function validateLogin(values) {
  const errors = {};
  if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}