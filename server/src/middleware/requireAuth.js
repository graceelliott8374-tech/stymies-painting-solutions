const jwt = require("jsonwebtoken");
const httpError = require("../utils/httpError");

module.exports = function requireAuth(req, res, next) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) return httpError(res, 401, "Unauthorized.");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return httpError(res, 401, "Unauthorized.");
  }
};
