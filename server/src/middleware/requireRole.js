const httpError = require("../utils/httpError");

module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;

    if (!role) return httpError(res, 401, "Unauthorized.");
    if (!allowedRoles.includes(role)) return httpError(res, 403, "Forbidden.");

    next();
  };
};
