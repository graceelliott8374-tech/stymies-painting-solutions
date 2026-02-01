import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import Gallery from "../pages/public/Gallery";
import About from "../pages/public/About";
import Quote from "../pages/public/Quote";
import Contact from "../pages/public/Contact";
import InteriorPainting from "../pages/public/InteriorPainting";
import ExteriorPainting from "../pages/public/ExteriorPainting";
import CabinetPainting from "../pages/public/CabinetPainting";
import DrywallRepair from "../pages/public/DrywallRepair";
import Staining from "../pages/public/Staining";
import Reviews from "../pages/public/Reviews";

// Admin pages
import Dashboard from "../pages/admin/Dashboard";
import Leads from "../pages/admin/Leads";
import LeadDetails from "../pages/admin/LeadDetails";
import AdminLogin from "../pages/admin/AdminLogin";
import RequireAdmin from "../pages/admin/RequireAdmin";
import ReviewsAdmin from "../pages/admin/ReviewsAdmin";


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
          <Route path="/interior-painting" element={<InteriorPainting />} />
          <Route path="/exterior-painting" element={<ExteriorPainting />} />
          <Route path="/cabinet-painting" element={<CabinetPainting />} />
          <Route path="/staining" element={<Staining />} />
          <Route path="/drywall-repair" element={<DrywallRepair />} />

          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<div style={{ padding: 24 }}>Not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
