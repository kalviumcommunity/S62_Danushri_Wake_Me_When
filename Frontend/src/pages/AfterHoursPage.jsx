import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, RefreshCw, Search, X, AlertTriangle, Clock } from "lucide-react";
import Layout from "../components/Layout";
import { EventRow, EmptyState, PageHeader } from "../components/EventRow";
import { useAppData } from "../lib/useAppData";

const fmtTime = dt => dt ? new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";
const fmtDate = dt => {
  if (!dt) return "";
  const d = new Date(dt), now = new Date(), tmr = new Date();
  tmr.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tmr.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

// Group events into Early Morning / Evening / Night
const getSlot = dt => {
  if (!dt) return "other";
  const h = new Date(dt).getHours();
  if (h >= 0  && h < 6)  return "night";
  if (h >= 6  && h < 9)  return "morning";
  if (h >= 17 && h < 20) return "evening";
  return "late";
};

const SLOTS = {
  morning: { label: "Early Morning", desc: "Before 9am",       color: "#d97706",        bg: "#fef3c7"  },
  evening: { label: "Evening",       desc: "After 5pm",        color: "var(--purple)",  bg: "var(--purple-light)" },
  late:    { label: "Late Night",    desc: "After 8pm",        color: "#6d28d9",        bg: "#ede9fe"  },
  night:   { label: "Overnight",     desc: "Midnight to 6am",  color: "#1e40af",        bg: "#dbeafe"  },
};

const AfterHoursPage = () => {
  const { user, authed, afterHours, important, allEvents, loading, error, setError, calendarNotLinked, fetchAll, markDone, declineEvent } = useAppData();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const nav = useNavigate();

  if (authed === false) { nav("/home"); return null; }

  const refresh = async () => { setRefreshing(true); await fetchAll().catch(() => {}); setRefreshing(false); };

  const filtered = afterHours.filter(e =>
    !search || (e.summary || "").toLowerCase().includes(search.toLowerCase())
  );

  // Group by time slot
  const grouped = filtered.reduce((acc, e) => {
    const slot = getSlot(e.start?.dateTime);
    if (!acc[slot]) acc[slot] = [];
    acc[slot].push(e);
    return acc;
  }, {});

  // Count by slot for the overview cards
  const slotCounts = Object.entries(grouped).map(([slot, evs]) => ({ slot, count: evs.length, ...SLOTS[slot] }));

  return (
    <Layout user={user} impCount={important.length} afterHoursCount={afterHours.length} alerts={important} onDone={markDone} onDecline={declineEvent}>
      <PageHeader
        title="After Hours"
        badge={afterHours.length}
        badgeBg="var(--purple-light)"
        badgeColor="var(--purple)"
        subtitle={afterHours.length === 0 ? "No meetings outside your work hours." : `${afterHours.length} meeting${afterHours.length > 1 ? "s" : ""} outside your working hours (9am–5pm).`}
        right={
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={13} style={{ position: "absolute", left: "10px", color: "var(--ink-4)", pointerEvents: "none" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…"
                style={{
                  padding: "7px 28px 7px 30px", background: "var(--white)",
                  border: "1px solid var(--border)", borderRadius: "8px",
                  color: "var(--ink)", fontSize: "13px", outline: "none",
                  boxShadow: "var(--shadow-sm)", width: "180px",
                }}
                onFocus={e => { e.target.style.borderColor = "var(--purple)"; e.target.style.boxShadow = "0 0 0 3px var(--purple-dim)"; }}
                onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "var(--shadow-sm)"; }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: "8px", background: "none", border: "none", cursor: "pointer", color: "var(--ink-4)", display: "flex" }}><X size={12} /></button>
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

      {/* Slot overview pills */}
      {slotCounts.length > 0 && !loading && (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
          {slotCounts.map(({ slot, label, desc, count, color, bg }) => (
            <div key={slot} style={{
              display: "flex", alignItems: "center", gap: "9px",
              padding: "10px 16px", background: "var(--white)",
              border: "1px solid var(--border)", borderRadius: "10px", boxShadow: "var(--shadow-sm)",
            }}>
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color }}>{label}</div>
                <div style={{ fontSize: "10px", color: "var(--ink-4)" }}>{desc} · {count} event{count !== 1 ? "s" : ""}</div>
              </div>
            </div>
          ))}
        </div>
      )}



      {loading ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <RefreshCw size={22} style={{ display: "block", margin: "0 auto 14px", animation: "spin 1s linear infinite", color: "var(--purple)" }} />
          <div style={{ fontFamily: "var(--serif)", fontSize: "15px", color: "var(--ink-3)" }}>Scanning your calendar…</div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="🌙" title={search ? "No matches" : "No after-hours meetings"} subtitle={search ? "Try a different search term" : "Great — nothing scheduled outside your work hours."} />
      ) : (
        Object.entries(grouped).map(([slot, events]) => {
          const meta = SLOTS[slot];
          return (
            <div key={slot} style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", background: meta?.bg, color: meta?.color, borderRadius: "6px" }}>
                  {meta?.label}
                </span>
                <span style={{ fontSize: "11px", color: "var(--ink-4)" }}>{events.length}</span>
                <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {events.map((e, i) => (
                  <EventRow key={e._id} event={e} idx={i} showActions onDone={markDone} onDecline={declineEvent} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </Layout>
  );
};

export default AfterHoursPage;
