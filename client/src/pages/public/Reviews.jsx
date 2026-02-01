import { useEffect, useState } from "react";

import useSEO from "../../utils/useSEO";
import ReviewForm from "../../components/reviews/ReviewForm";
import PaintbrushRating from "../../components/reviews/PaintbrushRating";
import { reviewsSeed } from "../../data/reviewsSeed";
import { apiFetch } from "../../utils/apiFetch";

export default function Reviews() {
  useSEO({
    title: "Reviews | Stymie’s Painting Solutions",
    description:
      "Read verified customer reviews for Stymie’s Painting Solutions in Richmond & Columbia County, GA. Leave a review to help local homeowners.",
    canonicalPath: "/reviews",
  });

  // Placeholder “approved” reviews for the frontend build.
  // Later this becomes fetched from your API and filtered by approved:true.
  const approvedReviews = reviewsSeed;
  const sortedReviews = [...approvedReviews].sort((a, b) =>
    String(b.date || "").localeCompare(String(a.date || "")),
  );

  return (
    <>
      {/* Intro */}
      <section className="section section--light section--home-hero">
        <div className="container" style={{ maxWidth: 900 }}>
          <h1>Customer Reviews</h1>

          <p style={{ fontSize: 16, marginTop: 10 }}>
            Real feedback from homeowners in Richmond &amp; Columbia County.
            Reviews shown here are <strong>approved before publishing</strong>{" "}
            to keep things genuine and respectful.
          </p>

          <div className="home-actions" style={{ marginTop: 16 }}>
            <a href="#leave-review" className="button button-primary">
              Leave a Review
            </a>
            <a href="/quote" className="button button-outline">
              Request a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Reviews list */}
      <section className="section section--gray">
        <div className="container">
          <h2 style={{ marginBottom: 10 }}>Approved Reviews</h2>
          <p style={{ fontSize: 16 }}>
            We display your <strong>first name</strong> and{" "}
            <strong>last initial</strong>.
          </p>

          <div className="cards-grid" style={{ marginTop: 18 }}>
            {sortedReviews.map((r) => (
              <div className="card" key={r.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>{r.name}</div>
                  <PaintbrushRating value={r.rating} />
                </div>

                <div style={{ marginTop: 6, fontSize: 14, color: "#666" }}>
                  {r.service}
                  {r.city ? ` • ${r.city}` : ""}
                  {r.date ? (
                    <div style={{ marginTop: 6, fontSize: 13, color: "#777" }}>
                      Service date: {r.date}
                    </div>
                  ) : null}
                </div>

                <p style={{ marginTop: 10 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a Review form (frontend-only for now) */}
      <section className="section section--light" id="leave-review">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2>Leave a Review</h2>

          <div
            style={{
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 14,
              padding: "14px 16px",
              background: "rgba(0,0,0,0.02)",
              marginTop: 12,
            }}
          >
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              Quick note before you submit
            </div>
            <div style={{ fontSize: 14, color: "#444" }}>
              We review submissions before publishing. Your name is shown as
              first name and last initial only.
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
