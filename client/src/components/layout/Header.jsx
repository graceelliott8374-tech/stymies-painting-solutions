import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo/logo.svg";

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logo}
            alt="Stymie's Painting Solutions"
            style={{ height: 48 }}
          />
        </Link>

        <nav>
          {/* Services Dropdown */}
          <div
            className="nav-item"
            ref={menuRef}
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover)").matches) setOpen(true);
            }}
            onMouseLeave={() => {
              if (window.matchMedia("(hover: hover)").matches) setOpen(false);
            }}
          >
            <button
              type="button"
              className="nav-trigger"
              onClick={() => setOpen((v) => !v)}
              onFocus={() => setOpen(true)}
              aria-haspopup="menu"
              aria-expanded={open}
            >
              Services{" "}
              <span className="nav-caret" aria-hidden="true">
                ▾
              </span>
            </button>

            {open && (
              <div className="nav-menu" role="menu">
                <Link
                  to="/services"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  All Services
                </Link>

                <Link
                  to="/interior-painting"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Interior Painting
                </Link>

                <Link
                  to="/exterior-painting"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Exterior Painting
                </Link>

                <Link
                  to="/cabinet-painting"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Cabinet Painting
                </Link>

                <Link
                  to="/drywall-repair"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Drywall Repair
                </Link>

                <Link
                  to="/staining"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  Deck &amp; Fence Staining
                </Link>
              </div>
            )}
          </div>

          <Link to="/gallery">Gallery</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>

          <Link to="/quote" className="button button-primary">
            Get an Estimate
          </Link>
        </nav>
      </div>
    </header>
  );
}
