import React, { useState, useMemo, useEffect, useRef } from "react";
import { RefreshCw, Search, X, AlertTriangle } from "lucide-react";
import Layout from "./components/Layout";
import SummaryCards from "./components/SummaryCards";
import { EventRow, EmptyState } from "./components/EventRow";
import TimelineStrip from "./components/TimelineStrip";
import OverlapBanner from "./components/OverlapBanner";
import API from "./lib/api";
import { useAppData } from "./lib/useAppData";

// ─── TRIAGE ANIMATION ────────────────────────────────────────────────────────
const TRIAGE_EVENTS = [
  { title:"Urgent: Board Review",  time:"9:00 AM",  keep:true,  dot:"#059669" },
  { title:"Weekly Standup",        time:"9:30 AM",  keep:false, dot:"#94a3b8" },
  { title:"Investor Call",         time:"7:30 PM",  keep:true,  dot:"#8b5cf6" },
  { title:"Coffee Chat",           time:"11:00 AM", keep:false, dot:"#94a3b8" },
  { title:"Client Demo — Req.",    time:"2:00 PM",  keep:true,  dot:"#7c3aed" },
  { title:"Design Sync",           time:"3:00 PM",  keep:false, dot:"#94a3b8" },
  { title:"Attention: Launch",     time:"11:30 AM", keep:true,  dot:"#f59e0b" },
  { title:"Sprint Retro",          time:"4:00 PM",  keep:false, dot:"#94a3b8" },
];
let _tid = 0;

function TriageAnimation() {
  const [queue,   setQueue]   = useState([]);
  const [kept,    setKept]    = useState([]);
  const [dropped, setDropped] = useState([]);
  const [scanning,setScanning]= useState(false);
  const pool = useRef(0);
  const tmrs = useRef([]);
  const t = (fn, ms) => { const id = setTimeout(fn, ms); tmrs.current.push(id); };

  useEffect(() => {
    const cycle = () => {
      const ev = TRIAGE_EVENTS[pool.current++ % TRIAGE_EVENTS.length];
      const id = ++_tid;
      const card = { ...ev, id, phase:"enter" };
      setQueue(q => [...q.slice(-1), card]);
      t(() => setScanning(true),  500);
      t(() => setScanning(false), 1400);
      t(() => setQueue(q => q.map(c => c.id===id ? {...c,phase:"decide"} : c)), 1500);
      t(() => {
        setQueue(q => q.filter(c => c.id!==id));
        if (ev.keep) setKept(k  => [{...card,phase:"settled"},...k].slice(0,3));
        else         setDropped(d => [{...card,phase:"settled"},...d].slice(0,3));
      }, 2300);
      t(cycle, 3200);
    };
    t(cycle, 400);
    return () => tmrs.current.forEach(clearTimeout);
  }, []);

  return (
    <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",
      padding:"22px 22px 18px",fontFamily:"Inter,system-ui,sans-serif",
      background:"linear-gradient(160deg,#e4f2f8 0%,#eef9ff 35%,#eff3ff 70%,#eafaf5 100%)"}}>
      <style>{`
        @keyframes card-enter  {from{opacity:0;transform:translateY(-16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes card-decide {0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}
        @keyframes scan-line   {from{width:0%}to{width:100%}}
        @keyframes col-in      {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-dot   {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.25;transform:scale(.4)}}
      `}</style>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:"#059669",animation:"pulse-dot 1.8s ease-in-out infinite"}}/>
          <span style={{fontSize:"10px",fontWeight:700,color:"#059669",letterSpacing:".1em",textTransform:"uppercase"}}>Triage — Live</span>
        </div>
        <span style={{fontSize:"10px",color:"#94a3b8"}}>{new Date().toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</span>
      </div>
      <div style={{marginBottom:"14px"}}>
        <div style={{fontSize:"9px",fontWeight:600,color:"#94a3b8",letterSpacing:".1em",textTransform:"uppercase",marginBottom:"8px"}}>Incoming</div>
        <div style={{minHeight:"64px"}}>
          {queue.map(card=>(
            <div key={card.id} style={{animation:card.phase==="enter"?"card-enter .4s cubic-bezier(.34,1.56,.64,1) both":card.phase==="decide"?"card-decide .4s ease both":undefined}}>
              {scanning&&card.phase==="enter"&&<div style={{height:"2px",marginBottom:"5px",borderRadius:"2px",background:"linear-gradient(90deg,transparent,#059669,transparent)",animation:"scan-line .9s ease forwards"}}/>}
              <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"11px 14px",borderRadius:"12px",
                background:card.keep?"rgba(240,253,250,.98)":"rgba(248,250,252,.9)",
                border:`1px solid ${card.keep?"rgba(5,150,105,.25)":"rgba(226,232,240,.8)"}`,
                boxShadow:card.keep?"0 2px 14px rgba(5,150,105,.12)":"none"}}>
                <div style={{width:"8px",height:"8px",borderRadius:"50%",flexShrink:0,background:card.dot,boxShadow:card.keep?`0 0 6px ${card.dot}`:"none"}}/>
                <div>
                  <div style={{fontSize:"12px",fontWeight:600,color:card.keep?"#0f172a":"#94a3b8"}}>{card.title}</div>
                  <div style={{fontSize:"10px",color:"#94a3b8",marginTop:"1px"}}>{card.time}</div>
                </div>
              </div>
            </div>
          ))}
          {queue.length===0&&<div style={{display:"flex",alignItems:"center",gap:"8px",padding:"12px 0"}}><div style={{width:"18px",height:"2px",borderRadius:"1px",background:"rgba(148,163,184,.3)"}}/><span style={{fontSize:"10px",color:"#cbd5e1"}}>Waiting for next meeting…</span></div>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
        <div style={{flex:1,height:"1px",background:"linear-gradient(to right,transparent,rgba(5,150,105,.25))"}}/>
        <div style={{fontSize:"9px",fontWeight:700,color:"#059669",letterSpacing:".1em",textTransform:"uppercase",padding:"4px 10px",background:"rgba(240,253,250,.95)",border:"1px solid rgba(5,150,105,.2)",borderRadius:"10px"}}>Smart Filter ↓</div>
        <div style={{flex:1,height:"1px",background:"linear-gradient(to left,transparent,rgba(5,150,105,.25))"}}/>
      </div>
      <div style={{display:"flex",gap:"10px",flex:1}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"8px"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#94a3b8"}}/>
            <span style={{fontSize:"9px",fontWeight:700,color:"#94a3b8",letterSpacing:".08em",textTransform:"uppercase"}}>Filtered out</span>
            <span style={{marginLeft:"auto",fontSize:"9px",fontWeight:700,color:"#cbd5e1",background:"rgba(0,0,0,.05)",borderRadius:"6px",padding:"1px 6px"}}>{dropped.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
            {dropped.map(card=>(
              <div key={card.id} style={{animation:"col-in .35s ease both",display:"flex",alignItems:"center",gap:"7px",padding:"7px 10px",borderRadius:"9px",background:"rgba(248,250,252,.9)",border:"1px solid rgba(226,232,240,.7)",opacity:.55}}>
                <div style={{width:"6px",height:"6px",borderRadius:"50%",flexShrink:0,background:"#cbd5e1"}}/>
                <div><div style={{fontSize:"10px",fontWeight:500,color:"#94a3b8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"90px"}}>{card.title}</div><div style={{fontSize:"9px",color:"#cbd5e1"}}>{card.time}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{width:"1px",background:"rgba(203,213,225,.4)",borderRadius:"1px"}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"8px"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:"#059669"}}/>
            <span style={{fontSize:"9px",fontWeight:700,color:"#059669",letterSpacing:".08em",textTransform:"uppercase"}}>Wake me</span>
            <span style={{marginLeft:"auto",fontSize:"9px",fontWeight:700,color:"#059669",background:"rgba(5,150,105,.1)",borderRadius:"6px",padding:"1px 6px"}}>{kept.length}</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
            {kept.map((card,i)=>(
              <div key={card.id} style={{animation:"col-in .35s ease both",animationDelay:`${i*.05}s`,display:"flex",alignItems:"center",gap:"7px",padding:"7px 10px",borderRadius:"9px",background:"rgba(240,253,250,.98)",border:`1px solid ${card.dot}35`,boxShadow:`0 2px 10px ${card.dot}15`}}>
                <div style={{width:"6px",height:"6px",borderRadius:"50%",flexShrink:0,background:card.dot,boxShadow:`0 0 5px ${card.dot}`}}/>
                <div><div style={{fontSize:"10px",fontWeight:600,color:"#0f172a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"90px"}}>{card.title}</div><div style={{fontSize:"9px",color:"#64748b"}}>{card.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ICONS / PILLS DATA ───────────────────────────────────────────────────────
const mkSvg = c => ({
  mail:     <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2.5" stroke={c} strokeWidth="1.8"/><path d="M3 8l9 6 9-6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  bell:     <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M12 3c-4 0-6 3-6 6v4l-2 2v1h16v-1l-2-2V9c0-3-2-6-6-6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 18a2 2 0 004 0" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  calendar: <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="3" stroke={c} strokeWidth="1.8"/><path d="M3 9h18" stroke={c} strokeWidth="1.8"/><path d="M8 2v4M16 2v4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  check:    <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3 7-7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="18" height="18" rx="3" stroke={c} strokeWidth="1.8"/></svg>,
  person:   <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M5 20c0-4 3-6 7-6s7 2 7 6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
});
const PILLS = {
  urgent:    { dot:"#ef4444", border:"rgba(239,68,68,.25)",   bg:"rgba(255,246,246,.95)", text:"Urgent: Board Review",      bold:true  },
  urgent2:   { dot:"#f59e0b", border:"rgba(245,158,11,.25)",  bg:"rgba(255,252,235,.95)", text:"Attention: Launch Meeting", bold:true  },
  wake1:     { dot:"#059669", border:"rgba(5,150,105,.25)",  bg:"rgba(240,253,250,.95)", text:"Investor Call — Wake me",   bold:true  },
  wake2:     { dot:"#059669", border:"rgba(5,150,105,.25)",  bg:"rgba(240,253,250,.95)", text:"Client Demo — Required",    bold:true  },
  check2:    { dot:"#8b5cf6", border:"rgba(139,92,246,.25)",  bg:"rgba(245,243,255,.95)", text:"Board Review — Required",   bold:true  },
  filtered1: { dot:"#94a3b8", border:"rgba(148,163,184,.25)", bg:"rgba(248,250,252,.88)", text:"Weekly Standup — Filtered", bold:false },
  filtered2: { dot:"#94a3b8", border:"rgba(148,163,184,.25)", bg:"rgba(248,250,252,.88)", text:"Coffee Chat — Filtered",    bold:false },
};
const FLOAT_ITEMS = [
  // Far left
  { t:"i", icon:"bell",     color:"#7c3aed", border:"rgba(124,58,237,.28)",   top:"12vh", left:"1.5%", anim:"fi1 8s ease-in-out infinite" },
  { t:"p", k:"filtered1",   top:"32vh", left:"1%",   anim:"fi4 9s ease-in-out infinite .6s" },
  { t:"i", icon:"check",    color:"#059669", border:"rgba(5,150,105,.28)",  top:"55vh", left:"2%",   anim:"fi3 9s ease-in-out infinite .4s" },
  { t:"p", k:"urgent",      top:"76vh", left:"1%",   anim:"fi6 10s ease-in-out infinite 2s" },
  // Mid-left — fills top+bottom left gaps
  { t:"p", k:"wake1",       top:"6vh",  left:"14%",  anim:"fi2 8s ease-in-out infinite 1s" },
  { t:"i", icon:"calendar", color:"#8b5cf6", border:"rgba(139,92,246,.28)",  top:"22vh", left:"15%",  anim:"fi5 10s ease-in-out infinite 2s" },
  { t:"i", icon:"person",   color:"#059669", border:"rgba(5,150,105,.28)",  top:"70vh", left:"14%",  anim:"fi7 9s ease-in-out infinite 1.5s" },
  { t:"p", k:"filtered2",   top:"84vh", left:"13%",  anim:"fi3 8s ease-in-out infinite" },
  // Inner-left (beside hero text)
  { t:"i", icon:"mail",     color:"#f59e0b", border:"rgba(245,158,11,.28)",  top:"10vh", left:"40%",  anim:"fi6 9s ease-in-out infinite 1s" },
  { t:"i", icon:"bell",     color:"#8b5cf6", border:"rgba(139,92,246,.28)",  top:"44vh", left:"41%",  anim:"fi1 9s ease-in-out infinite 3s" },
  { t:"i", icon:"check",    color:"#7c3aed", border:"rgba(124,58,237,.28)",   top:"78vh", left:"40%",  anim:"fi5 8s ease-in-out infinite 2s" },
  // Inner-right (beside triage card)
  { t:"i", icon:"person",   color:"#059669", border:"rgba(5,150,105,.28)",  top:"7vh",  left:"53%",  anim:"fi4 10s ease-in-out infinite 1s" },
  { t:"p", k:"check2",      top:"30vh", left:"52%",  anim:"fi8 9s ease-in-out infinite .5s" },
  { t:"i", icon:"calendar", color:"#7c3aed", border:"rgba(124,58,237,.28)",   top:"62vh", left:"53%",  anim:"fi2 8s ease-in-out infinite 2.5s" },
  { t:"i", icon:"mail",     color:"#8b5cf6", border:"rgba(139,92,246,.28)",  top:"82vh", left:"52%",  anim:"fi7 7s ease-in-out infinite 3s" },
  // Mid-right — fills top+bottom right gaps
  { t:"i", icon:"check",    color:"#f59e0b", border:"rgba(245,158,11,.28)",  top:"5vh",  right:"14%", anim:"fi3 8s ease-in-out infinite .8s" },
  { t:"p", k:"urgent2",     top:"20vh", right:"13%", anim:"fi5 9s ease-in-out infinite 1.5s" },
  { t:"i", icon:"bell",     color:"#059669", border:"rgba(5,150,105,.28)",  top:"72vh", right:"15%", anim:"fi6 8s ease-in-out infinite" },
  { t:"p", k:"wake2",       top:"85vh", right:"14%", anim:"fi1 10s ease-in-out infinite 2s" },
  // Far right
  { t:"p", k:"filtered1",   top:"10vh", right:"1%",  anim:"fi7 8s ease-in-out infinite .5s" },
  { t:"i", icon:"mail",     color:"#059669", border:"rgba(5,150,105,.28)",  top:"35vh", right:"2%",  anim:"fi4 9s ease-in-out infinite 1s" },
  { t:"i", icon:"person",   color:"#8b5cf6", border:"rgba(139,92,246,.28)",  top:"58vh", right:"1.5%",anim:"fi2 7s ease-in-out infinite 3s" },
  { t:"p", k:"filtered2",   top:"80vh", right:"1%",  anim:"fi8 9s ease-in-out infinite 1.5s" },
];

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LoginScreen() {
  return (
    <div style={{width:"100vw",minHeight:"100vh",overflowY:"auto",fontFamily:"'Inter',system-ui,sans-serif",
      background:"linear-gradient(160deg,#e4f2f8 0%,#eef9ff 35%,#eff3ff 70%,#eafaf5 100%)"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes fade-up    {from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer    {from{background-position:-300% center}to{background-position:300% center}}
        @keyframes btn-shine  {0%{left:-80%;opacity:0}20%{opacity:.35}100%{left:130%;opacity:0}}
        @keyframes float-card {0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
        @keyframes arrow-jump {0%,100%{transform:translateY(0)}40%{transform:translateY(8px)}60%{transform:translateY(8px)}}
        @keyframes fi1{0%,100%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(8px,-14px) rotate(4deg)}66%{transform:translate(-6px,8px) rotate(-3deg)}}
        @keyframes fi2{0%,100%{transform:translate(0,0) rotate(0deg)}40%{transform:translate(-10px,-10px) rotate(-5deg)}80%{transform:translate(6px,12px) rotate(3deg)}}
        @keyframes fi3{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(12px,-8px) rotate(6deg)}}
        @keyframes fi4{0%,100%{transform:translate(0,0) rotate(0deg)}45%{transform:translate(-8px,10px) rotate(-4deg)}90%{transform:translate(10px,-6px) rotate(3deg)}}
        @keyframes fi5{0%,100%{transform:translate(0,0) rotate(0deg)}35%{transform:translate(5px,13px) rotate(-6deg)}70%{transform:translate(-11px,-6px) rotate(4deg)}}
        @keyframes fi6{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(-7px,-13px) rotate(5deg)}}
        @keyframes fi7{0%,100%{transform:translate(0,0) rotate(0deg)}40%{transform:translate(10px,8px) rotate(-3deg)}80%{transform:translate(-8px,-10px) rotate(5deg)}}
        @keyframes fi8{0%,100%{transform:translate(0,0) rotate(0deg)}60%{transform:translate(-9px,11px) rotate(-4deg)}}
        .cta-primary:hover   {filter:brightness(1.1);}
        .cta-secondary:hover {border-color:rgba(5,150,105,.4)!important;background:rgba(255,255,255,.98)!important;}
        ::-webkit-scrollbar  {width:0;}
      `}</style>

      {/* FLOATING ICONS */}
      {FLOAT_ITEMS.map((item, i) => {
        const pos = {position:"fixed",zIndex:0,pointerEvents:"none",top:item.top,
          ...(item.left  ? {left:item.left}  : {}),
          ...(item.right ? {right:item.right} : {}),
          animation:item.anim};
        if (item.t === "p") {
          const p = PILLS[item.k];
          return (
            <div key={i} style={{...pos,opacity:p.bold?.88:.62}}>
              <div style={{padding:"7px 11px",borderRadius:"11px",background:p.bg,border:`1px solid ${p.border}`,
                boxShadow:"0 3px 14px rgba(0,0,0,.07)",display:"flex",alignItems:"center",gap:"6px",whiteSpace:"nowrap"}}>
                <div style={{width:"7px",height:"7px",borderRadius:"50%",background:p.dot,flexShrink:0}}/>
                <span style={{fontSize:"11px",fontWeight:p.bold?600:400,color:p.bold?"#374151":"#94a3b8"}}>{p.text}</span>
              </div>
            </div>
          );
        }
        return (
          <div key={i} style={pos}>
            <div style={{width:"44px",height:"44px",borderRadius:"13px",background:"rgba(255,255,255,.9)",
              border:`1px solid ${item.border}`,boxShadow:"0 4px 16px rgba(0,0,0,.08)",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              {mkSvg(item.color)[item.icon]}
            </div>
          </div>
        );
      })}

      <div style={{position:"relative",zIndex:3}}>

        {/* NAVBAR */}
        <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"18px 56px",borderBottom:"1px solid rgba(203,213,225,.3)",
          background:"rgba(255,255,255,.7)",backdropFilter:"blur(16px)",
          position:"sticky",top:0,zIndex:20}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <img src="/logo.jpg" alt="WMW" style={{width:"34px",height:"34px",borderRadius:"10px",objectFit:"cover",boxShadow:"0 3px 12px rgba(0,0,0,.12)"}}/>
            <span style={{fontSize:"15px",fontWeight:700,color:"#0f172a",letterSpacing:"-.02em"}}>Wake Me When</span>
          </div>
          <div style={{display:"flex",gap:"10px"}}>
            <a href="/login" className="cta-secondary" style={{fontSize:"13px",fontWeight:600,color:"#374151",textDecoration:"none",padding:"8px 18px",borderRadius:"9px",border:"1.5px solid rgba(203,213,225,.9)",background:"rgba(255,255,255,.85)",transition:"all .2s"}}>Log in</a>
            <a href="/signup" className="cta-primary" style={{position:"relative",overflow:"hidden",fontSize:"13px",fontWeight:600,color:"#fff",textDecoration:"none",padding:"8px 18px",borderRadius:"9px",background:"linear-gradient(135deg,#0d9488,#0891b2)",boxShadow:"0 4px 16px rgba(13,148,136,.3)",transition:"filter .2s"}}>
              Get started free
            </a>
          </div>
        </nav>

        {/* HERO */}
        <section style={{display:"flex",minHeight:"calc(100vh - 65px)",alignItems:"stretch"}}>
          {/* Left — centered */}
          <div style={{width:"50%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"60px 48px",textAlign:"center",position:"relative",zIndex:5}}>
            <div style={{animation:"fade-up .5s ease both",marginBottom:"18px"}}>
              <img src="/logo.jpg" alt="WMW" style={{width:"60px",height:"60px",borderRadius:"18px",objectFit:"cover",boxShadow:"0 6px 28px rgba(0,0,0,.14)"}}/>
            </div>
            <h1 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"clamp(42px,4.8vw,62px)",fontWeight:400,lineHeight:1.04,letterSpacing:"-.03em",color:"#0f172a",marginBottom:"14px",animation:"fade-up .5s ease .06s both"}}>
              Wake Me{" "}
              <em style={{fontStyle:"italic",background:"linear-gradient(135deg,#059669,#7c3aed,#059669)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmer 6s linear infinite"}}>When</em>
            </h1>
            <p style={{fontSize:"17px",fontWeight:500,color:"#374151",marginBottom:"10px",animation:"fade-up .5s ease .1s both"}}>Not every meeting deserves to wake you.</p>
            <p style={{fontSize:"14px",color:"#94a3b8",lineHeight:1.8,maxWidth:"340px",marginBottom:"32px",animation:"fade-up .5s ease .14s both"}}>
              Your calendar has too many meetings. Most don't need you. Wake Me When runs quietly in the background and only interrupts you when you're truly needed.
            </p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center",animation:"fade-up .5s ease .18s both"}}>
              <a href="/signup" className="cta-primary" style={{position:"relative",overflow:"hidden",display:"inline-flex",alignItems:"center",padding:"13px 30px",borderRadius:"12px",color:"#fff",fontSize:"14px",fontWeight:600,textDecoration:"none",background:"linear-gradient(135deg,#0d9488,#0891b2)",boxShadow:"0 6px 24px rgba(13,148,136,.35)",transition:"filter .2s"}}>
                Get started free
              </a>
              <a href="/login" className="cta-secondary" style={{display:"inline-flex",alignItems:"center",padding:"13px 26px",borderRadius:"12px",color:"#374151",fontSize:"14px",fontWeight:500,textDecoration:"none",background:"rgba(255,255,255,.88)",border:"1.5px solid rgba(203,213,225,.8)",transition:"all .2s"}}>Log in</a>
            </div>
            <div style={{marginTop:"44px",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",animation:"fade-up .5s ease .28s both"}}>
              <span style={{fontSize:"10px",color:"#94a3b8",letterSpacing:".1em",fontWeight:600,textTransform:"uppercase"}}>Scroll to explore</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{animation:"arrow-jump 1.4s ease-in-out infinite"}}>
                <circle cx="12" cy="12" r="10" stroke="rgba(148,163,184,.4)" strokeWidth="1.2"/>
                <path d="M12 8v8M12 16l-3-3M12 16l3-3" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {/* Right — triage card */}
          <div style={{width:"50%",display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 48px",borderLeft:"1px solid rgba(203,213,225,.4)",position:"relative",zIndex:5}}>
            <div style={{width:"100%",maxWidth:"480px",borderRadius:"22px",overflow:"hidden",boxShadow:"0 16px 60px rgba(0,0,0,.1), 0 3px 14px rgba(0,0,0,.05)",border:"1px solid rgba(203,213,225,.55)",background:"#fff",animation:"float-card 7s ease-in-out infinite"}}>
              <TriageAnimation/>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{padding:"80px 56px",background:"#ffffff",position:"relative",zIndex:10}}>
          <div style={{textAlign:"center",marginBottom:"48px"}}>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"36px",fontWeight:400,color:"#0f172a",margin:"0 0 12px"}}>Everything you need, nothing you don't</h2>
            <p style={{fontSize:"14px",color:"#64748b",maxWidth:"460px",margin:"0 auto",lineHeight:1.75}}>Wake Me When works silently in the background — set the rules once, and it handles the rest.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",maxWidth:"1100px",margin:"0 auto"}}>
            {[
              {icon:"📅",bg:"rgba(240,253,250,.9)",border:"rgba(5,150,105,.2)",title:"Calendar sync",   desc:"Connects to Google Calendar and monitors every event in real time, 24/7."},
              {icon:"🤖",bg:"rgba(245,243,255,.9)",border:"rgba(139,92,246,.2)",title:"AI triage",       desc:"Scans meeting title, attendees and context to decide if you're truly needed."},
              {icon:"🔔",bg:"rgba(240,249,255,.9)",border:"rgba(124,58,237,.2)", title:"Smart alerts",    desc:"Only notifies you when a meeting matches your rules — all noise suppressed."},
              {icon:"⚙️",bg:"rgba(255,251,235,.9)",border:"rgba(245,158,11,.2)",title:"Custom rules",    desc:"Set keywords, work hours, attendee filters and urgency thresholds your way."},
            ].map(({icon,bg,border,title,desc})=>(
              <div key={title} style={{padding:"24px 20px",borderRadius:"18px",background:bg,border:`1px solid ${border}`,boxShadow:"0 2px 14px rgba(0,0,0,.05)",textAlign:"center",transition:"all .25s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 10px 32px rgba(0,0,0,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 14px rgba(0,0,0,.05)";}}>
                <div style={{fontSize:"30px",marginBottom:"12px"}}>{icon}</div>
                <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"8px"}}>{title}</div>
                <div style={{fontSize:"12px",color:"#64748b",lineHeight:1.7}}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{padding:"80px 56px",background:"#f8faff",position:"relative",zIndex:10}}>
          <div style={{textAlign:"center",marginBottom:"52px"}}>
            <span style={{fontSize:"10px",fontWeight:700,color:"#8b5cf6",letterSpacing:".12em",textTransform:"uppercase"}}>HOW IT WORKS</span>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"36px",fontWeight:400,color:"#0f172a",margin:"10px 0"}}>Up and running in minutes</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0",maxWidth:"860px",margin:"0 auto",position:"relative"}}>
            <div style={{position:"absolute",top:"27px",left:"calc(16.66% + 12px)",right:"calc(16.66% + 12px)",height:"2px",background:"linear-gradient(to right,rgba(5,150,105,.3),rgba(124,58,237,.3))",zIndex:0}}/>
            {[
              {n:"1",color:"#059669",bg:"rgba(240,253,250,.9)",border:"rgba(5,150,105,.3)",title:"Sign up & connect",      desc:"Create your account and grant read-only access to your Google Calendar."},
              {n:"2",color:"#8b5cf6",bg:"rgba(245,243,255,.9)",border:"rgba(139,92,246,.3)",title:"Set your preferences",   desc:"Define working hours, keywords and who counts as a required attendee."},
              {n:"3",color:"#7c3aed",bg:"rgba(240,249,255,.9)",border:"rgba(124,58,237,.3)", title:"Go about your day",      desc:"We watch the calendar. You only get woken when it genuinely matters."},
            ].map(({n,color,bg,border,title,desc})=>(
              <div key={n} style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"0 32px",position:"relative",zIndex:1}}>
                <div style={{width:"56px",height:"56px",borderRadius:"50%",background:bg,border:`2px solid ${border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:700,color,marginBottom:"22px",boxShadow:`0 4px 18px ${color}20`}}>{n}</div>
                <div style={{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"8px"}}>{title}</div>
                <div style={{fontSize:"12.5px",color:"#64748b",lineHeight:1.8}}>{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section style={{padding:"80px 56px",background:"#ffffff",position:"relative",zIndex:10}}>
          <div style={{textAlign:"center",marginBottom:"52px"}}>
            <span style={{fontSize:"10px",fontWeight:700,color:"#7c3aed",letterSpacing:".12em",textTransform:"uppercase"}}>WHO IT'S FOR</span>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"36px",fontWeight:400,color:"#0f172a",margin:"10px 0 12px"}}>Built for people who can't afford to miss what matters</h2>
            <p style={{fontSize:"14px",color:"#64748b",maxWidth:"440px",margin:"0 auto",lineHeight:1.8}}>Whether you're deep in focus, on a call, or just offline — Wake Me When always has your back.</p>
          </div>
          <div style={{maxWidth:"980px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"18px"}}>
            {[
              {emoji:"💻",title:"Developers & Deep Workers",  desc:"You're in a flow state. The last thing you need is a calendar ping for a standup that doesn't need you. Wake Me When filters it — silently, in the background.", bg:"rgba(240,253,250,.7)",border:"rgba(5,150,105,.2)"},
              {emoji:"📊",title:"Managers & Team Leads",      desc:"You're pulled in ten directions. Define once which meetings truly need you, and let everything else run without breaking your focus.",                             bg:"rgba(245,243,255,.7)",border:"rgba(139,92,246,.2)"},
              {emoji:"🚀",title:"Founders & Executives",      desc:"Your time is your most expensive resource. Stop losing it to meetings you could've skipped. Only get woken when your decision is genuinely on the line.",           bg:"rgba(240,249,255,.7)",border:"rgba(124,58,237,.2)"},
              {emoji:"🎨",title:"Creatives & Freelancers",    desc:"Deep work is your product. One unnecessary interruption breaks hours of momentum. Let Wake Me When protect your most valuable uninterrupted hours.",                  bg:"rgba(255,251,235,.7)",border:"rgba(245,158,11,.2)"},
            ].map(({emoji,title,desc,bg,border})=>(
              <div key={title} style={{padding:"30px 28px",borderRadius:"20px",background:bg,border:`1px solid ${border}`,boxShadow:"0 2px 16px rgba(0,0,0,.04)",display:"flex",gap:"20px",alignItems:"flex-start",transition:"all .25s",cursor:"default"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(0,0,0,.09)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 16px rgba(0,0,0,.04)";}}>
                <div style={{fontSize:"34px",lineHeight:1,flexShrink:0,marginTop:"2px"}}>{emoji}</div>
                <div>
                  <div style={{fontSize:"15px",fontWeight:700,color:"#0f172a",marginBottom:"10px"}}>{title}</div>
                  <div style={{fontSize:"13px",color:"#64748b",lineHeight:1.85}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section style={{padding:"80px 56px",textAlign:"center",background:"#f8faff",position:"relative",zIndex:10}}>
          <div style={{maxWidth:"500px",margin:"0 auto",background:"linear-gradient(135deg,rgba(5,150,105,.09),rgba(139,92,246,.07))",border:"1px solid rgba(5,150,105,.18)",borderRadius:"24px",padding:"48px 40px"}}>
            <div style={{fontSize:"36px",marginBottom:"14px"}}>🚀</div>
            <h2 style={{fontFamily:"'DM Serif Display',Georgia,serif",fontSize:"30px",fontWeight:400,color:"#0f172a",marginBottom:"12px"}}>Ready to take back your day?</h2>
            <p style={{fontSize:"14px",color:"#64748b",lineHeight:1.8,marginBottom:"28px"}}>Let AI decide what truly deserves your attention. Free to get started.</p>
            <a href="/signup" className="cta-primary" style={{display:"inline-flex",alignItems:"center",padding:"14px 38px",borderRadius:"13px",color:"#fff",fontSize:"15px",fontWeight:600,textDecoration:"none",background:"linear-gradient(135deg,#0d9488,#0891b2)",boxShadow:"0 8px 28px rgba(13,148,136,.32)",transition:"filter .2s"}}>Create free account →</a>
            <p style={{fontSize:"11px",color:"#cbd5e1",marginTop:"14px"}}>No credit card required</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{padding:"20px 56px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"#f0f4f8",position:"relative",zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <img src="/logo.jpg" alt="WMW" style={{width:"24px",height:"24px",borderRadius:"6px",objectFit:"cover"}}/>
            <span style={{fontSize:"12px",color:"#94a3b8"}}>Wake Me When</span>
          </div>
          <span style={{fontSize:"11px",color:"#cbd5e1"}}>Your time, your rules.</span>
        </footer>

      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Home() {
  const { user, authed, allEvents, setAllEvents, important, afterHours, loading, error, setError,
          calendarNotLinked, fetchAll, markDone, declineEvent } = useAppData();
  const [search,     setSearch]     = useState("");
  const [view,       setView]       = useState("all");
  const [settings,   setSettings]   = useState({ workStart:9, workEnd:17, alertRange:3 });

  useEffect(() => {
    if (authed === true) {
      API.get("/api/user-settings").then(r => {
        if (r.data) setSettings({
          workStart:  r.data.workStart  ?? 9,
          workEnd:    r.data.workEnd    ?? 17,
          alertRange: r.data.alertRange ?? 3,
        });
      }).catch(() => {});
    }
  }, [authed]);
  const [refreshing, setRefreshing] = useState(false);

  const stats = {
    total:      allEvents.length,
    important:  important.length,
    afterHours: afterHours.length,
    filtered:   Math.max(0, allEvents.length - important.length),
  };

  const refresh = async () => { setRefreshing(true); await fetchAll().catch(()=>{}); setRefreshing(false); };

  const displayed = useMemo(() => {
    let src = allEvents;
    if (search) { const q=search.toLowerCase(); src=src.filter(e=>(e.summary||"").toLowerCase().includes(q)); }
    return src;
  }, [search,allEvents]);

  const hour  = new Date().getHours();
  const greet = hour<12 ? "Good morning" : hour<17 ? "Good afternoon" : "Good evening";

  if (authed===false) return <LoginScreen/>;
  if (authed===null)  return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--off)"}}><RefreshCw size={20} style={{animation:"spin 1s linear infinite",color:"#059669"}}/></div>;

  return (
    <Layout user={user} impCount={important.length} afterHoursCount={afterHours.length} alerts={important} onDone={markDone} onDecline={declineEvent}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"28px",flexWrap:"wrap",gap:"12px"}}>
        <div>
          <div style={{fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",color:"var(--ink-4)",textTransform:"uppercase",marginBottom:"6px"}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</div>
          <h2 style={{fontFamily:"var(--serif)",fontSize:"30px",fontWeight:400,color:"var(--ink)",letterSpacing:"-0.01em"}}>{greet}{user?.name?`, ${user.name.split(" ")[0]}`:""}.  </h2>
          <p style={{fontSize:"13px",color:"var(--ink-3)",marginTop:"5px"}}>{important.length>0?`You have ${important.length} meeting${important.length>1?"s":""} that need${important.length===1?"s":""} your attention.`:"Your calendar looks clear — no urgent meetings flagged."}</p>
        </div>
        <button onClick={refresh} disabled={refreshing} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 16px",background:"var(--white)",border:"1px solid var(--border)",borderRadius:"9px",color:"var(--ink-2)",fontSize:"13px",fontWeight:500,cursor:refreshing?"not-allowed":"pointer",opacity:refreshing?0.6:1,boxShadow:"var(--shadow-sm)",transition:"all 0.15s"}}
          onMouseEnter={e=>!refreshing&&(e.currentTarget.style.borderColor="var(--border-dark)")}
          onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--border)")}>
          <RefreshCw size={13} style={{animation:refreshing?"spin 1s linear infinite":"none"}}/>{refreshing?"Syncing…":"Refresh"}
        </button>
      </div>
      <SummaryCards stats={stats}/>
      <TimelineStrip events={allEvents} workStart={settings.workStart} workEnd={settings.workEnd} alertRange={settings.alertRange} />
      <OverlapBanner
        onSkip={(id) => {
          setAllEvents(p => p.filter(e => e.id !== id && e._id !== id));
        }}
        onAccept={(id) => {
          setAllEvents(p => p.map(e => {
            if (e.id !== id) return e;
            // patch the attendees array so RSVP chip shows Accepted
            const _attendees = (e.attendees || []).map(a =>
              a.email?.toLowerCase() === (user?.email || "").toLowerCase()
                ? { ...a, responseStatus: "accepted" }
                : a
            );
            return { ...e, attendees: _attendees };
          }));
        }}
      />
      {calendarNotLinked&&(
        <div style={{display:"flex",alignItems:"center",gap:"12px",padding:"14px 18px",margin:"0 0 16px",background:"rgba(240,253,250,.95)",border:"1px solid rgba(5,150,105,.25)",borderRadius:"12px"}}>
          <span style={{fontSize:"20px"}}>📅</span>
          <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:600,color:"#0f766e"}}>Calendar not connected</div><div style={{fontSize:"12px",color:"#64748b",marginTop:"2px"}}>Connect your Google Calendar to start filtering meetings.</div></div>
          <a href="/connect-calendar" style={{padding:"8px 16px",borderRadius:"9px",textDecoration:"none",fontSize:"12px",fontWeight:600,color:"#fff",background:"linear-gradient(135deg,#0d9488,#0891b2)",boxShadow:"0 3px 12px rgba(13,148,136,.3)"}}>Connect Calendar</a>
        </div>
      )}
      {error&&(
        <div style={{display:"flex",alignItems:"center",gap:"9px",padding:"11px 14px",background:"var(--purple-light)",border:"1px solid rgba(124,58,237,0.18)",borderRadius:"9px",color:"var(--purple)",fontSize:"13px",marginBottom:"18px"}}>
          <AlertTriangle size={14}/>{error}
          <button onClick={()=>setError("")} style={{marginLeft:"auto",background:"none",border:"none",color:"var(--purple)",cursor:"pointer"}}><X size={13}/></button>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:"16px"}}>
        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
          <Search size={13} style={{position:"absolute",left:"10px",color:"var(--ink-4)",pointerEvents:"none"}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events…"
            style={{padding:"7px 30px 7px 30px",background:"var(--white)",border:"1px solid var(--border)",borderRadius:"8px",color:"var(--ink)",fontSize:"13px",outline:"none",boxShadow:"var(--shadow-sm)",width:"200px"}}
            onFocus={e=>{e.target.style.borderColor="#059669";e.target.style.boxShadow="0 0 0 3px rgba(5,150,105,.1)";}}
            onBlur={e=>{e.target.style.borderColor="var(--border)";e.target.style.boxShadow="var(--shadow-sm)";}}/>
          {search&&<button onClick={()=>setSearch("")} style={{position:"absolute",right:"8px",background:"none",border:"none",cursor:"pointer",color:"var(--ink-4)",display:"flex"}}><X size={12}/></button>}
        </div>
      </div>
      <div style={{background:"var(--white)",border:"1px solid var(--border)",borderRadius:"var(--radius-lg)",overflow:"hidden",boxShadow:"var(--shadow-sm)"}}>
        <div style={{padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--off)"}}>
          <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
            <span style={{fontFamily:"var(--serif)",fontSize:"15px",color:"var(--ink)"}}>"All events"</span>
            <span style={{fontSize:"11px",fontWeight:700,padding:"2px 8px",background:"#dcfce7",color:"#059669",borderRadius:"5px"}}>{displayed.length}</span>
          </div>
          <span style={{fontSize:"11px",color:"var(--ink-4)"}}>Today + tomorrow</span>
        </div>
        <div style={{padding:"14px"}}>
          {loading?(
            <div style={{textAlign:"center",padding:"52px 0"}}>
              <RefreshCw size={20} style={{display:"block",margin:"0 auto 12px",animation:"spin 1s linear infinite",color:"#059669"}}/>
              <div style={{fontFamily:"var(--serif)",fontSize:"14px",color:"var(--ink-3)"}}>Scanning your calendar…</div>
            </div>
          ):displayed.length===0?(
            <EmptyState icon="📅" title={search?"No matches":"Nothing here"} subtitle={search?"Try a different search":"Enjoy the free time ☕"}/>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {displayed.map((e,i)=><EventRow key={e._id||e.id} event={e} idx={i} showActions={view==="important"} onDone={markDone} onDecline={declineEvent} userEmail={user?.email}/>)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
