import React from "react";
import { Link } from "react-router-dom";

const BACKEND = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://s62-danushri-wake-me-when-2-hvmd.onrender.com";

export default function ConnectCalendar() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(140deg,#eef9ff 0%,#f8faff 35%,#f3f0ff 70%,#edfaf8 100%)",
      fontFamily: "Inter,system-ui,sans-serif", padding: "24px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;}
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-30px)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,25px)} }
      `}</style>

      <div style={{ position:"fixed", top:"-15%", left:"-10%", width:"420px", height:"420px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(13,148,136,.11) 0%,transparent 65%)",
        filter:"blur(50px)", pointerEvents:"none", animation:"blob1 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"-10%", right:"-5%", width:"360px", height:"360px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 65%)",
        filter:"blur(45px)", pointerEvents:"none", animation:"blob2 18s ease-in-out infinite 2s" }} />
      <div style={{ position:"fixed", inset:0,
        backgroundImage:"radial-gradient(circle,rgba(148,163,184,.18) 1px,transparent 1px)",
        backgroundSize:"28px 28px", pointerEvents:"none" }} />

      <div style={{ maxWidth:"420px", width:"100%", textAlign:"center",
        animation:"fade-up .5s ease both", position:"relative" }}>

        {/* Icon */}
        <div style={{ width:"72px", height:"72px", borderRadius:"20px",
          background:"linear-gradient(135deg,rgba(13,148,136,.15),rgba(8,145,178,.1))",
          border:"1px solid rgba(13,148,136,.2)", display:"flex", alignItems:"center",
          justifyContent:"center", margin:"0 auto 20px", fontSize:"32px" }}>
          📅
        </div>

        <h2 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:"26px",
          fontWeight:400, color:"#0f172a", marginBottom:"10px" }}>
          Connect your calendar
        </h2>
        <p style={{ fontSize:"14px", color:"#64748b", lineHeight:1.75, marginBottom:"8px" }}>
          To start filtering your meetings, Wake Me When needs read access to your calendar.
        </p>
        <p style={{ fontSize:"13px", color:"#94a3b8", lineHeight:1.7, marginBottom:"28px" }}>
          We only <strong style={{ color:"#64748b" }}>read</strong> your events — we never modify, delete or share them.
        </p>

        {/* Permissions */}
        <div style={{ background:"rgba(255,255,255,.85)", borderRadius:"14px",
          border:"1px solid rgba(203,213,225,.6)", padding:"16px 20px",
          marginBottom:"24px", textAlign:"left" }}>
          {[
            { icon:"👁️", text:"Read your calendar events" },
            { icon:"🔔", text:"Detect when your presence is required" },
            { icon:"📧", text:"Send email alerts before key meetings" },
            { icon:"🚫", text:"Never edit, delete or share your data" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display:"flex", alignItems:"center", gap:"10px",
              padding:"8px 0", borderBottom:"1px solid rgba(203,213,225,.3)" }}>
              <span style={{ fontSize:"16px" }}>{icon}</span>
              <span style={{ fontSize:"13px", color:"#374151" }}>{text}</span>
            </div>
          ))}
        </div>

        <a href={`${BACKEND}/api/auth/link-calendar`} style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
          padding:"13px 28px", borderRadius:"13px", textDecoration:"none", color:"#fff",
          fontSize:"14px", fontWeight:600,
          background:"linear-gradient(135deg,#0d9488,#0891b2)",
          boxShadow:"0 6px 24px rgba(13,148,136,.3)",
          marginBottom:"14px", transition:"filter .2s",
        }}
          onMouseEnter={e => e.currentTarget.style.filter="brightness(1.08)"}
          onMouseLeave={e => e.currentTarget.style.filter="none"}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.2-2.7-.5-4l.3 1z"/>
            <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 16.1 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.3 4.6-17.7 11.7z"/>
            <path fill="#FBBC05" d="M24 44c5.7 0 10.6-1.9 14.2-5.1l-6.6-5.4C29.7 35.4 27 36.3 24 36.3c-5.8 0-10.7-3.9-12.4-9.2l-7 5.4C8 38.7 15.4 44 24 44z"/>
            <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.4c3.9-3.6 6.2-8.9 6.2-15.4 0-1.3-.2-2.7-.5-4l.7.8z"/>
          </svg>
          Connect My Google Calendar
        </a>

        <p style={{ fontSize:"11px", color:"#cbd5e1", marginBottom:"20px" }}>
          You'll be redirected to Google to grant read-only permission
        </p>

        <Link to="/home" style={{ fontSize:"12px", color:"#94a3b8", textDecoration:"none" }}>
          Skip for now →
        </Link>
      </div>
    </div>
  );
}
