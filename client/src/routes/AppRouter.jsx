import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import Gallery from "../pages/public/Gallery";
import About from "../pages/public/About";
import Quote from "../pages/public/Quote";
import Contact from "../pages/public/Contact";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import Leads from "../pages/admin/Leads";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/quote" element={<Quote />} />
                    <Route path="/contact" element={<Contact />} />
                </Route>

                {/* Admin */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="leads" element={<Leads />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
