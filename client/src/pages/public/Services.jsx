import useSEO from "../../utils/useSEO";

export default function Services() {
  useSEO({
    title: "Painting Services | Stymie’s Painting Solutions",
    description:
      "Professional painting services in Richmond & Columbia County, GA. Interior painting, exterior painting, cabinet painting, and detailed prep work. Free estimates available.",
    canonicalPath: "/services",
  });

  return (
    <>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>
            Interior, Exterior &amp; Cabinet Painting in Richmond &amp; Columbia
            County, GA
          </h1>

          <p>
            Stymie&apos;s Painting Solutions provides residential painting and
            surface preparation services for homeowners throughout Richmond and
            Columbia County, Georgia. With 10+ years of hands-on experience, we
            focus on clean prep, reliable scheduling, and finishes that hold up.
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

      <section className="section section--gray">
        <div className="container">
          <h2>Our Residential Painting Services</h2>
          <div className="cards-grid">
            {/* Interior */}
            <div className="card">
              <h3>Interior Painting</h3>
              <p>
                Interior house painting with clean edges, careful prep, and
                minimal disruption.
              </p>
              <ul className="bullets">
                <li>Floors and furniture protected</li>
                <li>Patching and sanding as needed</li>
                <li>Clean lines and even coverage</li>
              </ul>
              <a
                href="/interior-painting"
                className="button button-outline"
                style={{ marginTop: 12 }}
              >
                Learn More
              </a>
            </div>

            {/* Exterior */}
            <div className="card">
              <h3>Exterior Painting</h3>
              <p>
                Exterior house painting with durable finishes and prep built for
                local weather.
              </p>
              <ul className="bullets">
                <li>Scraping, sanding, and spot priming</li>
                <li>Caulking and surface preparation</li>
                <li>Consistent, long-lasting finish</li>
              </ul>
              <a
                href="/exterior-painting"
                className="button button-outline"
                style={{ marginTop: 12 }}
              >
                Learn More
              </a>
            </div>

            {/* Cabinets */}
            <div className="card">
              <h3>Cabinet Painting</h3>
              <p>
                Cabinet painting that updates kitchens and baths with a smooth,
                durable finish.
              </p>
              <ul className="bullets">
                <li>Degreasing and surface cleaning</li>
                <li>Sanding for proper adhesion</li>
                <li>Priming before finish coats</li>
              </ul>
              <a
                href="/cabinet-painting"
                className="button button-outline"
                style={{ marginTop: 12 }}
              >
                Learn More
              </a>
            </div>

            {/* Drywall */}
            <div className="card">
              <h3>Drywall Repair</h3>
              <p>
                Drywall patching and surface prep so your walls look smooth and
                paint-ready.
              </p>
              <ul className="bullets">
                <li>Minor drywall patching</li>
                <li>Hole filling and caulking</li>
                <li>Sanding and surface smoothing</li>
              </ul>
              <a
                href="/drywall-repair"
                className="button button-outline"
                style={{ marginTop: 12 }}
              >
                Learn More
              </a>
            </div>

            {/* Staining */}
            <div className="card">
              <h3>Deck &amp; Fence Staining</h3>
              <p>
                Outdoor wood staining to protect decks and fences while
                enhancing curb appeal.
              </p>
              <ul className="bullets">
                <li>Cleaning and prep for proper adhesion</li>
                <li>Even application for a consistent finish</li>
                <li>Protection from sun and moisture</li>
              </ul>
              <a
                href="/staining"
                className="button button-outline"
                style={{ marginTop: 12 }}
              >
                Learn More
              </a>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <a href="/quote" className="button button-primary">
              Get a Free Estimate
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
