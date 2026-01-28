import useSEO from "../../utils/useSEO";

export default function Staining() {
  useSEO({
    title: "Deck & Fence Staining | Richmond & Columbia County, GA",
    description:
      "Professional deck and fence staining in Richmond & Columbia County, GA. Protection, durability, and clean application for outdoor wood surfaces.",
    canonicalPath: "/staining",
  });

  return (
    <>
      <h1>Deck &amp; Fence Staining in Richmond &amp; Columbia County, GA</h1>

      <p>
        Protect and enhance outdoor wood surfaces with professional staining
        services. Stymie’s Painting Solutions offers deck and fence staining
        designed to extend the life of your wood while improving curb appeal.
      </p>

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
          </div>
        </div>
      </section>
    </>
  );
}
