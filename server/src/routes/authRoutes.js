const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { validateLogin } = require("../validators/authValidators");
const crypto = require("crypto");

const router = express.Router();

function makeAccessToken(admin) {
  // short-lived token used for auth checks
  return jwt.sign(
    { id: admin._id.toString(), email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRES_IN || "15m" },
  );
}

function makeRefreshToken(admin) {
  // long-lived token used ONLY to mint new access tokens
  return jwt.sign(
    { id: admin._id.toString() },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRES_IN || "14d" },
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const result = validateLogin(req.body);

    if (!result.ok) {
      return httpError(res, 400, "Validation error", result.errors);
    }

    const { email, password } = result.value;

    const admin = await Admin.findOne({ email });
    if (!admin) return httpError(res, 401, "Invalid credentials.");

    const ok = await bcrypt.compare(String(password), admin.passwordHash);
    if (!ok) return httpError(res, 401, "Invalid credentials.");

    const accessToken = makeAccessToken(admin);
    const refreshToken = makeRefreshToken(admin);

    const isProd = process.env.NODE_ENV === "production";

    const accessMs = 15 * 60 * 1000; // 15 minutes
    const refreshMs = 14 * 24 * 60 * 60 * 1000; // 14 days

    // Access token cookie (short-lived)
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: accessMs,
    });

    // Refresh token cookie (long-lived, used for /refresh)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: refreshMs,
      path: "/api/auth", // cookie only sent to refresh endpoint
    });

    // Store refresh session (hashed) for this device
    admin.refreshTokens.push({
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshMs),
      userAgent: req.get("user-agent") || "",
      ip: req.ip || "",
    });

    await admin.save();

    res.json({
      ok: true,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  }),
);

// POST /api/auth/refresh
router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return httpError(res, 401, "Unauthorized.");

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      );
    } catch {
      return httpError(res, 401, "Unauthorized.");
    }

    const admin = await Admin.findById(payload.id);
    if (!admin) return httpError(res, 401, "Unauthorized.");

    const refreshMs = 14 * 24 * 60 * 60 * 1000; // 14 days
    const accessMs = 15 * 60 * 1000; // 15 minutes

    const currentHash = hashToken(refreshToken);
    const idx = admin.refreshTokens.findIndex(
      (t) => t.tokenHash === currentHash,
    );

    // token not found (revoked / rotated / stolen)
    if (idx === -1) {
      // Clear cookie so client stops trying
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/api/auth", // <-- MUST match the cookie path you set
      });
      return httpError(res, 401, "Unauthorized.");
    }

    // Rotate refresh token: remove old session, issue new refresh token
    admin.refreshTokens.splice(idx, 1);

    const newRefreshToken = makeRefreshToken(admin);
    admin.refreshTokens.push({
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + refreshMs),
      userAgent: req.get("user-agent") || "",
      ip: req.ip || "",
    });

    await admin.save();

    // Issue new access token
    const newAccessToken = makeAccessToken(admin);

    // Set cookies
    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: accessMs,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: refreshMs,
      path: "/api/auth",
    });

    res.json({ ok: true });
  }),
);

// POST /api/auth/logout
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const isProd = process.env.NODE_ENV === "production";

    // Revoke just THIS device/session refresh token if present
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const payload = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        );

        const admin = await Admin.findById(payload.id);
        if (admin) {
          const h = hashToken(refreshToken);
          admin.refreshTokens = admin.refreshTokens.filter(
            (t) => t.tokenHash !== h,
          );
          await admin.save();
        }
      } catch {
        // If token is bad/expired, we still clear cookies below
      }
    }

    // Clear access cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    });

    // Clear refresh cookie (MUST match the cookie options used when setting it, especially path)
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/api/auth",
    });

    res.json({ ok: true });
  }),
);

// GET /api/auth/me
router.get("/me", (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return httpError(res, 401, "Unauthorized.");

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true, user: payload });
  } catch {
    return httpError(res, 401, "Unauthorized.");
  }
});

module.exports = router;
