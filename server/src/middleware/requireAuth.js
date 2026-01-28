const jwt = require("jsonwebtoken");

module.exports = function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Unauthorized." });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email, role }
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized." });
  }
};
