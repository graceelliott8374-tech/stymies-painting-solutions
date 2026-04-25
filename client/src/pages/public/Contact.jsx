import { useState } from "react";
import useSEO from "../../utils/useSEO";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState("");
  useSEO({
    title: "Contact | Stymie’s Painting Solutions",
    description:
      "Contact Stymie’s Painting Solutions for professional painting services in Richmond & Columbia County, GA. Request a free estimate or ask a question today.",
    canonicalPath: "/contact",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(e.target);

    const payload = {
      name: formData.get("name") || "",
      email: formData.get("email") || "",
      phone: formData.get("phone") || "",
      city: formData.get("city") || "",
      message: formData.get("message") || "",
      website: formData.get("website") || "", // honeypot
    };

    try {
      const res = await fetch(
        "https://stynies-painting-solutions.onrender.com/api/leads/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      // Safe parsing: avoids "Unexpected end of JSON input"
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          (data && data.error) || text || "Something went wrong.",
        );
      }

      setStatus("success");
      e.target.reset();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>Contact Stymie’s Painting Solutions</h1>

          <p>
            Have a painting project coming up? Reach out and tell us what you
            need. We serve homeowners throughout Richmond &amp; Columbia County,
            GA and provide clear estimates, honest timelines, and professional
            results.
          </p>
          <p className="availability-note">
            <strong>Current availability:</strong> Evening and weekend
            appointments only. Stymie’s Painting Solutions is currently
            scheduling projects after 4:00 PM on weekdays and on weekends while
            transitioning from full-time employment.
          </p>

          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certified.
          </p>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <h2>Contact & Estimates</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>Get in Touch</h3>
              <p>
                Have a quick question or prefer to reach out directly? You can
                contact us using the details below, or submit the form and we’ll
                follow up.
              </p>

              <ul className="bullets">
                <li>
                  Phone: <a href="tel:7068338553">706-833-8553</a>
                </li>
                <li>
                  Email:{" "}
                  <a href="mailto:stymiespaintingsolutions@gmail.com">
                    stymiespaintingsolutions@gmail.com
                  </a>
                </li>
                <li>Service area: Richmond &amp; Columbia County, GA</li>
                <li>Response time: typically within 1 business day</li>
              </ul>
            </div>

            <div className="card">
              <h3>Request a Free Estimate</h3>
              <p>
                Share a few details about your project and we’ll follow up with
                next steps.
              </p>

              <form className="quote-form" onSubmit={handleSubmit}>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                  style={{ display: "none" }}
                />

                <div className="form-group">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="XXX-XXX-XXXX"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City / Area</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Augusta, Evans, Martinez, etc."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    How can we help? <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    placeholder="Briefly describe your project or question"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                </div>

                {status === "success" && (
                  <p style={{ color: "green", marginTop: 12 }}>
                    Thanks! We’ve received your message and will be in touch
                    shortly.
                  </p>
                )}

                {status === "error" && (
                  <p style={{ color: "red", marginTop: 12 }}>{error}</p>
                )}

                <p style={{ fontSize: "0.9rem", color: "#666", marginTop: 12 }}>
                  We don’t share your information. This form is only used to
                  respond to your request.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
