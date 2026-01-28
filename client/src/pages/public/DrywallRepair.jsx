export default function DrywallRepair() {
  return (
    <>
      {/* Intro */}
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>Drywall Repair in Richmond &amp; Columbia County, GA</h1>

          <p>
            Drywall damage can make even a fresh paint job look unfinished.
            Stymie’s Painting Solutions provides drywall repair for homeowners
            across Richmond and Columbia County, fixing holes, cracks, and
            surface issues so your walls look smooth and paint-ready.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certification
            scheduled for February.
          </p>

          <a href="/quote" className="button button-primary">
            Get a Free Estimate
          </a>
        </div>
      </section>

      {/* Content */}
      <section className="section section--gray">
        <div className="container">
          <div className="cards-grid">
            <div className="card">
              <h2>Common Repairs We Handle</h2>
              <ul className="bullets">
                <li>Holes from anchors, doors, or accidents</li>
                <li>Cracks, chips, and dents</li>
                <li>Nail pops and minor seam issues</li>
                <li>Small patches and surface smoothing</li>
              </ul>
            </div>

            <div className="card">
              <h2>Repair + Prep for a Smooth Finish</h2>
              <p>
                A proper repair is more than filling a hole. We patch, tape when
                needed, sand smooth, and blend the surface so the repair
                disappears under paint.
              </p>
              <ul className="bullets">
                <li>Patching and filling</li>
                <li>Sanding and feathering edges</li>
                <li>Spot priming before painting</li>
              </ul>
            </div>

            <div className="card">
              <h2>When to Bundle With Painting</h2>
              <p>
                Drywall repairs are often part of interior painting projects. If
                you’re repainting a room, we can handle patching and prep at the
                same time so everything looks finished.
              </p>
              <ul className="bullets">
                <li>Repairs before full room repaints</li>
                <li>Surface prep for smooth walls</li>
                <li>Clean transitions and consistent texture</li>
              </ul>
            </div>

            <div className="card">
              <h2>Related Services</h2>
              <p>
                Drywall repairs are often part of painting and renovation
                projects. You may also be interested in:
              </p>
              <ul className="bullets">
                <li>
                  <a href="/interior-painting">Interior Painting</a>
                </li>
                <li>
                  <a href="/exterior-painting">Exterior Painting</a>
                </li>
                <li>
                  <a href="/cabinet-painting">Cabinet Painting</a>
                </li>
              </ul>
            </div>

            <div className="card">
              <h2>Need Drywall Repaired?</h2>
              <p>
                Tell us what’s damaged and where you’re located. We’ll provide a
                clear estimate and a realistic timeline.
              </p>

              <a href="/quote" className="button button-primary">
                Request a Free Estimate
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
