/* eslint-env node */

class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    code = "SERVER_ERROR",
    details = null,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code; // stable string for frontend logic
    this.details = details; // optional: field errors, extra context
    this.isOperational = true;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

module.exports = AppError;
