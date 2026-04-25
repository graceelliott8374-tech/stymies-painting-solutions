import useSEO from "../../utils/useSEO";
import { Link } from "react-router-dom";

export default function InteriorPainting() {
  useSEO({
    title: "Interior Painting | Richmond & Columbia County, GA",
    description:
      "Interior painting services in Richmond & Columbia County, GA. Walls, ceilings, trim, doors, and detailed prep for clean, long-lasting results.",
    canonicalPath: "/interior-painting",
  });

  return (
    <>
      {/* Intro */}
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>
            Interior House Painting for Richmond &amp; Columbia County
            Homeowners
          </h1>

          <p>
            A clean interior paint job can completely change how your home
            feels, but the results depend on preparation and detail work.
            Stymie’s Painting Solutions provides interior house painting for
            homeowners across Richmond and Columbia County, with careful prep,
            clean edges, and a smooth finish that holds up over time.
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
          <h2>Interior Painting Services</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>What We Paint</h3>
              <ul className="bullets">
                <li>Walls and ceilings</li>
                <li>Trim, baseboards, and doors</li>
                <li>Bedrooms, living rooms, kitchens, and bathrooms</li>
                <li>Whole-home repaints and refreshes</li>
              </ul>
            </div>

            <div className="card">
              <h3>Prep That Makes the Difference</h3>
              <p>
                Most paint problems start before the first coat. We take the
                time to patch, sand, caulk, and protect surrounding surfaces so
                the finished work looks clean and lasts longer.
              </p>
              <ul className="bullets">
                <li>Surface patching and repairs as needed</li>
                <li>Sanding and smoothing for a uniform finish</li>
                <li>Protection for floors, furniture, and fixtures</li>
              </ul>
            </div>

            <div className="card">
              <h3>What You Can Expect</h3>
              <ul className="bullets">
                <li>Clear scope and a straightforward estimate</li>
                <li>Neat work habits and daily cleanup</li>
                <li>Crisp lines, even coverage, and detailed finishing</li>
                <li>Respect for your home and your schedule</li>
              </ul>
            </div>

            <div className="card">
              <h3>Related Services</h3>
              <p>
                Many interior projects include additional prep or updates. You
                may also be interested in:
              </p>
              <ul className="bullets">
                <li>
                  <Link to="/exterior-painting">Exterior Painting</Link>
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
              <h3>Ready to Refresh Your Interior?</h3>
              <p>
                Tell us what you’re painting and where you’re located. We’ll
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
