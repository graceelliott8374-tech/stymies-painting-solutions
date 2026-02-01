const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const requireAuth = require("../middleware/requireAuth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { sendLeadNotification } = require("../utils/sendEmail");

const isValidObjectId = require("../utils/isValidObjectId");
const {
  validateContactLead,
  validateLeadCreate,
} = require("../validators/leadValidators");
const requireRole = require("../middleware/requireRole");

const rateLimit = require("express-rate-limit");

const createLeadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions. Please try again later.",
  },
});

// POST /api/leads/contact  (PUBLIC short contact form)
router.post(
  "/contact",
  createLeadLimiter,
  asyncHandler(async (req, res) => {
    // If DB isn't configured yet, don't pretend it worked.
    if (!process.env.MONGO_URI) {
      return httpError(
        res,
        503,
        "Database not configured yet. Lead saving is disabled for now.",
      );
    }

    const result = validateContactLead(req.body);

    // Honeypot hit: pretend success to waste bot time
    if (!result.ok && result.bot) {
      return res.status(200).json({ ok: true });
    }

    // Validation errors
    if (!result.ok) {
      return httpError(res, 400, "Validation error", result.errors);
    }

    const { name, email, phone, address, message } = result.value;

    const lead = await Lead.create({
      name,
      email,
      phone,
      address,
      serviceType: "General Inquiry",
      message,
    });
    sendLeadNotification({
      subject: "New Contact Form Submission",
      text: `
New contact form submission:

Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "N/A"}
Message:
${lead.message || "N/A"}

This lead has been saved in the dashboard.
`,
    });

    res.status(201).json(lead);
  }),
);

// POST /api/leads
router.post(
  "/",
  createLeadLimiter,
  asyncHandler(async (req, res) => {
    // If DB isn't configured yet, don't pretend it worked.
    if (!process.env.MONGO_URI) {
      return httpError(
        res,
        503,
        "Database not configured yet. Lead saving is disabled for now.",
      );
    }

    const result = validateLeadCreate(req.body);

    // Honeypot hit: pretend success to waste bot time
    if (!result.ok && result.bot) {
      return res.status(200).json({ ok: true });
    }

    // Validation errors
    if (!result.ok) {
      return httpError(res, 400, "Validation error", result.errors);
    }

    const { name, email, phone, serviceType, message } = result.value;

    const lead = await Lead.create({
      name,
      email,
      phone,
      serviceType,
      message,
    });
sendLeadNotification({
  subject: "New Estimate Request",
  text: `
New estimate request:

Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone || "N/A"}
Service Type: ${lead.serviceType || "N/A"}

Message:
${lead.message || "N/A"}

This lead has been saved in the dashboard.
`,
});

    res.status(201).json(lead);
  }),
);

router.get("/ping", (req, res) => res.json({ ok: true }));

// ...
router.use(requireAuth, requireRole("admin"));

// PATCH /api/leads/:id/admin-notes  (ADMIN)
router.patch(
  "/:id/admin-notes",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const { adminNotes } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      id,
      { adminNotes: adminNotes ? String(adminNotes).trim() : "" },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// PATCH /api/leads/:id/follow-up  (ADMIN)
router.patch(
  "/:id/follow-up",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const { followUpDate } = req.body;

    let value = null;

    if (followUpDate !== null && followUpDate !== undefined) {
      const parsed = new Date(followUpDate);
      if (isNaN(parsed.getTime())) {
        return httpError(res, 400, "Invalid follow-up date.");
      }
      value = parsed;
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { followUpDate: value },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// GET /api/leads
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const showArchived = req.query.archived === "true";
    const query = showArchived ? {} : { archived: { $ne: true } };

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  }),
);

// GET /api/leads/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(lead);
  }),
);

// PATCH /api/leads/:id  (edit lead fields)
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

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
        updates[key] = typeof val === "string" ? val.trim() : val;
      }
    }

    // Optional: basic email normalization
    if (updates.email) updates.email = String(updates.email).toLowerCase();

    // If nothing valid was provided
    if (Object.keys(updates).length === 0) {
      return httpError(res, 400, "No valid fields provided to update.");
    }

    const updated = await Lead.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// PATCH /api/leads/:id/status
router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const { status } = req.body;

    const allowed = ["new", "contacted", "quoted", "scheduled", "closed"];
    if (!allowed.includes(status)) {
      return httpError(res, 400, "Invalid status value.");
    }

    const updated = await Lead.findByIdAndUpdate(id, { status }, { new: true });

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// PATCH /api/leads/:id/archive
router.patch(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true },
    );

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// PATCH /api/leads/:id/unarchive
router.patch(
  "/:id/unarchive",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const updated = await Lead.findByIdAndUpdate(
      id,
      { archived: false },
      { new: true },
    );

    if (!updated) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json(updated);
  }),
);

// DELETE /api/leads/:id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return httpError(res, 400, "Invalid lead id.");
    }

    const deleted = await Lead.findByIdAndDelete(id);

    if (!deleted) {
      return httpError(res, 404, "Lead not found.");
    }

    res.json({ success: true });
  }),
);

module.exports = router;
