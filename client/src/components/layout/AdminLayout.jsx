import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
    return (
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", minHeight: "100vh" }}>
            <aside style={{ padding: 16, borderRight: "1px solid #ddd" }}>
                <div style={{ fontWeight: 800, marginBottom: 16 }}>Admin</div>
                <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/leads">Leads</Link>
                </nav>
            </aside>

            <main style={{ padding: 24 }}>
                <Outlet />
            </main>
        </div>
    );
}
