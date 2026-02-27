import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const fmtTime = dt => dt ? new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";
const fmtDate = dt => {
  if (!dt) return "";
  const d = new Date(dt), now = new Date(), tmr = new Date();
  tmr.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tmr.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const REASON = {
  keyword:       { label: "🔤 Keyword match",   bg: "#dcfce7",             color: "#059669"       },
  attendee:      { label: "📬 In your To field", bg: "var(--purple-light)", color: "var(--purple)" },
  organizer:     { label: "🗓 You organized",    bg: "#dbeafe",            color: "#1d4ed8"       },
  highImportance:{ label: "❗ High importance",  bg: "var(--red-light)",   color: "var(--red)"    },
};

const RSVP = {
  accepted:  { label: "Accepted",  bg: "rgba(209,250,229,.9)", color: "#059669", dot: "#059669" },
  tentative: { label: "Tentative", bg: "rgba(254,243,199,.9)", color: "#b45309", dot: "#f59e0b" },
  declined:  { label: "Declined",  bg: "rgba(254,226,226,.9)", color: "#dc2626", dot: "#ef4444" },
};

const getRsvp = (event, userEmail) => {
  if (!event.attendees?.length) return null;
  const me = event.attendees.find(a =>
    a.email?.toLowerCase() === (userEmail || "").toLowerCase()
  );
  if (!me) return null;
  return RSVP[me.responseStatus] || null;
};

export const EventRow = ({ event, showActions, onDone, onDecline, idx = 0, userEmail }) => {
  const dt   = event.start?.dateTime;
  const _hour = dt ? new Date(dt).getHours() : null;
  const isEarlyMorning = _hour !== null && _hour < 9;
  const isLateNight    = _hour !== null && _hour >= 17;
  const late           = isEarlyMorning || isLateNight;
  const primaryReason  = (event.importanceReasons?.find(r => REASON[r])) || event.importanceReason;
  const accentColor = isEarlyMorning ? "#059669"
    : isLateNight    ? "var(--purple)"
    : primaryReason && REASON[primaryReason] ? REASON[primaryReason].color
    : "var(--border)";
  const rsvp = getRsvp(event, userEmail);

  const [hov,      setHov]      = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleDone = () => {
    setRemoving(true);
    setTimeout(() => onDone?.(event._id), 220); // let animation finish first
  };

  const handleDecline = () => {
    setRemoving(true);
    setTimeout(() => onDecline?.(event._id), 220);
  };

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        animation: `fadeUp 0.25s ease ${Math.min(idx, 10) * 0.04}s both`,
        opacity: removing ? 0 : 1,
        transform: removing ? "translateX(20px)" : "translateX(0)",
        transition: removing ? "opacity 0.2s ease, transform 0.2s ease" : undefined,
        pointerEvents: removing ? "none" : undefined,
      }}
    >
      {/* Accent bar */}
      <div style={{
        width: "3px", flexShrink: 0, borderRadius: "3px 0 0 3px",
        background: accentColor,
        opacity: hov ? 1 : 0.5, transition: "opacity 0.15s",
      }} />

      {/* Card */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", gap: "14px",
        padding: "13px 16px",
        background: "var(--white)",
        border: "1px solid", borderLeft: "none",
        borderColor: hov ? "var(--border-dark)" : "var(--border)",
        borderRadius: "0 var(--radius) var(--radius) 0",
        boxShadow: hov ? "var(--shadow-md)" : "var(--shadow-sm)",
        transition: "all 0.15s", marginBottom: "0",
      }}>
        {/* Time */}
        <div style={{ minWidth: "62px", textAlign: "right", flexShrink: 0 }}>
          <div style={{
            fontFamily: "var(--serif)", fontSize: "14px", fontWeight: 600, lineHeight: 1.1,
            color: isEarlyMorning ? "#059669" : isLateNight ? "var(--purple)" : "#059669",
          }}>{fmtTime(dt)}</div>
          <div style={{ fontSize: "10px", color: "var(--ink-4)", marginTop: "2px", fontWeight: 500 }}>{fmtDate(dt)}</div>
        </div>

        <div style={{ width: "1px", height: "32px", background: "var(--border)", flexShrink: 0 }} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "14px", fontWeight: 500, color: "var(--ink)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "5px",
          }}>{event.summary || "Untitled event"}</div>
          {rsvp && (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: rsvp.dot, flexShrink: 0 }} />
              <span style={{
                fontSize: "10px", fontWeight: 600, padding: "1px 7px",
                background: rsvp.bg, color: rsvp.color, borderRadius: "5px",
              }}>{rsvp.label}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
            <ABtn onClick={handleDone} bg="#d1fae5" hbg="#a7f3d0" color="#059669">
              <CheckCircle size={13} /> Done
            </ABtn>
            <ABtn onClick={handleDecline} bg="var(--purple-light)" hbg="#ddd6fe" color="var(--purple)">
              <XCircle size={13} /> Decline
            </ABtn>
          </div>
        )}
      </div>
    </div>
  );
};

const Chip = ({ children, bg, color }) => (
  <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", background: bg, color, borderRadius: "5px" }}>
    {children}
  </span>
);

const ABtn = ({ children, onClick, bg, hbg, color }) => {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "flex", alignItems: "center", gap: "4px",
      padding: "5px 11px", borderRadius: "7px", border: "none",
      background: h ? hbg : bg, color, fontSize: "12px", fontWeight: 600,
      cursor: "pointer", fontFamily: "var(--sans)", transition: "background 0.15s", whiteSpace: "nowrap",
    }}>
      {children}
    </button>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: "center", padding: "64px 0", color: "var(--ink-4)" }}>
    <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
    <div style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "var(--ink-2)", marginBottom: "6px" }}>{title}</div>
    <div style={{ fontSize: "13px" }}>{subtitle}</div>
  </div>
);

// ─── Page header ──────────────────────────────────────────────────────────────
export const PageHeader = ({ title, subtitle, badge, badgeBg, badgeColor, right }) => (
  <div style={{
    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
    marginBottom: "28px", flexWrap: "wrap", gap: "12px",
  }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
        <h2 style={{
          fontFamily: "var(--serif)", fontSize: "28px", fontWeight: 400,
          color: "var(--ink)", letterSpacing: "-0.01em",
        }}>{title}</h2>
        {badge !== undefined && (
          <span style={{
            fontSize: "12px", fontWeight: 700, padding: "2px 10px",
            background: badgeBg || "#dcfce7",
            color: badgeColor || "#059669", borderRadius: "6px",
          }}>{badge}</span>
        )}
      </div>
      {subtitle && <p style={{ fontSize: "13px", color: "var(--ink-3)" }}>{subtitle}</p>}
    </div>
    {right}
  </div>
);

export default EventRow;
