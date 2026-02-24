import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Star, Moon, Settings, LogOut, Bell,
  ChevronRight, User, X, BellOff,
} from "lucide-react";
import API from "../lib/api";

// ─── Sidebar nav link ─────────────────────────────────────────────────────────
const NavLink = ({ to, icon: Icon, label, count, active }) => (
  <Link to={to} style={{ textDecoration: "none", display: "block", marginBottom: "1px" }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
      background: active ? "var(--white)" : "transparent",
      boxShadow: active ? "var(--shadow-sm)" : "none",
      border: active ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.15s",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        <Icon size={14} color={active ? "var(--teal)" : "var(--ink-3)"} strokeWidth={active ? 2.5 : 2} />
        <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : "var(--ink-2)" }}>
          {label}
        </span>
      </div>
      {count > 0 && (
        <span style={{
          fontSize: "10px", fontWeight: 700,
          background: "var(--teal)", color: "#fff",
          borderRadius: "5px", padding: "1px 6px", minWidth: "18px", textAlign: "center",
        }}>{count}</span>
      )}
    </div>
  </Link>
);

// ─── Notifications panel ──────────────────────────────────────────────────────
const AlertsPanel = ({ events, onClose, onDone, onDecline }) => (
  <div style={{
    position: "fixed", top: 0, right: 0, bottom: 0, width: "340px",
    background: "var(--white)", borderLeft: "1px solid var(--border)",
    zIndex: 300, display: "flex", flexDirection: "column",
    boxShadow: "var(--shadow-lg)", animation: "slideRight 0.22s ease",
  }}>
    <div style={{
      padding: "18px 20px", borderBottom: "1px solid var(--border)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div>
        <div style={{ fontFamily: "var(--serif)", fontSize: "18px", color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Bell size={16} color="var(--teal)" /> Alerts
        </div>
        <div style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "2px" }}>
          {events.length === 0 ? "You're all caught up 🎉" : `${events.length} flagged meeting${events.length > 1 ? "s" : ""}`}
        </div>
      </div>
      <button onClick={onClose} style={{
        background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "7px",
        color: "var(--ink-3)", cursor: "pointer", padding: "5px", display: "flex",
        transition: "all 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-3)"; }}
      ><X size={14} /></button>
    </div>

    <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "52px 16px", color: "var(--ink-4)" }}>
          <BellOff size={28} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
          <div style={{ fontFamily: "var(--serif)", fontSize: "16px", color: "var(--ink-2)" }}>All quiet</div>
          <div style={{ fontSize: "12px", marginTop: "5px" }}>No important meetings right now.</div>
        </div>
      ) : events.map(e => {
        const dt = e.start?.dateTime;
        const time = dt ? new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";
        const date = dt ? new Date(dt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";
        return (
          <div key={e._id} style={{
            background: "var(--off)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "14px", marginBottom: "10px",
          }}>
            <div style={{ fontFamily: "var(--serif)", fontSize: "15px", fontWeight: 600, color: "var(--ink)", marginBottom: "4px" }}>{e.summary}</div>
            <div style={{ fontSize: "11px", color: "var(--ink-3)", marginBottom: "10px" }}>{date} at {time}</div>
            <div style={{ display: "flex", gap: "7px" }}>
              <button onClick={() => onDone?.(e._id)} style={{
                flex: 1, padding: "7px", background: "#d1fae5", border: "1px solid rgba(5,150,105,0.2)",
                borderRadius: "7px", color: "#059669", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}>✓ Done</button>
              <button onClick={() => onDecline?.(e._id)} style={{
                flex: 1, padding: "7px", background: "var(--red-light)", border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: "7px", color: "var(--red)", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}>✕ Decline</button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Main layout wrapper ──────────────────────────────────────────────────────
const Layout = ({ user, impCount = 0, afterHoursCount = 0, alerts = [], onDone, onDecline, children }) => {
  const loc = useLocation();
  const [panel, setPanel] = useState(false);

  const handleLogout = () => { API.get("/api/logout").finally(() => window.location.href = "/"); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--off)" }}>
      {/* Sidebar */}
      <aside style={{
        width: "224px", flexShrink: 0, background: "var(--off)",
        borderRight: "1px solid var(--border)",
        position: "fixed", top: 0, left: 0, bottom: 0,
        display: "flex", flexDirection: "column", zIndex: 50,
      }}>
        {/* Brand */}
        <div style={{ padding: "22px 18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "4px" }}>
            <img src="/logo.jpg" alt="WMW" style={{
              width: "28px", height: "28px", borderRadius: "7px",
              objectFit: "cover", flexShrink: 0,
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
            }} />
            <span style={{ fontFamily: "var(--serif)", fontSize: "16px", color: "var(--ink)", lineHeight: 1.1 }}>Wake Me When</span>
          </div>

        </div>

        {/* Sync badge */}
        <div style={{ padding: "0 14px 16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "7px", padding: "7px 11px",
            background: "var(--teal-light)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: "8px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", display: "block", animation: "dot 2s infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--teal)" }}>Synced with Google</span>
          </div>
        </div>

        <div style={{ height: "1px", background: "var(--border)", margin: "0 16px 16px" }} />

        {/* Nav */}
        <nav style={{ padding: "0 10px", flex: 1 }}>
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-4)", textTransform: "uppercase", padding: "0 6px", marginBottom: "6px" }}>Views</div>
          <NavLink to="/home"       icon={LayoutDashboard} label="Dashboard"   active={loc.pathname === "/home"} />
          <NavLink to="/important"  icon={Star}            label="Important"   count={impCount} active={loc.pathname === "/important"} />
          <NavLink to="/afterhours" icon={Moon}            label="After Hours" count={afterHoursCount} active={loc.pathname === "/afterhours"} />
          <div style={{ height: "1px", background: "var(--border)", margin: "12px 6px" }} />
          <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "var(--ink-4)", textTransform: "uppercase", padding: "0 6px", marginBottom: "6px" }}>Settings</div>
          <NavLink to="/config" icon={Settings} label="Preferences" active={loc.pathname === "/config"} />
        </nav>

        <div style={{ height: "1px", background: "var(--border)", margin: "0 16px 14px" }} />

        {/* Bell */}
        <div style={{ padding: "0 14px 10px" }}>
          <button onClick={() => setPanel(v => !v)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 12px", borderRadius: "9px", cursor: "pointer",
            background: alerts.length > 0 ? "var(--amber-light)" : "var(--white)",
            border: `1px solid ${alerts.length > 0 ? "rgba(180,83,9,0.2)" : "var(--border)"}`,
            boxShadow: "var(--shadow-sm)", transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bell size={13} color={alerts.length > 0 ? "var(--amber)" : "var(--ink-3)"} />
              <span style={{ fontSize: "12px", fontWeight: 500, color: alerts.length > 0 ? "var(--amber)" : "var(--ink-2)" }}>
                {alerts.length > 0 ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""}` : "No alerts"}
              </span>
            </div>
            {alerts.length > 0 && <ChevronRight size={12} color="var(--amber)" />}
          </button>
        </div>

        {/* User */}
        <div style={{ padding: "0 14px 20px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "9px", padding: "9px 11px",
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: "9px", boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%",
              background: "var(--surface)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden", fontSize: "11px", fontWeight: 700, color: "var(--ink-2)", flexShrink: 0,
            }}>
              {user?.avatar
                ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : user?.name ? user.name[0].toUpperCase() : <User size={11} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.name?.split(" ")[0] || "You"}
              </div>
              <div style={{ fontSize: "10px", color: "var(--ink-4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email || "Signed in"}
              </div>
            </div>
            <button onClick={handleLogout} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--ink-4)", padding: "2px", display: "flex", transition: "color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--ink-4)"}
            ><LogOut size={12} /></button>
          </div>
        </div>
      </aside>

      {/* Alerts panel */}
      {panel && (
        <>
          <div onClick={() => setPanel(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 299 }} />
          <AlertsPanel events={alerts} onClose={() => setPanel(false)} onDone={id => { onDone?.(id); }} onDecline={id => { onDecline?.(id); }} />
        </>
      )}

      {/* Main */}
      <main style={{ marginLeft: "224px", flex: 1, padding: "36px 40px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
