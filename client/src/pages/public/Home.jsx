import useSEO from "../../utils/useSEO";

export default function Home() {
  useSEO({
    title: "Stymie’s Painting Solutions | Richmond & Columbia County, GA",
    description:
      "Professional interior and exterior painting in Richmond & Columbia County, GA. Clean prep, crisp lines, and reliable scheduling. Free estimates.",
    canonicalPath: "/",
  });
  return (
    <>
      {/* Hero intro text under the banner/nav */}
      <section className="section section--light section--home-hero">
        <div className="container home-hero">
          <h1>
            Interior &amp; Exterior Painting in Richmond &amp; Columbia County,
            GA
          </h1>

          <p style={{ fontSize: 18, marginTop: 10 }}>
            Serving the CSRA with dependable, high-quality interior and exterior
            painting. With{" "}
            <strong> over 10 years of hands-on experience</strong>, Stymie’s
            Painting Solutions delivers clean lines, solid prep, and a finish
            that holds up over time.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certification
            scheduled for February.
          </p>

          <ul className="home-bullets">
            <li>
              Currently serving homeowners in{" "}
              <strong>Richmond & Columbia County</strong>
            </li>
            <li>
              Planning to expand into <strong>North Augusta</strong> and{" "}
              <strong>Grovetown</strong>
            </li>
            <li>
              Clear estimates, honest timelines, and reliable communication
            </li>
            <li>Careful prep, clean work areas, and professional results</li>
          </ul>

          <div className="home-actions">
            <a href="/quote" className="button button-primary">
              Get Your Free Estimate
            </a>
            <a
              href="/services"
              className="button button-outline"
              style={{ marginLeft: 12 }}
            >
              View Services
            </a>
          </div>
        </div>
      </section>

      {/* About (quick trust builder) */}
      <section className="section section--gray">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 style={{ marginBottom: 10 }}>
            Quality Work Without the Runaround
          </h2>
          <p style={{ fontSize: 16 }}>
            A long-lasting paint job starts long before the first coat goes on.
            We focus on prep, patching, sanding, caulking, and surface
            correction so the finished work looks clean and stays that way.
            Whether it’s a single room or a full property refresh, you’ll get
            professional workmanship from a local painting contractor and a
            respectful, organized job site.
          </p>

          <div style={{ marginTop: 16 }}>
            <a href="/gallery" className="button button-outline">
              See Before & Afters
            </a>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section section--light">
        <div className="container">
          <h2>Residential Painting & Prep Services</h2>

          <div className="cards-grid">
            <div className="card">
              <h3>Interior Painting</h3>
              <p>
                Walls, ceilings, trim, doors, and detailed interior house
                painting with clean edges and minimal disruption.
              </p>
            </div>

            <div className="card">
              <h3>Exterior Painting</h3>
              <p>
                Durable finishes, proper prep, and weather-ready results built
                for local conditions.
              </p>
            </div>

            <div className="card">
              <h3>Prep & Drywall Repairs</h3>
              <p>
                Patching, sanding, caulking, and surface prep that makes the
                paint look better and last longer.
              </p>
            </div>

            <div className="card">
              <h3>Staining</h3>
              <p>
                Decks, fences, and wood features with even coverage and
                protection.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <a href="/quote" className="button button-primary">
              Request a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section section--gray">
        <div className="container">
          <h2>Why Homeowners Choose Stymie’s Painting Solutions</h2>

          <div className="cards-grid">
            <div className="card">
              <h3>Clean Prep</h3>
              <p>
                Proper prep makes the finish look better and last longer. No
                shortcuts.
              </p>
            </div>

            <div className="card">
              <h3>On-Time & Reliable</h3>
              <p>
                Clear scheduling and communication so you know what’s happening
                and when.
              </p>
            </div>

            <div className="card">
              <h3>Quality Finish</h3>
              <p>
                Sharp lines, smooth coverage, and detail work that looks
                professional.
              </p>
            </div>

            <div className="card">
              <h3>Respect Your Home</h3>
              <p>
                We protect floors and furniture, clean up daily, and leave the
                space better than we found it.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <a href="/quote" className="button button-primary">
              Get a Free Quote
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
