import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.svg";

export default function Header() {
    return (
        <header className="site-header">
            <div
                className="container"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 12,
                    paddingBottom: 12,
                }}
            >
                <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img
                        src={logo}
                        alt="Stymie's Painting Solutions"
                        style={{ height: 48 }}
                    />
                </Link>

                <nav style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Link to="/services">Services</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>

                    <Link to="/quote" className="button button-primary">
                        Get a Quote
                    </Link>
                </nav>
            </div>
        </header>
    );
}
