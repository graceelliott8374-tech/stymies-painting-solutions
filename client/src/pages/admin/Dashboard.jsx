import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://localhost:5000/api/leads", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load leads");

        const leads = await res.json();

        const base = {
          total: leads.length,
          new: 0,
          contacted: 0,
          quoted: 0,
          scheduled: 0,
          closed: 0,
        };

        for (const l of leads) {
          if (base[l.status] !== undefined) base[l.status]++;
        }

        setCounts(base);

        setRecent(Array.isArray(leads) ? leads.slice(0, 5) : []);
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
    ];
  }, [counts]);

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
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              padding: 14,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 0.4, opacity: 0.7 }}>
              {c.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6 }}>
              {c.value}
            </div>
          </div>
        ))}
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
        <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
          (If the filters don’t apply yet, we’ll wire that next.)
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
