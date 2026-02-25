import React, { useMemo } from "react";

const toMinutes = (dt) => {
  if (!dt) return null;
  const d = new Date(dt);
  return d.getHours() * 60 + d.getMinutes();
};

const pct = (min, rangeStart, rangeEnd) =>
  ((min - rangeStart) / (rangeEnd - rangeStart)) * 100;

export default function TimelineStrip({
  events = [],
  workStart  = 9,
  workEnd    = 17,
  alertRange = 3,
}) {
  // Timeline spans workStart-alertRange → workEnd+alertRange, clamped 0–24
  const HOUR_START = Math.max(0,  workStart - alertRange);
  const HOUR_END   = Math.min(24, workEnd   + alertRange);
  const rangeStartMin = HOUR_START * 60;
  const rangeEndMin   = HOUR_END   * 60;
  const workStartMin  = workStart  * 60;
  const workEndMin    = workEnd    * 60;

  const now    = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const nowPct = Math.max(0, Math.min(100, pct(nowMin, rangeStartMin, rangeEndMin)));

  const todayEvents = useMemo(() => {
    const today = now.toDateString();
    return events.filter(e => {
      const dt = e.start?.dateTime;
      return dt && new Date(dt).toDateString() === today;
    });
  }, [events]);

  const segments = useMemo(() => {
    return todayEvents.map(e => {
      const startMin = toMinutes(e.start?.dateTime);
      const endMin   = toMinutes(e.end?.dateTime) || (startMin + 60);
      const clampS   = Math.max(startMin, rangeStartMin);
      const clampE   = Math.min(endMin,   rangeEndMin);
      if (clampS >= clampE) return null;
      const isAfterHours = startMin < workStartMin || startMin >= workEndMin;
      return {
        left:    pct(clampS, rangeStartMin, rangeEndMin),
        width:   pct(clampE, rangeStartMin, rangeEndMin) - pct(clampS, rangeStartMin, rangeEndMin),
        isAfterHours,
        summary: e.summary || "Event",
        time:    new Date(e.start.dateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
    }).filter(Boolean);
  }, [todayEvents, rangeStartMin, rangeEndMin, workStartMin, workEndMin]);

  // Work hours zone position on the bar
  const workZoneLeft  = pct(workStartMin, rangeStartMin, rangeEndMin);
  const workZoneWidth = pct(workEndMin,   rangeStartMin, rangeEndMin) - workZoneLeft;

  // Hour labels — every 2 hrs
  const labels = [];
  for (let h = HOUR_START; h <= HOUR_END; h += 2) {
    labels.push({ h, p: pct(h * 60, rangeStartMin, rangeEndMin) });
  }

  const fmt = h => h === 0 ? "12am" : h === 12 ? "12pm" : h > 12 ? `${h-12}pm` : `${h}am`;

  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "18px 20px",
      boxShadow: "var(--shadow-sm)", marginBottom: "18px",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink-2)" }}>Today's timeline</span>
          <span style={{ fontSize: "10px", color: "var(--ink-4)" }}>
            {fmt(HOUR_START)} – {fmt(HOUR_END)}
          </span>
          {todayEvents.length > 0 && (
            <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 7px",
              background: "#dcfce7", color: "#059669", borderRadius: "5px" }}>
              {todayEvents.length} meeting{todayEvents.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <span style={{ fontSize: "11px", color: "var(--ink-4)" }}>
          {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      {/* Track */}
      <div style={{ position: "relative", height: "32px" }}>
        {/* Rail */}
        <div style={{
          position: "absolute", top: "10px", left: 0, right: 0, height: "12px",
          borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--border)",
          overflow: "hidden",
        }}>
          {/* Work hours zone — slightly lighter background */}
          <div style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${Math.max(0, workZoneLeft)}%`,
            width: `${Math.min(workZoneWidth, 100 - Math.max(0, workZoneLeft))}%`,
            background: "rgba(255,255,255,0.45)",
          }} />

          {/* Segments */}
          {segments.map((s, i) => (
            <div key={i} title={`${s.time} — ${s.summary}`} style={{
              position: "absolute", top: 0, bottom: 0,
              left:  `${s.left}%`,
              width: `${Math.max(s.width, 1.2)}%`,
              background: s.isAfterHours
                ? "rgba(167,139,250,0.45)"   // light purple
                : "rgba(187,247,208,0.55)", // light green
              borderLeft: s.isAfterHours
                ? "2px solid rgba(139,92,246,0.6)"
                : "2px solid rgba(5,150,105,0.5)",
              cursor: "default",
            }} />
          ))}
        </div>

        {/* Work hours boundary markers */}
        {[workZoneLeft, workZoneLeft + workZoneWidth].map((p, i) => (
          p >= 0 && p <= 100 ? (
            <div key={i} style={{
              position: "absolute", top: "6px", bottom: 0,
              left: `${p}%`, width: "1px",
              background: "rgba(5,150,105,0.35)",
              pointerEvents: "none", zIndex: 1,
            }} />
          ) : null
        ))}

        {/* Now needle */}
        {nowMin >= rangeStartMin && nowMin <= rangeEndMin && (
          <div style={{
            position: "absolute", top: "3px",
            left: `${nowPct}%`, transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center",
            pointerEvents: "none", zIndex: 3,
          }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%",
              background: "#7c3aed", boxShadow: "0 0 0 2px #fff, 0 0 0 3.5px rgba(124,58,237,.35)" }} />
            <div style={{ width: "1.5px", height: "16px", background: "#7c3aed", opacity: 0.75 }} />
          </div>
        )}
      </div>

      {/* Hour labels */}
      <div style={{ position: "relative", marginTop: "5px", height: "14px" }}>
        {labels.map(({ h, p }) => (
          <span key={h} style={{
            position: "absolute", left: `${p}%`, transform: "translateX(-50%)",
            fontSize: "9px", color: "var(--ink-4)", fontWeight: 500, whiteSpace: "nowrap",
          }}>{fmt(h)}</span>
        ))}
      </div>

      {/* Legend */}
      {todayEvents.length === 0 ? (
        <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--ink-4)", textAlign: "center" }}>
          No meetings today — enjoy the free day ☕
        </div>
      ) : (
        <div style={{ display: "flex", gap: "14px", marginTop: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "14px", height: "7px", borderRadius: "3px",
              background: "rgba(187,247,208,0.55)", borderLeft: "2px solid rgba(5,150,105,0.5)" }} />
            <span style={{ fontSize: "10px", color: "var(--ink-4)" }}>Work hours</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "14px", height: "7px", borderRadius: "3px",
              background: "rgba(167,139,250,0.45)", borderLeft: "2px solid rgba(139,92,246,0.6)" }} />
            <span style={{ fontSize: "10px", color: "var(--ink-4)" }}>After hours</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginLeft: "auto" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#7c3aed" }} />
            <span style={{ fontSize: "10px", color: "var(--ink-4)" }}>Now</span>
          </div>
        </div>
      )}
    </div>
  );
}
