function trimStr(v) {
  return typeof v === "string" ? v.trim() : "";
}

function validateLogin(body) {
  const email = trimStr(body?.email).toLowerCase();
  const password = trimStr(body?.password);

  const errors = {};
  if (!email) errors.email = "Email is required.";
  if (!password) errors.password = "Password is required.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, value: { email, password } };
}

module.exports = { validateLogin };
