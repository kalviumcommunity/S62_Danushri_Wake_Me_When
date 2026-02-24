import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, RefreshCw, Search, X, AlertTriangle } from "lucide-react";
import Layout from "../components/Layout";
import { EventRow, EmptyState, PageHeader } from "../components/EventRow";
import { useAppData } from "../lib/useAppData";
import API from "../lib/api";

// Module-level constant — must be outside component to avoid temporal dead zone
const GROUP_PRIORITY = ["keyword", "highImportance", "attendee", "organizer", "other"];

const ImportantPage = () => {
  const { user, authed, important, afterHours, allEvents, loading, error, setError, calendarNotLinked, fetchAll, markDone, declineEvent } = useAppData();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const nav = useNavigate();

  if (authed === false) { nav("/home"); return null; }

  const stats = {
    total:      allEvents.length,
    important:  important.length,
    afterHours: afterHours.length,
    filtered:   Math.max(0, allEvents.length - important.length),
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetchAll().catch(() => {});
    setRefreshing(false);
  };

  const filtered = important.filter(e =>
    !search || (e.summary || "").toLowerCase().includes(search.toLowerCase())
  );

  // Group events: keyword matches and To-field attendees get their own top-level group.
  // An event appears in the highest-priority group only.
  const byReason = filtered.reduce((acc, e) => {
    const allReasons = e.importanceReasons?.length ? e.importanceReasons : [e.importanceReason || "other"];
    // Find the highest-priority group this event belongs to
    const topGroup = GROUP_PRIORITY.find(g => allReasons.includes(g)) || "other";
    if (!acc[topGroup]) acc[topGroup] = [];
    acc[topGroup].push(e);
    return acc;
  }, {});

  const REASON_LABELS = {
    keyword:       { label: "Keyword Match",   color: "var(--teal)",   bg: "var(--teal-light)"   },
    attendee:      { label: "Required Attendee", color: "var(--amber)",  bg: "var(--amber-light)"  },
    organizer:     { label: "You Organized",   color: "#1d4ed8",       bg: "#dbeafe"             },
    highImportance:{ label: "High Importance", color: "var(--red)",    bg: "var(--red-light)"    },
    other:         { label: "Other",           color: "var(--ink-2)",  bg: "var(--surface)"      },
  };

  // Grouping strategy: an event can belong to MULTIPLE groups (keyword + attendee).
  // We show it in the MOST important group only, so keyword > attendee > organizer.

  return (
    <Layout user={user} impCount={important.length} afterHoursCount={afterHours.length} alerts={important} onDone={markDone} onDecline={declineEvent}>
      <PageHeader
        title="Important Meetings"
        badge={important.length}
        subtitle={important.length === 0 ? "No important meetings right now — enjoy the quiet." : `${important.length} meeting${important.length > 1 ? "s" : ""} flagged by AI as requiring your attention.`}
        right={
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {/* Search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={13} style={{ position: "absolute", left: "10px", color: "var(--ink-4)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                style={{
                  padding: "7px 28px 7px 30px", background: "var(--white)",
                  border: "1px solid var(--border)", borderRadius: "8px",
                  color: "var(--ink)", fontSize: "13px", outline: "none",
                  boxShadow: "var(--shadow-sm)", width: "180px",
                }}
                onFocus={e => { e.target.style.borderColor = "var(--teal)"; e.target.style.boxShadow = "0 0 0 3px var(--teal-dim)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "var(--shadow-sm)"; }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)", display: "flex" }}>
                  <X size={12} />
                </button>
              )}
            </div>
            <button onClick={refresh} disabled={refreshing} style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px",
              background: "var(--white)", border: "1px solid var(--border)", borderRadius: "9px",
              color: "var(--ink-2)", fontSize: "13px", fontWeight: 500, cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.6 : 1, boxShadow: "var(--shadow-sm)",
            }}>
              <RefreshCw size={13} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
              Refresh
            </button>
          </div>
        }
      />

      {/* Error */}
      {calendarNotLinked && (
        <div style={{ display:"flex", alignItems:"center", gap:"12px",
          padding:"14px 18px", marginBottom:"16px",
          background:"rgba(240,253,250,.95)", border:"1px solid rgba(13,148,136,.25)",
          borderRadius:"12px" }}>
          <span style={{ fontSize:"20px" }}>📅</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"13px", fontWeight:600, color:"#0f766e" }}>Calendar not connected</div>
            <div style={{ fontSize:"12px", color:"#64748b", marginTop:"2px" }}>Connect your Google Calendar to start filtering meetings.</div>
          </div>
          <a href="/connect-calendar" style={{
            padding:"8px 16px", borderRadius:"9px", textDecoration:"none",
            fontSize:"12px", fontWeight:600, color:"#fff",
            background:"linear-gradient(135deg,#0d9488,#0891b2)",
            boxShadow:"0 3px 12px rgba(13,148,136,.3)",
          }}>Connect Calendar</a>
        </div>
      )}
      {error && (
        <div style={{
          display: "flex", alignItems: "center", gap: "9px", padding: "11px 16px",
          background: "var(--red-light)", border: "1px solid rgba(220,38,38,0.2)",
          borderRadius: "9px", color: "var(--red)", fontSize: "13px", marginBottom: "20px",
        }}>
          <AlertTriangle size={14} /> {error}
          <button onClick={() => setError("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--red)", cursor: "pointer" }}><X size={13} /></button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <RefreshCw size={22} style={{ display: "block", margin: "0 auto 14px", animation: "spin 1s linear infinite", color: "var(--teal)" }} />
          <div style={{ fontFamily: "var(--serif)", fontSize: "15px", color: "var(--ink-3)" }}>Scanning your calendar…</div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="⭐" title={search ? "No matches" : "You're all clear!"} subtitle={search ? "Try a different search term" : "No important meetings flagged right now."} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {filtered.map((e, i) => (
            <EventRow key={e._id} event={e} idx={i} showActions onDone={markDone} onDecline={declineEvent} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ImportantPage;
