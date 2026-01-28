import useSEO from "../../utils/useSEO";

export default function About() {
  useSEO({
    title: "About | Stymie’s Painting Solutions",
    description:
      "Meet Stymie’s Painting Solutions: a local, detail-focused painting company serving Richmond & Columbia County, GA. Quality prep, clean finishes, and dependable scheduling.",
    canonicalPath: "/about",
  });

  return (
    <>
      <section className="section section--light">
        <div className="container" style={{ maxWidth: 720 }}>
          <h1>About Stymie’s Painting Solutions</h1>
          <p>
            Stymie’s Painting Solutions provides professional interior and
            exterior painting with a focus on prep, clean work, and results that
            last.
          </p>
          <p style={{ marginTop: 8, fontWeight: 600 }}>
            Fully insured with General Liability coverage. OSHA 10 certification
            scheduled for February.
          </p>
          <p>
            Every job is approached with the same standards: protect the space,
            communicate clearly, and deliver a finish you can be proud of.
          </p>
        </div>
      </section>

      <section className="section section--gray">
        <div className="container">
          <h2>What Sets Us Apart</h2>
          <div className="cards-grid">
            <div className="card">
              <h3>Quality First</h3>
              <p>
                Prep work and attention to detail are never skipped. The finish
                matters because the foundation matters.
              </p>
            </div>

            <div className="card">
              <h3>Clear Communication</h3>
              <p>
                Scheduling, expectations, and progress are communicated clearly
                so there are no surprises.
              </p>
            </div>

            <div className="card">
              <h3>Respect for Your Space</h3>
              <p>
                Floors, furniture, and surrounding areas are protected, and
                clean-up is part of the job.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
