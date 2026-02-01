import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    async function handleLogout() {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // IMPORTANT: send cookie so server can clear it
      });

      // Hard redirect to ensure React state + guard re-evaluates cleanly
      window.location.href = "/admin/login";
    }

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          minHeight: "100vh",
        }}
      >
        <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
          <div style={{ fontWeight: 800, marginBottom: 16 }}>Admin</div>
          <button onClick={handleLogout} style={{ marginTop: 16 }}>
            Log out
          </button>

          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/leads">Leads</Link>
            <Link to="/admin/reviews">Reviews</Link>
          </nav>
        </aside>

        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    );
}
