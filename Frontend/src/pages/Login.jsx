import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import API from "../lib/api";

export default function Login() {
  const navigate   = useNavigate();
  const [form, setForm]     = useState({ email: "", password: "" });
  const [show, setShow]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await API.post("/api/auth/login", form);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(140deg,#eef9ff 0%,#f8faff 35%,#f3f0ff 70%,#edfaf8 100%)",
      fontFamily: "Inter,system-ui,sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;}
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { from{background-position:-300% center} to{background-position:300% center} }
        @keyframes blob1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,-30px) scale(1.08)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,25px) scale(1.06)} }
        input:focus { outline: none; border-color: rgba(13,148,136,.5) !important; box-shadow: 0 0 0 3px rgba(13,148,136,.1) !important; }
      `}</style>

      {/* Background blobs */}
      <div style={{ position:"fixed", top:"-15%", left:"-10%", width:"450px", height:"450px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(13,148,136,.12) 0%,transparent 65%)",
        filter:"blur(50px)", pointerEvents:"none", animation:"blob1 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"-10%", right:"-5%", width:"380px", height:"380px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.09) 0%,transparent 65%)",
        filter:"blur(45px)", pointerEvents:"none", animation:"blob2 18s ease-in-out infinite 3s" }} />
      <div style={{ position:"fixed", inset:0,
        backgroundImage:"radial-gradient(circle,rgba(148,163,184,.18) 1px,transparent 1px)",
        backgroundSize:"28px 28px", pointerEvents:"none" }} />

      {/* Card */}
      <div style={{ margin:"auto", width:"100%", maxWidth:"420px", padding:"24px 16px",
        animation:"fade-up .5s ease both", position:"relative" }}>

        {/* Logo */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"24px" }}>
          <img src="/logo.jpg" alt="WMW" style={{ width:"52px", height:"52px", borderRadius:"14px",
            objectFit:"cover", boxShadow:"0 4px 20px rgba(0,0,0,.12)", marginBottom:"14px" }} />
          <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:"28px", fontWeight:400,
            color:"#0f172a", margin:0, textAlign:"center", letterSpacing:"-.02em" }}>
            Welcome back
          </h1>
          <p style={{ fontSize:"13px", color:"#94a3b8", marginTop:"6px", textAlign:"center" }}>
            Log in to your Wake Me When account
          </p>
        </div>

        {/* Glass card */}
        <div style={{ background:"rgba(255,255,255,.88)", backdropFilter:"blur(20px)",
          borderRadius:"20px", padding:"28px 28px 24px",
          border:"1px solid rgba(203,213,225,.6)",
          boxShadow:"0 8px 40px rgba(0,0,0,.07), 0 2px 8px rgba(0,0,0,.04)" }}>

          {/* Google OAuth */}
          <a href="http://localhost:5000/api/auth" style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:"10px",
            padding:"11px 20px", borderRadius:"12px", textDecoration:"none",
            border:"1.5px solid rgba(203,213,225,.9)", background:"#fff",
            color:"#0f172a", fontSize:"13px", fontWeight:600,
            boxShadow:"0 1px 4px rgba(0,0,0,.06)", transition:"all .2s",
            marginBottom:"20px",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(13,148,136,.4)"; e.currentTarget.style.boxShadow="0 3px 12px rgba(0,0,0,.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(203,213,225,.9)"; e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.06)"; }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 29.9 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11 0 19.7-7.7 19.7-20 0-1.3-.2-2.7-.5-4l.3 1z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 16.1 19.3 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3c-7.7 0-14.3 4.6-17.7 11.7z"/>
              <path fill="#FBBC05" d="M24 44c5.7 0 10.6-1.9 14.2-5.1l-6.6-5.4C29.7 35.4 27 36.3 24 36.3c-5.8 0-10.7-3.9-12.4-9.2l-7 5.4C8 38.7 15.4 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.4c3.9-3.6 6.2-8.9 6.2-15.4 0-1.3-.2-2.7-.5-4l.7.8z"/>
            </svg>
            Continue with Google
          </a>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px" }}>
            <div style={{ flex:1, height:"1px", background:"rgba(203,213,225,.7)" }} />
            <span style={{ fontSize:"11px", color:"#cbd5e1", fontWeight:500 }}>or log in with email</span>
            <div style={{ flex:1, height:"1px", background:"rgba(203,213,225,.7)" }} />
          </div>

          {/* Error */}
          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px",
              background:"rgba(254,242,242,.9)", border:"1px solid rgba(252,165,165,.6)",
              borderRadius:"10px", marginBottom:"16px" }}>
              <AlertCircle size={14} color="#ef4444" style={{ flexShrink:0 }} />
              <span style={{ fontSize:"12px", color:"#dc2626" }}>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>
                Email address
              </label>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => set("email", e.target.value)}
                style={{ width:"100%", padding:"10px 13px", borderRadius:"10px",
                  border:"1.5px solid rgba(203,213,225,.8)", fontSize:"13px", color:"#0f172a",
                  background:"rgba(255,255,255,.9)", transition:"all .2s",
                  fontFamily:"Inter,system-ui,sans-serif" }}
              />
            </div>

            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <input
                  type={show ? "text" : "password"} required placeholder="••••••••"
                  value={form.password} onChange={e => set("password", e.target.value)}
                  style={{ width:"100%", padding:"10px 40px 10px 13px", borderRadius:"10px",
                    border:"1.5px solid rgba(203,213,225,.8)", fontSize:"13px", color:"#0f172a",
                    background:"rgba(255,255,255,.9)", transition:"all .2s",
                    fontFamily:"Inter,system-ui,sans-serif" }}
                />
                <button type="button" onClick={() => setShow(s => !s)} style={{
                  position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
                  background:"none", border:"none", cursor:"pointer", color:"#94a3b8", padding:0,
                  display:"flex", alignItems:"center",
                }}>
                  {show ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"4px" }}>
                <span style={{ fontSize:"11px", color:"#0d9488", cursor:"pointer", fontWeight:500 }}>
                  Forgot password?
                </span>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"11px", borderRadius:"11px", border:"none",
              fontSize:"14px", fontWeight:600, color:"#fff", cursor:"pointer",
              background: loading ? "rgba(13,148,136,.6)" : "linear-gradient(135deg,#0d9488,#0891b2)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(13,148,136,.3)",
              transition:"all .2s", marginTop:"4px",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}>
              {loading ? "Logging in…" : <><LogIn size={15}/> Log In</>}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign:"center", fontSize:"12px", color:"#94a3b8", marginTop:"18px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color:"#0d9488", fontWeight:600, textDecoration:"none" }}>
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
