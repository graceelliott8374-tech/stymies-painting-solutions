const httpError = require("../utils/httpError");

module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return httpError(res, 401, "Unauthorized.");
    }

    const role = req.user.role;

    if (!allowedRoles.includes(role)) {
      return httpError(res, 403, "Forbidden.");
    }

    next();
  };
};
