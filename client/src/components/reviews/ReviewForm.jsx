import React, { useMemo, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

import PaintbrushRating from "./PaintbrushRating"; // adjust if your component name/path differs

function clampRating(n) {
  const v = Number(n) || 0;
  if (v < 0) return 0;
  if (v > 5) return 5;
  return Math.round(v);
}

export default function ReviewForm({ onSubmitted }) {
  const serviceOptions = useMemo(
    () => [
      "Interior Painting",
      "Exterior Painting",
      "Cabinet Painting",
      "Deck / Fence Staining",
      "Drywall Repair",
      "Commercial",
      "Other",
    ],
    [],
  );

  const [form, setForm] = useState({
    firstName: "",
    lastInitial: "",
    serviceType: "",
    city: "",
    serviceDate: "", // yyyy-mm
    rating: 0,
    reviewText: "",
  });

  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const errors = useMemo(() => {
    const e = {};

    if (!String(form.firstName || "").trim())
      e.firstName = "First name is required.";
    if (!String(form.lastInitial || "").trim())
      e.lastInitial = "Last initial is required.";
    if (String(form.lastInitial || "").trim().length > 1)
      e.lastInitial = "Use one letter.";
    if (!form.serviceType) e.serviceType = "Service type is required.";
    if (!clampRating(form.rating)) e.rating = "Rating is required.";
    if (!String(form.reviewText || "").trim())
      e.reviewText = "Review text is required.";

    return e;
  }, [form]);

  const canSubmit = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    // If there are actual errors, stop here (and let UI display them)
    if (!canSubmit) return;

    const payload = {
      firstName: String(form.firstName || "").trim(),
      lastInitial: String(form.lastInitial || "")
        .trim()
        .slice(0, 1)
        .toUpperCase(),
      serviceType: form.serviceType || "",
      city: String(form.city || "").trim(),
      serviceDate: String(form.serviceDate || "").slice(0, 7), // YYYY-MM
      rating: Number(clampRating(form.rating)),
      reviewText: String(form.reviewText || "").trim(),
    };

    try {
      setSubmitting(true);
      setServerError("");

      const res = await apiFetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit review.");
      }

      setSubmitted(true);

      // 🔥 KEY FIX: stop showing “required” UI after success
      setTouched(false);

      // Reset form after successful submit
      setForm({
        firstName: "",
        lastInitial: "",
        serviceType: "",
        city: "",
        serviceDate: "",
        rating: 0,
        reviewText: "",
      });

      if (typeof onSubmitted === "function") onSubmitted(data);
    } catch (err) {
      setServerError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      {submitted ? (
        <div
          style={{
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 14,
            padding: "14px 16px",
            background: "rgba(34, 197, 94, 0.08)",
            marginBottom: 14,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            Thanks for your review!
          </div>
          <div style={{ fontSize: 14, color: "#444" }}>
            Your review was submitted and is pending approval before it appears
            on the site.
          </div>
        </div>
      ) : null}

      <p style={{ fontSize: 16, marginTop: 8 }}>
        <strong>Your feedback helps local homeowners.</strong>
      </p>
      <p className="form-help" style={{ marginTop: 6 }}>
        We review submissions before publishing to keep reviews genuine and
        respectful.
      </p>

      {/* Optional global message: only show if user tried + there are real errors */}
      {touched && hasErrors ? (
        <div
          className="form-help"
          style={{ color: "var(--color-red)", marginTop: 10 }}
        >
          Please fill out the required fields.
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginTop: 14,
        }}
      >
        <div className="form-group">
          <label>
            First name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            placeholder="Grace"
            autoComplete="given-name"
          />
          {touched && errors.firstName ? (
            <div className="form-help" style={{ color: "var(--color-red)" }}>
              {errors.firstName}
            </div>
          ) : (
            <div className="form-help">
              We only display your first name and last initial.
            </div>
          )}
        </div>

        <div className="form-group">
          <label>
            Last initial <span className="required">*</span>
          </label>
          <input
            type="text"
            value={form.lastInitial}
            onChange={(e) => setField("lastInitial", e.target.value)}
            placeholder="E"
            maxLength={1}
            autoComplete="family-name"
          />
          {touched && errors.lastInitial ? (
            <div className="form-help" style={{ color: "var(--color-red)" }}>
              {errors.lastInitial}
            </div>
          ) : (
            <div className="form-help">One letter only.</div>
          )}
        </div>

        <div className="form-group">
          <label>
            Service type <span className="required">*</span>
          </label>
          <select
            value={form.serviceType}
            onChange={(e) => setField("serviceType", e.target.value)}
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {touched && errors.serviceType ? (
            <div className="form-help" style={{ color: "var(--color-red)" }}>
              {errors.serviceType}
            </div>
          ) : null}
        </div>

        <div className="form-group">
          <label>City (optional)</label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            placeholder="Evans"
            autoComplete="address-level2"
          />
        </div>

        <div className="form-group">
          <label>Date of service (optional)</label>
          <input
            type="month"
            value={form.serviceDate}
            onChange={(e) => setField("serviceDate", e.target.value)}
          />
          <div className="form-help">Month/year is fine.</div>
        </div>

        <div className="form-group">
          <label>
            Rating <span className="required">*</span>
          </label>
          <PaintbrushRating
            value={form.rating}
            onChange={(n) => setField("rating", n)}
          />

          {touched && errors.rating ? (
            <div
              className="form-help"
              style={{ color: "var(--color-red)", marginTop: 6 }}
            >
              {errors.rating}
            </div>
          ) : (
            <div className="form-help" style={{ marginTop: 6 }}>
              Click 1–5 paintbrushes.
            </div>
          )}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: 16 }}>
        <label>
          Your review <span className="required">*</span>
        </label>
        <textarea
          rows={5}
          value={form.reviewText}
          onChange={(e) => setField("reviewText", e.target.value)}
          placeholder="Tell us what stood out: communication, prep, cleanliness, timeliness, and final results."
        />
        {touched && errors.reviewText ? (
          <div className="form-help" style={{ color: "var(--color-red)" }}>
            {errors.reviewText}
          </div>
        ) : null}
      </div>

      {/* Only render serverError once */}
      {serverError ? (
        <div
          className="form-help"
          style={{ color: "var(--color-red)", marginTop: 10 }}
        >
          {serverError}
        </div>
      ) : null}

      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={submitted || submitting || (!canSubmit && touched)}
        >
          {submitting
            ? "Submitting..."
            : submitted
              ? "Submitted"
              : "Submit Review"}
        </button>
      </div>

      <p className="form-help" style={{ marginTop: 10 }}>
        Reviews are submitted for approval before appearing on the site.
      </p>
    </form>
  );
}
