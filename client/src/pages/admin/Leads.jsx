import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";

function normalizeStatus(s) {
  const v = String(s || "").toLowerCase();
  if (v === "won" || v === "lost") return "closed"; // map old → new
  return v;
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showArchived, setShowArchived] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [copied, setCopied] = useState(null);
  const copiedTimerRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const statusFromUrl = searchParams.get("status");
  const qFromUrl = searchParams.get("q");

  useEffect(() => {
    if (statusFromUrl) setStatusFilter(statusFromUrl);
    if (qFromUrl) setSearch(qFromUrl);
  }, [statusFromUrl, qFromUrl]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);

    if (statusFilter && statusFilter !== "all")
      next.set("status", statusFilter);
    else next.delete("status");

    // keep existing q if present
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);

      const newQ = (search || "").trim();
      if (newQ) next.set("q", newQ);
      else next.delete("q");

      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next, { replace: true });
      }
    }, 300);

    return () => clearTimeout(t);
  }, [search, searchParams, setSearchParams]);

  useEffect(() => {
    const url = showArchived
      ? "http://localhost:5000/api/leads?archived=true"
      : "http://localhost:5000/api/leads";

    // Only show the full-screen loader on initial load
    if (leads.length === 0) setLoading(true);
    else setFetching(true);

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setLeads(Array.isArray(data) ? data : []);
        setLoading(false);
        setFetching(false);
      })
      .catch(() => {
        setLeads([]);
        setLoading(false);
        setFetching(false);
      });
  }, [showArchived, location.key]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        // optional: inspect error later
        return;
      }

      const updated = await res.json();

      setLeads((prev) =>
        Array.isArray(prev)
          ? prev.map((l) => (l._id === id ? updated : l))
          : [],
      );
    } catch {
      // ignore for now
    }
  }

  async function archiveLead(id) {
    const ok = window.confirm("Archive this lead? You can restore it later.");
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:5000/api/leads/${id}/archive`, {
        method: "PATCH",
        credentials: "include",
      });

      if (!res.ok) return;

      // Remove from current list immediately (since GET hides archived)
      setLeads((prev) => prev.filter((l) => l._id !== id));
    } catch {
      // ignore for now
    }
  }

  async function unarchiveLead(id) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/leads/${id}/unarchive`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (!res.ok) return;

      const updated = await res.json();

      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    } catch {
      // ignore for now
    }
  }

  const filteredLeads =
    statusFilter === "all"
      ? leads
      : leads.filter(
          (l) => normalizeStatus(l.status || "new") === statusFilter,
        );

  const query = search.trim().toLowerCase();

  const visibleLeads = query
    ? filteredLeads.filter((l) => {
        const haystack = `${l.name || ""} ${l.email || ""} ${
          l.phone || ""
        }`.toLowerCase();
        return haystack.includes(query);
      })
    : filteredLeads;

  const sortedLeads = [...visibleLeads].sort((a, b) => {
    const aDate = new Date(a.createdAt || 0);
    const bDate = new Date(b.createdAt || 0);

    return sortOrder === "newest" ? bDate - aDate : aDate - bDate;
  });

  const counts = leads.reduce(
    (acc, l) => {
      const s = l.status || "new";
      acc.all += 1;
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { all: 0, new: 0, contacted: 0, scheduled: 0, quoted: 0, closed: 0 },
  );

  const archivedCount = leads.filter((l) => l.archived).length;

  function toggleSort() {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  }

  function exportCSV() {
    const rows = sortedLeads;

    const header = [
      "Date",
      "Name",
      "Email",
      "Phone",
      "Service Type",
      "Status",
      "Details",
    ];

    const escapeCSV = (value) => {
      const str = String(value ?? "");
      // Wrap fields in quotes and escape quotes to keep CSV valid
      return `"${str.replace(/"/g, '""')}"`;
    };

    const lines = [
      header.map(escapeCSV).join(","),
      ...rows.map((l) =>
        [
          l.createdAt ? new Date(l.createdAt).toISOString() : "",
          l.name,
          l.email,
          l.phone,
          l.serviceType,
          l.status || "new",
          l.message,
        ]
          .map(escapeCSV)
          .join(","),
      ),
    ];

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `stymies-leads-${stamp}.csv`;

    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (loading) return <p>Loading leads…</p>;

  return (
    <div className="container" style={{ paddingTop: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ marginBottom: 0 }}>Leads</h1>

        {fetching && (
          <span style={{ fontSize: 12, opacity: 0.7 }}>Updating…</span>
        )}

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
          />
          Show archived ({archivedCount})
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            className="button button-primary"
            type="button"
            onClick={exportCSV}
            disabled={!sortedLeads || sortedLeads.length === 0}
            style={{ padding: "8px 12px" }}
          >
            Export CSV
          </button>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            style={{
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ddd",
              background: "#fff",
              minWidth: 240,
            }}
          />
          <label style={{ fontWeight: 700, fontSize: 14 }}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 4,
              border: "1px solid #ddd",
              background: "#fff",
            }}
          >
            <option value="all">All ({counts.all})</option>
            <option value="new">New ({counts.new})</option>
            <option value="contacted">Contacted ({counts.contacted})</option>
            <option value="scheduled">Scheduled ({counts.scheduled})</option>
            <option value="quoted">Quoted ({counts.quoted})</option>
            <option value="closed">Closed ({counts.closed})</option>
          </select>
        </div>
      </div>

      {!Array.isArray(sortedLeads) || sortedLeads.length === 0 ? (
        <p>No leads match your search/filter.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{ ...th, cursor: "pointer", userSelect: "none" }}
                  onClick={toggleSort}
                  title="Click to toggle sort"
                >
                  Date {sortOrder === "newest" ? "▼" : "▲"}
                </th>

                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Service</th>
                <th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeads.map((lead) => (
                <tr
                  key={lead._id}
                  style={lead.archived ? archivedRow : undefined}
                >
                  <td style={td}>
                    {lead.createdAt
                      ? new Date(lead.createdAt).toLocaleString()
                      : ""}
                  </td>
                  <td style={td}>
                    <Link
                      to={`/admin/leads/${lead._id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: 700,
                      }}
                      title="View lead details"
                    >
                      {lead.name || "Unnamed"}
                    </Link>
                  </td>
                  <td style={td}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span
                        style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {lead.email || "—"}
                      </span>

                      {lead.email && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            navigator.clipboard.writeText(lead.email);
                            setCopied(`email-${lead._id}`);
                            if (copiedTimerRef.current)
                              clearTimeout(copiedTimerRef.current);
                            copiedTimerRef.current = setTimeout(
                              () => setCopied(null),
                              1500,
                            );
                          }}
                          style={{
                            ...copyBtn,
                            background:
                              copied === `email-${lead._id}`
                                ? "#ecfdf5"
                                : "#fff",
                            borderColor:
                              copied === `email-${lead._id}`
                                ? "#10b981"
                                : "#ddd",
                            color:
                              copied === `email-${lead._id}`
                                ? "#065f46"
                                : "inherit",
                          }}
                          title="Copy email"
                        >
                          {copied === `email-${lead._id}` ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={td}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span>{lead.phone || "—"}</span>

                      {lead.phone && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            navigator.clipboard.writeText(lead.phone);
                            setCopied(`phone-${lead._id}`);

                            if (copiedTimerRef.current) {
                              clearTimeout(copiedTimerRef.current);
                            }

                            copiedTimerRef.current = setTimeout(() => {
                              setCopied(null);
                            }, 1500);
                          }}
                          style={{
                            ...copyBtn,
                            background:
                              copied === `phone-${lead._id}`
                                ? "#ecfdf5"
                                : "#fff",
                            borderColor:
                              copied === `phone-${lead._id}`
                                ? "#10b981"
                                : "#ddd",
                            color:
                              copied === `phone-${lead._id}`
                                ? "#065f46"
                                : "inherit",
                          }}
                          title="Copy phone"
                        >
                          {copied === `phone-${lead._id}` ? "Copied" : "Copy"}
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={td}>{lead.serviceType || "-"}</td>
                  <td style={td}>
                    <span
                      style={{
                        ...badge,
                        ...statusBadge(
                          lead.archived ? "archived" : lead.status || "new",
                        ),
                      }}
                    >
                      {lead.archived ? "archived" : lead.status || "new"}
                    </span>
                  </td>

                  <td style={td}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <select
                        value={
                          lead.archived ? "archived" : lead.status || "new"
                        }
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        disabled={lead.archived}
                        style={{
                          padding: "6px 8px",
                          borderRadius: 4,
                          border: "1px solid #ddd",
                          background: "#fff",
                          fontSize: 14,
                        }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </select>

                      {lead.archived ? (
                        <button
                          type="button"
                          className="button button-outline"
                          onClick={() => unarchiveLead(lead._id)}
                          style={{ padding: "6px 10px" }}
                          title="Restore lead"
                        >
                          Restore
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="button button-outline"
                          onClick={() => archiveLead(lead._id)}
                          style={{ padding: "6px 10px" }}
                          title="Archive lead"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #eee",
  fontWeight: 700,
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px 12px",
  borderBottom: "1px solid #f1f1f1",
  verticalAlign: "top",
  whiteSpace: "nowrap",
};

const badge = {
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  background: "#f3f4f6",
};

const copyBtn = {
  padding: "4px 8px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
};

const archivedRow = {
  opacity: 0.55,
};

function statusBadge(status) {
  switch (status) {
    case "quoted":
      return {
        background: "#ecfdf5",
        color: "#065f46",
        border: "1px solid #a7f3d0",
      };
    case "closed":
      return {
        background: "#fef2f2",
        color: "#991b1b",
        border: "1px solid #fecaca",
      };
    case "scheduled":
      return {
        background: "#eff6ff",
        color: "#1e40af",
        border: "1px solid #bfdbfe",
      };
    case "contacted":
      return {
        background: "#fffbeb",
        color: "#92400e",
        border: "1px solid #fde68a",
      };
    case "new":
    default:
      return {
        background: "#f3f4f6",
        color: "#111827",
        border: "1px solid #e5e7eb",
      };
    case "archived":
      return {
        background: "#f3f4f6",
        color: "#6b7280",
        border: "1px solid #e5e7eb",
      };
  }
}
