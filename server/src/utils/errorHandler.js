module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode >= 500 ? "SERVER_ERROR" : "BAD_REQUEST");

  const payload = {
    success: false,
    code,
    message: err.message || "Something went wrong.",
  };

  if (err.details) payload.details = err.details;

  // Helpful in dev, quiet in prod
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
    if (!err.isOperational) payload.originalError = String(err);
  }

  res.status(statusCode).json(payload);
};
