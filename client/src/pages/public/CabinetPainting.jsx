import useSEO from "../../utils/useSEO";
import { Link } from "react-router-dom";

export default function CabinetPainting() {
  useSEO({
    title: "Cabinet Painting | Richmond & Columbia County, GA",
    description:
      "Cabinet painting and refinishing in Richmond & Columbia County, GA. Kitchen and bathroom cabinets with smooth finishes and professional prep.",
    canonicalPath: "/cabinet-painting",
  });

  return (
    <>
      {/* Intro */}
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>
            Cabinet Painting for Richmond &amp; Columbia County Kitchens &amp;
            Baths
          </h1>

          <p>
            Cabinet painting is a cost-effective way to update your kitchen or
            bathroom without the expense of a full remodel. Stymie’s Painting
            Solutions provides professional cabinet painting for homeowners
            across Richmond and Columbia County, with careful prep and durable
            finishes designed to hold up to daily use.
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

      {/* Content */}
      <section className="section section--gray">
        <div className="container">
          <h2>Cabinet Painting Services</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>What We Paint</h3>
              <ul className="bullets">
                <li>Kitchen cabinets</li>
                <li>Bathroom cabinets and vanities</li>
                <li>Built-ins and storage cabinets</li>
                <li>Cabinet doors, drawers, and frames</li>
              </ul>
            </div>

            <div className="card">
              <h3>Prep That Makes the Finish Last</h3>
              <p>
                Cabinets take more wear than most painted surfaces. Proper
                cleaning, sanding, and priming are essential for a smooth,
                long-lasting finish.
              </p>
              <ul className="bullets">
                <li>Degreasing and surface cleaning</li>
                <li>Sanding for proper adhesion</li>
                <li>Priming before finish coats</li>
              </ul>
            </div>

            <div className="card">
              <h3>What You Can Expect</h3>
              <ul className="bullets">
                <li>Clear scope and straightforward estimate</li>
                <li>Organized workflow and careful handling</li>
                <li>Smooth, even finish with professional detail work</li>
                <li>Respect for your home and daily cleanup</li>
              </ul>
            </div>

            <div className="card">
              <h3>Related Services</h3>
              <p>
                Cabinet projects are often part of larger updates. You may also
                be interested in:
              </p>
              <ul className="bullets">
                <li>
                  <Link to="/interior-painting">Interior Painting</Link>
                </li>
                <li>
                  <Link to="/drywall-repair">Drywall Repair</Link>
                </li>
                <li>
                  <Link to="/exterior-painting">Exterior Painting</Link>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Ready to Update Your Cabinets?</h3>
              <p>
                Tell us what you’d like painted and where you’re located. We’ll
                provide a clear estimate and realistic timeline.
              </p>

              <Link to="/quote" className="button button-primary">
                Request a Free Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
