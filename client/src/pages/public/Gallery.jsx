import gallery from "../../data/gallery";
import useSEO from "../../utils/useSEO";
import { useState } from "react";
import Lightbox from "../../components/common/Lightbox";

export default function Gallery() {
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" });
  useSEO({
    title: "Painting Project Gallery | Stymie’s Painting Solutions",
    description:
      "View recent interior, exterior, and cabinet painting projects from Stymie’s Painting Solutions in Richmond & Columbia County, GA.",
    canonicalPath: "/gallery",
  });

  return (
    <section className="section section--light">
      <div className="container">
        <h1>Recent Painting Projects in Richmond &amp; Columbia County, GA</h1>
        <p>Before-and-after work from recent projects.</p>
        <h2>Before &amp; After Gallery</h2>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div key={item.id} className="gallery-item card">
              <div className="gallery-item__header">
                <h3>{item.title}</h3>
              </div>

              <div className="gallery-item__images">
                <figure className="gallery-figure">
                  <img
                    src={item.before}
                    alt={`${item.title} - Before`}
                    onClick={() =>
                      setLightbox({
                        open: true,
                        src: item.before,
                        alt: `${item.title} - Before`,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />
                  <figcaption>Before</figcaption>
                </figure>

                <figure className="gallery-figure">
                  <img
                    src={item.after}
                    alt={`${item.title} - After`}
                    onClick={() =>
                      setLightbox({
                        open: true,
                        src: item.after,
                        alt: `${item.title} - After`,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  />
                  <figcaption>After</figcaption>
                </figure>
              </div>
            </div>
          ))}
        </div>
        <Lightbox
          isOpen={lightbox.open}
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox({ open: false, src: "", alt: "" })}
        />
      </div>
    </section>
  );
}
