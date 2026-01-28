import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const loc = useLocation();
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (!mounted) return;

        if (!res.ok) return setState({ loading: false, ok: false });

        const data = await res.json().catch(() => ({}));
        const role = data?.user?.role;
        setState({ loading: false, ok: role === "admin" });
      } catch {
        if (mounted) setState({ loading: false, ok: false });
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, []);

  if (state.loading) return <div style={{ padding: 24 }}>Checking access…</div>;

  if (!state.ok) {
    return (
      <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />
    );
  }

  return children;
}
