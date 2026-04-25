import useSEO from "../../utils/useSEO";
import { Link } from "react-router-dom";

export default function ExteriorPainting() {
  useSEO({
    title: "Exterior Painting | Richmond & Columbia County, GA",
    description:
      "Exterior painting in Richmond & Columbia County, GA. Siding, trim, doors, and shutters with thorough prep, durable finishes, and clean job sites.",
    canonicalPath: "/exterior-painting",
  });

  return (
    <>
      {/* Intro */}
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>
            Exterior House Painting for Richmond &amp; Columbia County Homes
          </h1>

          <p>
            A quality exterior paint job protects your home and improves curb
            appeal, but it only lasts when the prep work is done right. Stymie’s
            Painting Solutions provides exterior house painting for homeowners
            across Richmond and Columbia County, with careful surface
            preparation and durable finishes built for local conditions.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certified.
          </p>

          <Link to="/quote" className="button button-primary">
            Get a Free Estimate
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="section section--gray">
        <div className="container">
          <h2>Exterior Painting Services</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>What We Paint</h3>
              <ul className="bullets">
                <li>Siding and exterior walls</li>
                <li>Trim, fascia, soffits, and doors</li>
                <li>Porches, railings, columns, and shutters</li>
                <li>Garages and exterior accents</li>
              </ul>
            </div>

            <div className="card">
              <h3>Prep That Makes It Last</h3>
              <p>
                Exterior paint fails fast when surfaces aren’t cleaned,
                repaired, and properly primed. We focus on the details that help
                the finish bond and hold up over time.
              </p>
              <ul className="bullets">
                <li>Scraping and sanding where needed</li>
                <li>Spot priming and surface correction</li>
                <li>Caulking gaps and sealing problem areas</li>
              </ul>
            </div>

            <div className="card">
              <h3>What You Can Expect</h3>
              <ul className="bullets">
                <li>Clear scope and a straightforward estimate</li>
                <li>Reliable scheduling and communication</li>
                <li>
                  Clean lines, even coverage, and professional detail work
                </li>
                <li>Respect for your property and daily cleanup</li>
              </ul>
            </div>

            <div className="card">
              <h3>Related Services</h3>
              <p>
                Many exterior projects include repairs, prep, or interior
                updates. You may also be interested in:
              </p>
              <ul className="bullets">
                <li>
                  <Link to="/interior-painting">Interior Painting</Link>
                </li>
                <li>
                  <Link to="/cabinet-painting">Cabinet Painting</Link>
                </li>
                <li>
                  <Link to="/drywall-repair">Drywall Repair</Link>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Ready to Improve Curb Appeal?</h3>
              <p>
                Tell us what you want painted and where you’re located. We’ll
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
