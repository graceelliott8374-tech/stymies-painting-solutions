function httpError(res, status, message, details) {
  const payload = {
    success: false,
    message,
  };

  if (details) payload.details = details;

  return res.status(status).json(payload);
}

module.exports = httpError;
