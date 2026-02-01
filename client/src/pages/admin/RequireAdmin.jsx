import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const loc = useLocation();
  const [state, setState] = useState({ loading: true, ok: false });

 useEffect(() => {
   let mounted = true;

   async function check() {
     try {
       // 1) Try /me first (fast path)
       let res = await fetch("http://localhost:5000/api/auth/me", {
         credentials: "include",
       });
       if (!mounted) return;

       if (res.ok) {
         const data = await res.json().catch(() => ({}));
         const role = data?.user?.role;
         return setState({ loading: false, ok: role === "admin" });
       }

       // 2) If unauthorized, try refresh
       if (res.status === 401) {
         const r = await fetch("http://localhost:5000/api/auth/refresh", {
           method: "POST",
           credentials: "include",
         });
         if (!mounted) return;

         if (!r.ok) return setState({ loading: false, ok: false });

         // 3) Retry /me after refresh
         res = await fetch("http://localhost:5000/api/auth/me", {
           credentials: "include",
         });
         if (!mounted) return;

         if (!res.ok) return setState({ loading: false, ok: false });

         const data2 = await res.json().catch(() => ({}));
         const role2 = data2?.user?.role;
         return setState({ loading: false, ok: role2 === "admin" });
       }

       return setState({ loading: false, ok: false });
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
