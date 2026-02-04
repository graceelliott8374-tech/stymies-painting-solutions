import { useState } from "react";
import useSEO from "../../utils/useSEO";
import { Link } from "react-router-dom";

export default function Quote() {
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: "Free Painting Estimate | Stymie’s Painting Solutions",
    description:
      "Request a free painting estimate from Stymie’s Painting Solutions in Richmond & Columbia County, GA. Fast responses and professional service.",
    canonicalPath: "/quote",
  });

  if (submitted) {
    return (
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="card">
            <h1>Request received</h1>
            <p>
              Thanks! We’ve got your info and will reach out as soon as
              possible.
            </p>

            <Link to="/" className="button button-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section section--light">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>Request a Free Quote</h1>
        <p>
          Tell us a little about your project and we’ll get back to you with a
          quote.
        </p>
        <p className="availability-note">
          <strong>Note:</strong> At this time, project scheduling is available
          after 4:00 PM on weekdays and on weekends.
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <form
            className="quote-form"
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.target);

              const payload = {
                name: formData.get("name"),
                email: formData.get("email"),
                phone: formData.get("phone"),
                serviceType: formData.get("serviceType"),
                message: formData.get("message"),
              };

              try {
                const res = await fetch(
                  "https://stynies-painting-solutions.onrender.com/api/leads",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  },
                );

                if (!res.ok) {
                  const err = await res.json();
                  alert(err.error || "Something went wrong.");
                  return;
                }

                setSubmitted(true);
              } catch (err) {
                alert("Unable to submit request. Please try again later.");
              }
            }}
          >
            <div className="form-group">
              <label>
                Name <span className="required">*</span>
              </label>
              <input name="name" type="text" placeholder="Your name" />
            </div>

            <div className="form-group">
              <label>
                Email <span className="required">*</span>
              </label>
              <input name="email" type="email" placeholder="you@email.com" />
              <small className="form-help">
                We’ll only use your email to contact you about your quote.
              </small>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" type="tel" placeholder="Optional" />
            </div>

            <div className="form-group">
              <label>
                Type of Service <span className="required">*</span>
              </label>
              <select name="serviceType">
                <option>Interior Painting</option>
                <option>Exterior Painting</option>
                <option>Prep & Repairs</option>
                <option>Staining</option>
              </select>
            </div>

            <input
              type="text"
              name="website"
              autoComplete="off"
              tabIndex={-1}
              style={{ position: "absolute", left: "-10000px" }}
            />

            <div className="form-group">
              <label>Project Details</label>
              <textarea
                name="message"
                rows="4"
                placeholder="Tell us about the project"
              />
              <small className="form-help">
                Include room sizes, surfaces, or anything you think is
                important.
              </small>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
