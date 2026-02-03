const jwt = require("jsonwebtoken");
const httpError = require("../utils/httpError");

module.exports = function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.token;

    if (!token) {
      const auth = req.headers.authorization || "";
      const match = auth.match(/^Bearer\s+(.+)$/i);
      token = match ? match[1].trim() : "";
    }

    if (!token) return httpError(res, 401, "Unauthorized.");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return httpError(res, 401, "Unauthorized.");
  }
};
