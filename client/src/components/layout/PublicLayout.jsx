import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import HeroBanner from "./HeroBanner";

export default function PublicLayout() {
  return (
    <>
      <HeroBanner />
      <Header />

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-brand">Stymie’s Painting Solutions</div>
          <div className="footer-trust">
            Serving Richmond & Columbia County, GA · Fully Insured
          </div>

          <div className="footer-links">
            <Link to="/services">Services</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/quote">Get a Quote</Link>
          </div>

          <div className="footer-copy">
            © {new Date().getFullYear()} Stymie’s Painting Solutions. All rights
            reserved.
          </div>
          <p className="footer-disclaimer">
            Project timelines and pricing are based on initial assessments and
            may vary due to surface conditions, material availability, weather,
            or scope changes. All work is scheduled by appointment.
          </p>
        </div>
      </footer>
    </>
  );
}
