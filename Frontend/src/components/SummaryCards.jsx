import React from "react";
import { Calendar, AlertTriangle, Shield, Moon } from "lucide-react";

const CARDS = [
  { key: "total",      label: "Total Events",   sub: "Today & tomorrow", icon: Calendar,      color: "var(--teal)",   bg: "var(--teal-light)",   border: "rgba(13,148,136,0.18)"  },
  { key: "important",  label: "Need Attention",  sub: "Flagged by AI",    icon: AlertTriangle, color: "var(--amber)",  bg: "var(--amber-light)",  border: "rgba(180,83,9,0.18)"    },
  { key: "afterHours", label: "After Hours",     sub: "Outside work hours",icon: Moon,         color: "var(--purple)", bg: "var(--purple-light)", border: "rgba(124,58,237,0.18)"  },
  { key: "filtered",   label: "Filtered Out",    sub: "Noise suppressed", icon: Shield,        color: "#059669",       bg: "#d1fae5",             border: "rgba(5,150,105,0.18)"   },
];

const SummaryCards = ({ stats }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: "12px", marginBottom: "24px" }}>
    {CARDS.map(({ key, label, sub, icon: Icon, color, bg, border }, i) => (
      <div key={key} style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "18px", boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.18s, transform 0.18s", cursor: "default",
        animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: bg, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={16} color={color} strokeWidth={2} />
          </div>
          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "11px", color: "var(--ink-4)" }}>{sub}</span>
        </div>
        <div style={{ fontSize: "32px", fontFamily: "var(--serif)", color: "var(--ink)", lineHeight: 1, marginBottom: "5px" }}>
          {String(stats?.[key] ?? 0).padStart(2, "0")}
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-2)" }}>{label}</div>
        <div style={{
          marginTop: "12px", height: "3px", borderRadius: "2px",
          background: `linear-gradient(90deg, ${color}40, ${color})`,
          width: `${Math.max(8, Math.min(100, ((stats?.[key] ?? 0) / Math.max(stats?.total ?? 1, 1)) * 100 + 12))}%`,
          transition: "width 0.5s ease",
        }} />
      </div>
    ))}
  </div>
);

export default SummaryCards;
