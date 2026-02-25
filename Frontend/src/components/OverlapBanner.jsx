import React, { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Check } from "lucide-react";
import API from "../lib/api";

const fmt = dt => new Date(dt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
const fmtDate = dt => {
  const d = new Date(dt), now = new Date(), tmr = new Date();
  tmr.setDate(now.getDate() + 1);
  if (d.toDateString() === now.toDateString()) return "Today";
  if (d.toDateString() === tmr.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const STORAGE_KEY = "wmw_resolved_conflicts";
const getStored  = () => { try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { return new Set(); } };
const saveStored = (s) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])); } catch {} };
const conflictKey = (o) => [o.a.id, o.b.id].sort().join("|");

function MeetingChoice({ event, side, chosen, dimmed, onChoose }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onChoose} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      disabled={chosen || dimmed}
      style={{
        flex:1, padding:"14px 16px", border:"none",
        cursor: chosen||dimmed ? "default" : "pointer",
        background: chosen ? "rgba(209,250,229,0.7)" : dimmed ? "rgba(241,245,249,0.4)" : hov ? "rgba(240,253,250,0.8)" : "transparent",
        textAlign: side==="left" ? "left" : "right",
        transition:"background .15s", opacity: dimmed ? 0.4 : 1,
        display:"flex", flexDirection:"column", alignItems: side==="left" ? "flex-start" : "flex-end",
        gap:"5px", fontFamily:"var(--sans)",
      }}>
      <div style={{ fontSize:"13px", fontWeight:600, color: chosen?"#059669":"#0f172a",
        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"100%" }}>
        {event.summary || "Untitled"}
      </div>
      <div style={{ fontSize:"10px", color:"#64748b" }}>
        {fmtDate(event.start)} · {fmt(event.start)}{event.end ? ` – ${fmt(event.end)}` : ""}
      </div>
      {!dimmed && (
        <div style={{ display:"inline-flex", alignItems:"center", gap:"4px",
          padding:"3px 9px", borderRadius:"6px", marginTop:"2px",
          background: chosen ? "rgba(5,150,105,0.15)" : "rgba(13,148,136,0.1)",
          color: chosen ? "#059669" : "var(--teal)", fontSize:"10px", fontWeight:700 }}>
          {chosen ? <><Check size={10}/> Attending</> : "Attend this →"}
        </div>
      )}
    </button>
  );
}

function ConflictCard({ overlap, onResolved, onSkip, onAccept }) {
  const [choosing, setChoosing] = useState(null);
  const [skipped,  setSkipped]  = useState(false);

  const handleChoose = async (keep) => {
    const skip = keep === "a" ? overlap.b : overlap.a;
    const keep_ = keep === "a" ? overlap.a : overlap.b;
    setChoosing(keep);

    // Accept chosen event via Google Calendar API
    if (keep_.id) {
      API.post(`/api/accept-event/${keep_.id}`).catch(() => {});
      onAccept?.(keep_.id); // update local RSVP to "accepted"
    }

    // Remove skipped event from list
    if (skip.id) {
      API.delete(`/api/${skip.id}`).catch(() => {});
      onSkip?.(skip.id);
    }

    setTimeout(() => onResolved(), 400);
  };

  if (skipped) return null;

  return (
    <div style={{ borderRadius:"12px", background:"rgba(255,255,255,0.75)",
      border:"1px solid rgba(245,158,11,0.25)", overflow:"hidden" }}>
      <div style={{ padding:"7px 14px", background:"rgba(254,243,199,0.6)",
        borderBottom:"1px solid rgba(245,158,11,0.15)",
        fontSize:"10px", fontWeight:700, color:"#b45309",
        letterSpacing:".07em", textTransform:"uppercase" }}>
        Choose which to attend →
      </div>
      <div style={{ display:"flex" }}>
        <MeetingChoice event={overlap.a} side="left"
          chosen={choosing==="a"} dimmed={choosing==="b"} onChoose={() => handleChoose("a")} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:"0 8px", gap:"4px", flexShrink:0 }}>
          <div style={{ width:"1px", flex:1, background:"rgba(245,158,11,0.2)" }}/>
          <span style={{ fontSize:"9px", fontWeight:800, color:"#d97706",
            letterSpacing:".08em", padding:"4px 0" }}>VS</span>
          <div style={{ width:"1px", flex:1, background:"rgba(245,158,11,0.2)" }}/>
        </div>
        <MeetingChoice event={overlap.b} side="right"
          chosen={choosing==="b"} dimmed={choosing==="a"} onChoose={() => handleChoose("b")} />
      </div>
    </div>
  );
}

export default function OverlapBanner({ onSkip, onAccept }) {
  const [overlaps,     setOverlaps]     = useState([]);
  const [resolvedKeys, setResolvedKeys] = useState(() => getStored());
  const [expanded,     setExpanded]     = useState(true);
  const [loaded,       setLoaded]       = useState(false);

  useEffect(() => {
    API.get("/api/overlap-events")
      .then(r => { setOverlaps(r.data?.overlaps || []); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const markResolved = (o) => {
    const next = new Set([...resolvedKeys, conflictKey(o)]);
    setResolvedKeys(next);
    saveStored(next);
  };

  const visible = overlaps.filter(o => !resolvedKeys.has(conflictKey(o)));
  if (!loaded || visible.length === 0) return null;

  return (
    <div style={{ marginBottom:"18px", background:"rgba(254,243,199,0.85)",
      border:"1px solid rgba(245,158,11,0.35)", borderRadius:"var(--radius-lg)",
      overflow:"hidden", boxShadow:"var(--shadow-sm)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"13px 18px",
        borderBottom: expanded ? "1px solid rgba(245,158,11,0.2)" : "none", cursor:"pointer" }}
        onClick={() => setExpanded(v => !v)}>
        <div style={{ width:"28px", height:"28px", borderRadius:"8px", flexShrink:0,
          background:"rgba(245,158,11,0.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <AlertTriangle size={14} color="#b45309"/>
        </div>
        <div style={{ flex:1 }}>
          <span style={{ fontSize:"13px", fontWeight:700, color:"#92400e" }}>
            {visible.length} scheduling conflict{visible.length!==1?"s":""} detected
          </span>
          <span style={{ fontSize:"11px", color:"#b45309", marginLeft:"8px" }}>
            — choose which meeting to attend
          </span>
        </div>
        {expanded ? <ChevronUp size={14} color="#b45309"/> : <ChevronDown size={14} color="#b45309"/>}
      </div>
      {expanded && (
        <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {visible.map((o) => (
            <ConflictCard key={`${o.a.id}-${o.b.id}`} overlap={o}
              onResolved={() => markResolved(o)}
              onSkip={onSkip}
              onAccept={onAccept}
            />
          ))}
        </div>
      )}
    </div>
  );
}
