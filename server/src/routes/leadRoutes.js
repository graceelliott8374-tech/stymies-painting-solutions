const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const requireAuth = require("../middleware/requireAuth");

const rateLimit = require("express-rate-limit");

const createLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

// POST /api/leads/contact  (PUBLIC short contact form)
router.post("/contact", createLeadLimiter, async (req, res) => {
  try {
    // If DB isn't configured yet, don't pretend it worked.
    if (!process.env.MONGO_URI) {
      return res.status(503).json({
        error: "Database not configured yet. Lead saving is disabled for now.",
      });
    }

    const { name, email, phone, city, message, website } = req.body;

    // Honeypot: bots often fill hidden fields
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true }); // pretend success to waste bot time
    }

    // Minimal validation for contact form
    if (!name || !message) {
      return res.status(400).json({
        error: "Name and Message are required.",
      });
    }

    // Require at least one contact method
    const hasEmail = !!(email && String(email).trim());
    const hasPhone = !!(phone && String(phone).trim());

    if (!hasEmail && !hasPhone) {
      return res.status(400).json({
        error: "Please provide an Email or Phone number so we can contact you.",
      });
    }

    // Lead model requires email. If user provided only phone, store a safe placeholder email.
    const normalizedEmail = hasEmail
      ? String(email).trim().toLowerCase()
      : `phone-only+${Date.now()}@stymies.local`;

    // Store city/area in address (model already has address)
    const address = city ? String(city).trim() : "";

    // Add context to message so admin understands how to reply
    const safeMessage = String(message).trim();
    const contactNote = hasEmail ? "" : "\n\nPreferred contact: phone (no email provided).";
    const finalMessage = safeMessage + contactNote;

    const lead = await Lead.create({
      name: String(name).trim(),
      email: normalizedEmail,
      phone: hasPhone ? String(phone).trim() : "",
      address,
      serviceType: "General Inquiry",
      message: finalMessage,
    });

    return res.status(201).json(lead);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// POST /api/leads
router.post("/", createLeadLimiter, async (req, res) => {
  try {
    // If DB isn't configured yet, don't pretend it worked.
    if (!process.env.MONGO_URI) {
      return res.status(503).json({
        error: "Database not configured yet. Lead saving is disabled for now.",
      });
    }

    const { name, email, phone, serviceType, message, website } = req.body;
    // Honeypot: bots often fill hidden fields
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true }); // pretend success to waste bot time
    }

    // Minimal validation
    if (!name || !email || !serviceType) {
      return res.status(400).json({
        error: "Name, Email, and Type of Service are required.",
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      serviceType,
      message: message ? message.trim() : "",
    });

    return res.status(201).json(lead);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});
router.use(requireAuth);

// PATCH /api/leads/:id/admin-notes  (ADMIN)
router.patch("/:id/admin-notes", async (req, res) => {
  try {
    const { adminNotes } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { adminNotes: adminNotes ? String(adminNotes).trim() : "" },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// GET /api/leads
router.get("/", async (req, res) => {
  try {
    const showArchived = req.query.archived === "true";

    const query = showArchived ? {} : { archived: { $ne: true } };

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return res.json(leads);
  } catch (err) {
    // DB not connected yet — safe fallback
    return res.status(200).json([]);
  }
});

// GET /api/leads/:id
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(lead);
  } catch (err) {
    return res.status(400).json({ error: "Invalid lead id." });
  }
});

// PATCH /api/leads/:id  (edit lead fields)
router.patch("/:id", async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "address",
      "serviceType",
      "message",
    ];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        const val = req.body[key];

        // Light normalization
        if (typeof val === "string") updates[key] = val.trim();
        else updates[key] = val;
      }
    }

    // Optional: basic email normalization
    if (updates.email) updates.email = updates.email.toLowerCase();

    // If nothing valid was provided
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided to update." });
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["new", "contacted", "quoted", "scheduled", "closed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/archive
router.patch("/:id/archive", async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// PATCH /api/leads/:id/unarchive
router.patch("/:id/unarchive", async (req, res) => {
  try {
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { archived: false },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE /api/leads/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Lead not found." });
    }

    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
