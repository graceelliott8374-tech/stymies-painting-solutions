function trimStr(v) {
  return typeof v === "string" ? v.trim() : "";
}

function validateContactLead(body) {
  const name = trimStr(body?.name);
  const email = trimStr(body?.email).toLowerCase();
  const phone = trimStr(body?.phone);
  const city = trimStr(body?.city);
  const message = trimStr(body?.message);
  const website = trimStr(body?.website); // honeypot

  // Honeypot: if filled, treat as bot
  if (website) {
    return { ok: false, bot: true };
  }

  const errors = {};
  if (!name) errors.name = "Name is required.";
  if (!message) errors.message = "Message is required.";

  const hasEmail = !!email;
  const hasPhone = !!phone;

  if (!hasEmail && !hasPhone) {
    errors.contact =
      "Please provide an Email or Phone number so we can contact you.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  // Your existing behavior: model requires email, so create safe placeholder if phone-only
  const normalizedEmail = hasEmail
    ? email
    : `phone-only+${Date.now()}@stymies.local`;

  const address = city; // store city/area in address

  const contactNote = hasEmail
    ? ""
    : "\n\nPreferred contact: phone (no email provided).";
  const finalMessage = message + contactNote;

  return {
    ok: true,
    value: {
      name,
      email: normalizedEmail,
      phone,
      address,
      message: finalMessage,
    },
  };
}

function validateLeadCreate(body) {
  const name = trimStr(body?.name);
  const email = trimStr(body?.email).toLowerCase();
  const phone = trimStr(body?.phone);
  const serviceType = trimStr(body?.serviceType);
  const message = trimStr(body?.message);
  const website = trimStr(body?.website); // honeypot

  // Honeypot: if filled, treat as bot
  if (website) {
    return { ok: false, bot: true };
  }

  const errors = {};
  if (!name) errors.name = "Name is required.";
  if (!email) errors.email = "Email is required.";
  if (!serviceType) errors.serviceType = "Type of Service is required.";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone,
      serviceType,
      message,
    },
  };
}

module.exports = {
  validateContactLead,
  validateLeadCreate,
};
