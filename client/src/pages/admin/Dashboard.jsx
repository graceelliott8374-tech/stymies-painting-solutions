import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, avg: 0 });
  const [approvedReviewCount, setApprovedReviewCount] = useState(0);
  const [pendingReviewCount, setPendingReviewCount] = useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        // Load both in parallel
        const [leadsRes, approvedRes] = await Promise.all([
          apiFetch("/api/leads"),
          apiFetch("/api/reviews"),
        ]);

        if (!leadsRes.ok)
          throw new Error(`Leads fetch failed (${leadsRes.status})`);
        if (!approvedRes.ok)
          throw new Error(`Reviews fetch failed (${approvedRes.status})`);

        const leads = await leadsRes.json();
        const approvedReviews = await approvedRes.json();
        const pendingRes = await apiFetch("/api/reviews/admin?status=pending");
        if (!pendingRes.ok)
          throw new Error(
            `Pending reviews fetch failed (${pendingRes.status})`,
          );
        const pendingReviews = await pendingRes.json();


        const leadList = Array.isArray(leads) ? leads : leads?.leads || [];
       const approvedList = Array.isArray(approvedReviews)
         ? approvedReviews
         : approvedReviews?.reviews || [];

       const pendingList = Array.isArray(pendingReviews)
         ? pendingReviews
         : pendingReviews?.reviews || [];

       setApprovedReviewCount(approvedList.length);
       setPendingReviewCount(pendingList.length);


        // ----- lead counts -----
        const base = {
          total: leadList.length,
          new: 0,
          contacted: 0,
          quoted: 0,
          scheduled: 0,
          closed: 0,
          followOverdue: 0,
          followToday: 0,
          followUpcoming: 0,
        };

        for (const l of leadList) {
          if (base[l.status] !== undefined) base[l.status]++;

          // follow-up reminders
          const d = l.followUpDate ? new Date(l.followUpDate) : null;
          if (d && !isNaN(d.getTime())) {
            const now = new Date();
            const start = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              0,
              0,
              0,
              0,
            );
            const end = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              23,
              59,
              59,
              999,
            );

            if (d < start) base.followOverdue += 1;
            else if (d >= start && d <= end) base.followToday += 1;
            else {
              const in7 = new Date(start);
              in7.setDate(in7.getDate() + 7);
              if (d <= in7) base.followUpcoming += 1;
            }
          }
        }

        setCounts(base);
        setRecent(leadList.slice(0, 5));

        // ----- reviews -----
        const list = approvedList;

        const total = list.length;

        // rating can be rating, stars, or score depending on your model
        const getRating = (r) =>
          Number(r.rating ?? r.stars ?? r.score ?? 0) || 0;

        const sum = list.reduce((acc, r) => acc + getRating(r), 0);
        const avg = total ? sum / total : 0;

        // sort newest first (just in case API doesn't)
        const sorted = [...list].sort((a, b) => {
          const da = new Date(a.createdAt || a.date || 0).getTime();
          const db = new Date(b.createdAt || b.date || 0).getTime();
          return db - da;
        });

        setReviewStats({ total, avg });
        setReviews(sorted.slice(0, 5));
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
      }
    }

    load();
  }, []);

  const cards = useMemo(() => {
    if (!counts) return [];
    return [
      { label: "Total", value: counts.total },
      { label: "New", value: counts.new },
      { label: "Contacted", value: counts.contacted },
      { label: "Quoted", value: counts.quoted },
      { label: "Scheduled", value: counts.scheduled },
      { label: "Closed", value: counts.closed },
      {
        label: "Pending Reviews",
        value: pendingReviewCount,
        to: "/admin/reviews?status=pending",
      },
      {
        label: "Approved Reviews",
        value: approvedReviewCount,
        to: "/admin/reviews?status=approved",
      },
    ];
  }, [counts, pendingReviewCount,  approvedReviewCount]);

  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!counts) return <div>Loading dashboard…</div>;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            Lead status overview
          </p>
        </div>

        <Link
          to="/admin/leads"
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          View Leads →
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {cards.map((c) => {
          const card = (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 14,
                background: "#fff",
                cursor: c.to ? "pointer" : "default",
              }}
            >
              <div style={{ fontSize: 12, letterSpacing: 0.4, opacity: 0.7 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
                {c.value}
              </div>
            </div>
          );

          return c.to ? (
            <Link
              key={c.label}
              to={c.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {card}
            </Link>
          ) : (
            <div key={c.label}>{card}</div>
          );
        })}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>
          Follow-up reminders
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/leads?followup=overdue" style={pillStyle}>
            Overdue: {counts.followOverdue}
          </Link>

          <Link to="/admin/leads?followup=today" style={pillStyle}>
            Due today: {counts.followToday}
          </Link>

          <Link to="/admin/leads?followup=upcoming" style={pillStyle}>
            Next 7 days: {counts.followUpcoming}
          </Link>
        </div>
      </div>

      {/* Recent leads */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 700 }}>Recent leads</div>
          <Link
            to="/admin/leads"
            style={{ fontSize: 14, textDecoration: "none" }}
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ marginTop: 10, opacity: 0.75 }}>No leads yet.</div>
        ) : (
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {recent.map((l) => (
              <Link
                key={l._id}
                to={`/admin/leads?q=${encodeURIComponent(l.email || l.name || "")}`}
                style={{ textDecoration: "none", color: "inherit" }}
                title="Open in Leads"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "baseline",
                    borderTop: "1px solid #f1f1f1",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderRadius: 10,
                    cursor: "pointer",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                  onTouchStart={(e) =>
                    (e.currentTarget.style.background = "#f3f4f6")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {l.name || "Unnamed"}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.75 }}>
                      {l.serviceType || "—"} • {l.status || "new"}
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.createdAt ? new Date(l.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Quick actions</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/leads?status=new" style={pillStyle}>
            New
          </Link>
          <Link to="/admin/leads?status=contacted" style={pillStyle}>
            Contacted
          </Link>
          <Link to="/admin/leads?status=quoted" style={pillStyle}>
            Quoted
          </Link>
          <Link to="/admin/leads?status=scheduled" style={pillStyle}>
            Scheduled
          </Link>
          <Link to="/admin/leads?status=closed" style={pillStyle}>
            Closed
          </Link>
        </div>
      </div>
    </div>
  );
}

const pillStyle = {
  padding: "8px 10px",
  borderRadius: 999,
  border: "1px solid #ddd",
  textDecoration: "none",
  fontSize: 14,
  display: "inline-block",
};
