import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

export default function ReviewsAdmin() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("status");
    if (s === "pending" || s === "approved" || s === "rejected") {
      setStatusFilter(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch(
        `/api/reviews/admin?status=${encodeURIComponent(statusFilter)}`,
      );
      if (!res.ok) throw new Error(`Failed to load reviews (${res.status})`);

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load reviews");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function act(id, action) {
    setBusyId(id);
    setError("");

    try {
      const res = await apiFetch(`/api/reviews/${id}/${action}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        let msg = `Action failed (${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      // Reload list after action
      await load();
    } catch (e) {
      setError(e.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  }

  async function del(id) {
    setBusyId(id);
    setError("");

    try {
      const res = await apiFetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) {
        let msg = `Delete failed (${res.status})`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      await load();
    } catch (e) {
      setError(e.message || "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  const stats = useMemo(() => {
    const total = items.length;
    const avg =
      total > 0
        ? items.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / total
        : 0;
    return { total, avg };
  }, [items]);

  return (
    <div style={{ padding: 18, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 10px" }}>Review Moderation</h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        <label style={{ fontWeight: 700 }}>Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            const v = e.target.value;
            setStatusFilter(v);
            setSearchParams({ status: v });
          }}
          style={{
            padding: "8px 10px",
            borderRadius: 10,
            border: "1px solid #ddd",
          }}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <button
          onClick={load}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>

        <div style={{ marginLeft: "auto", opacity: 0.8, fontSize: 14 }}>
          Count: <b>{stats.total}</b> | Avg rating:{" "}
          <b>{stats.avg.toFixed(1)}</b>
        </div>
      </div>

      {error ? (
        <div
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #f3c2c2",
            background: "#fff5f5",
            color: "#7a1f1f",
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <div style={{ opacity: 0.7 }}>Loading…</div>
      ) : items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>
          No reviews found for “{statusFilter}”.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {items.map((r) => {
            const name =
              `${r.firstName || ""} ${r.lastInitial ? r.lastInitial + "." : ""}`.trim();
            const when =
              r.submittedAt || r.createdAt
                ? new Date(r.submittedAt || r.createdAt).toLocaleString()
                : "";

            return (
              <div
                key={r._id}
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
                    flexWrap: "wrap",
                    alignItems: "baseline",
                  }}
                >
                  <div style={{ fontWeight: 800 }}>
                    {name || "Anonymous"}{" "}
                    <span style={{ fontWeight: 600, opacity: 0.7 }}>
                      • {r.rating}/5 • {r.serviceType || "Service"}
                      {r.city ? ` • ${r.city}` : ""}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{when}</div>
                </div>

                <div
                  style={{
                    marginTop: 8,
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.4,
                  }}
                >
                  {r.reviewText}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    disabled={busyId === r._id || r.status === "approved"}
                    onClick={() => act(r._id, "approve")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      opacity: busyId === r._id ? 0.6 : 1,
                    }}
                  >
                    Approve
                  </button>

                  <button
                    disabled={busyId === r._id || r.status === "rejected"}
                    onClick={() => act(r._id, "reject")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      opacity: busyId === r._id ? 0.6 : 1,
                    }}
                  >
                    Reject
                  </button>

                  <button
                    disabled={busyId === r._id}
                    onClick={() => del(r._id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      background: "#fff",
                      cursor: "pointer",
                      opacity: busyId === r._id ? 0.6 : 1,
                      marginLeft: "auto",
                    }}
                  >
                    Delete
                  </button>
                </div>

                <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                  Status: <b>{r.status}</b>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
