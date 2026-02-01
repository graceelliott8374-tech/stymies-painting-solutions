import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/apiFetch";

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleString();
}

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notesDirty, setNotesDirty] = useState(false);
  const [followUpValue, setFollowUpValue] = useState("");
  const [followUpDirty, setFollowUpDirty] = useState(false);

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (notesDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [notesDirty]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/api/leads/${id}`);

        if (!res.ok) throw new Error("Failed to load lead");

        const data = await res.json();
        setLead(data);
        setFollowUpValue(
          data.followUpDate
            ? new Date(data.followUpDate).toISOString().slice(0, 16)
            : "",
        );
        setFollowUpDirty(false);
        setNotesDirty(false);
      } catch (e) {
        setError(e.message || "Failed to load lead.");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  async function updateStatus(status) {
    try {
      setSaving(true);
      setError("");

      const res = await apiFetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setLead(updated);
    } catch (e) {
      setError(e.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleArchive() {
    try {
      setSaving(true);
      setError("");

      const endpoint = lead.archived ? "unarchive" : "archive";

      const res = await apiFetch(`/api/leads/${id}/${endpoint}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to update archive status");

      const updated = await res.json();
      setLead(updated);
    } catch (e) {
      setError(e.message || "Failed to update archive status.");
    } finally {
      setSaving(false);
    }
  }

  async function saveAdminNotes() {
    try {
      setSaving(true);
      setError("");

      const res = await apiFetch(`/api/leads/${id}/admin-notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: lead.adminNotes || "" }),
      });

      if (!res.ok) throw new Error("Failed to save admin notes");

      const updated = await res.json();
      setLead(updated);
      setNotesDirty(false);
    } catch (e) {
      setError(e.message || "Failed to save admin notes.");
    } finally {
      setSaving(false);
    }
  }

  function setFollowUpPreset(daysAhead) {
    const now = new Date();

    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysAhead,
      9, // 9 AM
      0,
      0,
      0,
    );

    // format for <input type="datetime-local"> => "YYYY-MM-DDTHH:mm"
    const pad = (n) => String(n).padStart(2, "0");
    const v = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;


    setFollowUpValue(v);
    setFollowUpDirty(true);
  }


  async function saveFollowUp() {
    try {
      setSaving(true);
      setError("");

      // datetime-local gives "YYYY-MM-DDTHH:mm" in local time.
      // Convert to ISO so the server stores a real Date consistently.
      const payload = followUpValue
        ? { followUpDate: new Date(followUpValue).toISOString() }
        : { followUpDate: null };

      const res = await apiFetch(`/api/leads/${id}/follow-up`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save follow-up date");

      const updated = await res.json();
      setLead(updated);

      // Sync the input with whatever the server saved
      setFollowUpValue(
        updated.followUpDate
          ? new Date(updated.followUpDate).toISOString().slice(0, 16)
          : "",
      );
      setFollowUpDirty(false);
    } catch (e) {
      setError(e.message || "Failed to save follow-up date.");
    } finally {
      setSaving(false);
    }
  }

  async function clearFollowUp() {
    try {
      setSaving(true);
      setError("");

      const res = await apiFetch(`/api/leads/${id}/follow-up`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followUpDate: null }),
      });

      if (!res.ok) throw new Error("Failed to clear follow-up date");

      const updated = await res.json();
      setLead(updated);
      setFollowUpValue("");
      setFollowUpDirty(false);
    } catch (e) {
      setError(e.message || "Failed to clear follow-up date.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading lead…</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!lead) return <div>Lead not found.</div>;

  return (
    <div className="container" style={{ paddingTop: 24, maxWidth: 900 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        {/* LEFT: Title */}
        <div>
          <h1 style={{ margin: 0 }}>{lead.name || "Unnamed Lead"}</h1>
          <div style={{ marginTop: 6, opacity: 0.75 }}>
            {lead.serviceType || "—"} • {lead.status || "new"}
          </div>
        </div>

        {/* MIDDLE: Actions (NEW) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            value={lead.archived ? "archived" : lead.status || "new"}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={saving || lead.archived}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
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

          <button
            type="button"
            onClick={toggleArchive}
            disabled={saving}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              fontSize: 14,
            }}
            title={lead.archived ? "Restore lead" : "Archive lead"}
          >
            {lead.archived ? "Restore" : "Archive"}
          </button>

          {saving && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>Saving…</span>
          )}
        </div>

        {/* RIGHT: Back link */}
        <Link
          to="/admin/leads"
          onClick={(e) => {
            if (notesDirty) {
              const ok = window.confirm(
                "You have unsaved admin notes. Leave without saving?",
              );
              if (!ok) e.preventDefault();
            }
          }}
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
            height: "fit-content",
          }}
        >
          ← Back to Leads
        </Link>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <Info
          label="Email"
          value={
            lead.email ? (
              <a href={`mailto:${lead.email}`} style={linkStyle}>
                {lead.email}
              </a>
            ) : (
              "—"
            )
          }
        />

        <Info
          label="Phone"
          value={
            lead.phone ? (
              <a href={`tel:${lead.phone}`} style={linkStyle}>
                {lead.phone}
              </a>
            ) : (
              "—"
            )
          }
        />
        <Info label="Address" value={lead.address || "—"} />
        <Info
          label="Submitted"
          value={
            lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "—"
          }
        />
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Message</div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
          {lead.message?.trim() ? lead.message : "—"}
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Next follow-up</div>

        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            type="datetime-local"
            value={followUpValue}
            onChange={(e) => {
              setFollowUpValue(e.target.value);
              setFollowUpDirty(true);
            }}
            style={{
              padding: "8px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              fontSize: 14,
            }}
          />

          <button
            type="button"
            onClick={saveFollowUp}
            disabled={saving || !followUpDirty}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: followUpDirty ? "#fff" : "#f6f6f6",
              cursor: saving || !followUpDirty ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Save Follow-up
          </button>

          <button
            type="button"
            onClick={clearFollowUp}
            disabled={saving}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Clear
          </button>

          {saving && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>Saving…</span>
          )}
          {!saving && !followUpDirty && (
            <span style={{ fontSize: 12, opacity: 0.6 }}>Saved</span>
          )}
        </div>
        <div
          style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <button
            type="button"
            onClick={() => setFollowUpPreset(1)}
            disabled={saving}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Tomorrow (9am)
          </button>

          <button
            type="button"
            onClick={() => setFollowUpPreset(3)}
            disabled={saving}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            +3 days (9am)
          </button>

          <button
            type="button"
            onClick={() => setFollowUpPreset(7)}
            disabled={saving}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: saving ? "not-allowed" : "pointer",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Next week (9am)
          </button>
        </div>
      </div>
      <div
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: 14,
          background: "#fff",
        }}
      >
        <div style={{ fontWeight: 800, marginBottom: 8 }}>Admin Notes</div>

        <textarea
          value={lead.adminNotes || ""}
          onChange={(e) => {
            setLead({ ...lead, adminNotes: e.target.value });
            setNotesDirty(true);
          }}
          placeholder="Internal notes (not visible to customers)"
          rows={4}
          style={{
            width: "100%",
            resize: "vertical",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            fontSize: 14,
            lineHeight: 1.4,
          }}
        />

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 10,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={saveAdminNotes}
            disabled={saving || !notesDirty}
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: notesDirty ? "#fff" : "#f6f6f6",
              cursor: saving || !notesDirty ? "not-allowed" : "pointer",
              fontSize: 14,
              fontWeight: 700,
            }}
            title={!notesDirty ? "No changes to save" : "Save admin notes"}
          >
            Save Notes
          </button>

          {saving && (
            <span style={{ fontSize: 12, opacity: 0.7 }}>Saving…</span>
          )}
          {!saving && !notesDirty && (
            <span style={{ fontSize: 12, opacity: 0.6 }}>Saved</span>
          )}
        </div>
        {lead.updatedAt && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              opacity: 0.6,
              textAlign: "right",
            }}
          >
            Last updated: {formatDateTime(lead.updatedAt)}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: 14,
        background: "#fff",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.7 }}>{label}</div>
      <div style={{ fontWeight: 800, marginTop: 6 }}>{value}</div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "inherit",
  fontWeight: 800,
};
