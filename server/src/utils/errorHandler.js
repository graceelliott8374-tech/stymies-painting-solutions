import AppError from "./AppError.js";

export default function errorHandler(err, req, res, next) {
  // If something throws a plain Error, convert it
  const statusCode = err.statusCode || 500;
  const code = err.code || (statusCode >= 500 ? "SERVER_ERROR" : "BAD_REQUEST");

  const payload = {
    success: false,
    code,
    message: err.message || "Something went wrong.",
  };

  if (err.details) payload.details = err.details;

  // Helpful in dev, quiet in prod. Humans love leaking stack traces.
  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
    if (!err.isOperational) payload.originalError = String(err);
  }

  res.status(statusCode).json(payload);
}
