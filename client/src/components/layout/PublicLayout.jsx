import { Outlet } from "react-router-dom";
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
                    <div style={{ fontWeight: 800 }}>Stymie’s Painting Solutions</div>

                    <div className="footer-links">
                        <a href="/services">Services</a>
                        <a href="/gallery">Gallery</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/quote">Get a Quote</a>
                    </div>

                    <div style={{ opacity: 0.85 }}>
                        © {new Date().getFullYear()} Stymie’s Painting Solutions. All rights reserved.
                    </div>
                </div>
            </footer>

        </>
    );
}

