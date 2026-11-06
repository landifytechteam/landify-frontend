/**
 * Turn an axios error into one readable sentence.
 * NestJS validation errors send `message` as an array of strings.
 */
export function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(" ");
  return message || fallback;
}

/** "nelsondaniel1234@gmail.com" -> "nelsondaniel****@gmail.com" */
export function maskEmail(email = "") {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.length > 4 ? local.slice(0, -4) : local.slice(0, 1);
  return `${visible}****@${domain}`;
}