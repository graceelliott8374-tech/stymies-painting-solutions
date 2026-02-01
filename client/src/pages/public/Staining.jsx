import useSEO from "../../utils/useSEO";
import { Link } from "react-router-dom";

export default function Staining() {
  useSEO({
    title: "Deck & Fence Staining | Richmond & Columbia County, GA",
    description:
      "Professional deck and fence staining in Richmond & Columbia County, GA. Protection, durability, and clean application for outdoor wood surfaces.",
    canonicalPath: "/staining",
  });

  return (
    <>
      {/* Intro */}
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>
            Deck &amp; Fence Staining in Richmond &amp; Columbia County, GA
          </h1>

          <p>
            Protect and enhance outdoor wood surfaces with professional staining
            services. Stymie’s Painting Solutions offers deck and fence staining
            designed to extend the life of your wood while improving curb
            appeal.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certification
            scheduled for February.
          </p>

          <Link to="/quote" className="button button-primary">
            Get a Free Estimate
          </Link>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <h2>Staining Services</h2>

          <div className="cards-grid">
            <div className="card">
              <h3>Deck Staining</h3>
              <p>
                Proper cleaning, preparation, and staining to protect decks from
                sun, moisture, and wear.
              </p>
            </div>

            <div className="card">
              <h3>Fence Staining</h3>
              <p>
                Even application and long-lasting finishes to preserve wood
                fences and maintain a clean appearance.
              </p>
            </div>

            <div className="card">
              <h3>Surface Prep</h3>
              <p>
                Power washing, sanding, and repairs as needed to ensure stain
                adhesion and durability.
              </p>
            </div>

            <div className="card">
              <h3>What to Expect</h3>
              <p>
                Clear communication, realistic timelines, and professional
                results focused on longevity.
              </p>
            </div>
            <div className="card">
              <h3>What We Stain</h3>
              <ul className="bullets">
                <li>Deck boards, railings, and stairs</li>
                <li>Fences (new or weathered wood)</li>
                <li>Posts, gates, and trim details</li>
                <li>
                  Solid stains and semi-transparent stains (as appropriate)
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Prep That Makes It Last</h3>
              <p>
                Outdoor staining fails early when prep is rushed. We clean, dry,
                and prep the surface so the stain penetrates evenly and holds up
                longer.
              </p>
              <ul className="bullets">
                <li>Proper cleaning and drying time</li>
                <li>Spot sanding and surface smoothing as needed</li>
                <li>Repairs or replacement recommendations before staining</li>
              </ul>
            </div>
            <div className="card">
              <h3>Related Services</h3>
              <p>
                Many exterior projects go together. You may also be interested
                in:
              </p>
              <ul className="bullets">
                <li>
                  <Link to="/exterior-painting">Exterior Painting</Link>
                </li>

                <li>
                  <Link to="/drywall-repair">Drywall Repair</Link>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Ready to Protect Your Outdoor Wood?</h3>
              <p>
                Tell us what you’re staining and where you’re located. We’ll
                provide a clear estimate and a realistic timeline.
              </p>
              <Link to="/quote" className="button button-primary">
                Get a Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
