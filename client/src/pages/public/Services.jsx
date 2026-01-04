export default function Services() {
  return (
    <>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>Services</h1>
          <p>
            Interior and exterior painting, prep work, and staining. Clean work,
            reliable scheduling, and a finish that lasts.
          </p>

          <a href="/quote" className="button button-primary">
            Get a Free Quote
          </a>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <div className="cards-grid">
            <div className="card">
              <h3>Interior Painting</h3>
              <p>Walls, ceilings, trim, doors, and detailed finish work.</p>
              <ul className="bullets">
                <li>Protect floors and furniture</li>
                <li>Patch and sand as needed</li>
                <li>Clean lines and even coverage</li>
              </ul>
            </div>

            <div className="card">
              <h3>Exterior Painting</h3>
              <p>Durable finishes with prep that holds up to weather.</p>
              <ul className="bullets">
                <li>Scrape, sand, and spot-prime</li>
                <li>Caulking and surface prep</li>
                <li>Clean, consistent finish</li>
              </ul>
            </div>

            <div className="card">
              <h3>Prep & Repairs</h3>
              <p>Prep is where the quality comes from. We don’t skip it.</p>
              <ul className="bullets">
                <li>Minor drywall patching</li>
                <li>Hole filling and caulking</li>
                <li>Sanding and smoothing</li>
              </ul>
            </div>

            <div className="card">
              <h3>Staining</h3>
              <p>Decks, fences, and wood features with proper protection.</p>
              <ul className="bullets">
                <li>Even application and coverage</li>
                <li>Weather-resistant finishes</li>
                <li>Cleanup and touch-ups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
