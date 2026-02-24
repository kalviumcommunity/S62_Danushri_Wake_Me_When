import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import API from "../lib/api";

const rules = [
  { id:"len",   label:"At least 8 characters",    test: p => p.length >= 8 },
  { id:"upper", label:"One uppercase letter",      test: p => /[A-Z]/.test(p) },
  { id:"num",   label:"One number",               test: p => /[0-9]/.test(p) },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name:"", email:"", password:"", confirm:"" });
  const [show, setShow]     = useState({ pwd:false, conf:false });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(""); };
  const pwdOk = rules.every(r => r.test(form.password));
  const matchOk = form.password && form.password === form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwdOk)    return setError("Password doesn't meet requirements.");
    if (!matchOk)  return setError("Passwords do not match.");
    setLoading(true); setError("");
    try {
      await API.post("/api/auth/register", {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      navigate("/connect-calendar");
    } catch (err) {
      setError(err.response?.data?.error || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // step 2 redirect handled via useEffect below

  return (
    <div style={{
      minHeight:"100vh", display:"flex",
      background:"linear-gradient(140deg,#eef9ff 0%,#f8faff 35%,#f3f0ff 70%,#edfaf8 100%)",
      fontFamily:"Inter,system-ui,sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;}
        @keyframes fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,-35px)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,30px)} }
        input:focus { outline:none; border-color:rgba(13,148,136,.5) !important; box-shadow:0 0 0 3px rgba(13,148,136,.1) !important; }
      `}</style>

      <div style={{ position:"fixed", top:"-15%", right:"-10%", width:"420px", height:"420px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(13,148,136,.11) 0%,transparent 65%)",
        filter:"blur(50px)", pointerEvents:"none", animation:"blob1 14s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"-10%", left:"-5%", width:"360px", height:"360px",
        borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 65%)",
        filter:"blur(45px)", pointerEvents:"none", animation:"blob2 18s ease-in-out infinite 2s" }} />
      <div style={{ position:"fixed", inset:0,
        backgroundImage:"radial-gradient(circle,rgba(148,163,184,.18) 1px,transparent 1px)",
        backgroundSize:"28px 28px", pointerEvents:"none" }} />

      <div style={{ margin:"auto", width:"100%", maxWidth:"440px", padding:"24px 16px",
        animation:"fade-up .5s ease both", position:"relative" }}>

        {/* Header */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:"22px" }}>
          <img src="/logo.jpg" alt="WMW" style={{ width:"52px", height:"52px", borderRadius:"14px",
            objectFit:"cover", boxShadow:"0 4px 20px rgba(0,0,0,.12)", marginBottom:"14px" }} />
          <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:"28px", fontWeight:400,
            color:"#0f172a", margin:0, textAlign:"center" }}>
            Create your account
          </h1>
          <p style={{ fontSize:"13px", color:"#94a3b8", marginTop:"6px", textAlign:"center" }}>
            Start protecting your time today
          </p>
        </div>

        <div style={{ background:"rgba(255,255,255,.88)", backdropFilter:"blur(20px)",
          borderRadius:"20px", padding:"28px 28px 24px",
          border:"1px solid rgba(203,213,225,.6)",
          boxShadow:"0 8px 40px rgba(0,0,0,.07)" }}>

          {/* Google signup */}
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
            Sign up with Google
          </a>

          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"20px" }}>
            <div style={{ flex:1, height:"1px", background:"rgba(203,213,225,.7)" }} />
            <span style={{ fontSize:"11px", color:"#cbd5e1", fontWeight:500 }}>or sign up with email</span>
            <div style={{ flex:1, height:"1px", background:"rgba(203,213,225,.7)" }} />
          </div>

          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:"8px", padding:"10px 12px",
              background:"rgba(254,242,242,.9)", border:"1px solid rgba(252,165,165,.6)",
              borderRadius:"10px", marginBottom:"14px" }}>
              <AlertCircle size={14} color="#ef4444" style={{ flexShrink:0 }} />
              <span style={{ fontSize:"12px", color:"#dc2626" }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:"12px" }}>

            {/* Name */}
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>Full name</label>
              <input type="text" required placeholder="Jane Smith"
                value={form.name} onChange={e => set("name", e.target.value)}
                style={{ width:"100%", padding:"10px 13px", borderRadius:"10px",
                  border:"1.5px solid rgba(203,213,225,.8)", fontSize:"13px", color:"#0f172a",
                  background:"rgba(255,255,255,.9)", fontFamily:"Inter,system-ui,sans-serif", transition:"all .2s" }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>Email address</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => set("email", e.target.value)}
                style={{ width:"100%", padding:"10px 13px", borderRadius:"10px",
                  border:"1.5px solid rgba(203,213,225,.8)", fontSize:"13px", color:"#0f172a",
                  background:"rgba(255,255,255,.9)", fontFamily:"Inter,system-ui,sans-serif", transition:"all .2s" }}
              />
              <p style={{ fontSize:"11px", color:"#94a3b8", marginTop:"4px" }}>
                You'll connect your calendar in the next step
              </p>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>Password</label>
              <div style={{ position:"relative" }}>
                <input type={show.pwd ? "text" : "password"} required placeholder="Create a strong password"
                  value={form.password} onChange={e => set("password", e.target.value)}
                  style={{ width:"100%", padding:"10px 40px 10px 13px", borderRadius:"10px",
                    border:"1.5px solid rgba(203,213,225,.8)", fontSize:"13px", color:"#0f172a",
                    background:"rgba(255,255,255,.9)", fontFamily:"Inter,system-ui,sans-serif", transition:"all .2s" }}
                />
                <button type="button" onClick={() => setShow(s => ({...s, pwd:!s.pwd}))}
                  style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex" }}>
                  {show.pwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {/* Password rules */}
              {form.password && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"8px" }}>
                  {rules.map(r => (
                    <div key={r.id} style={{ display:"flex", alignItems:"center", gap:"4px",
                      fontSize:"10px", color: r.test(form.password) ? "#0d9488" : "#94a3b8",
                      transition:"color .2s" }}>
                      <CheckCircle size={10} style={{ opacity: r.test(form.password) ? 1 : 0.3 }}/>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px" }}>Confirm password</label>
              <div style={{ position:"relative" }}>
                <input type={show.conf ? "text" : "password"} required placeholder="Repeat your password"
                  value={form.confirm} onChange={e => set("confirm", e.target.value)}
                  style={{ width:"100%", padding:"10px 40px 10px 13px", borderRadius:"10px",
                    border:`1.5px solid ${form.confirm ? (matchOk ? "rgba(13,148,136,.4)" : "rgba(239,68,68,.4)") : "rgba(203,213,225,.8)"}`,
                    fontSize:"13px", color:"#0f172a",
                    background:"rgba(255,255,255,.9)", fontFamily:"Inter,system-ui,sans-serif", transition:"all .2s" }}
                />
                <button type="button" onClick={() => setShow(s => ({...s, conf:!s.conf}))}
                  style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex" }}>
                  {show.conf ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {form.confirm && !matchOk && (
                <p style={{ fontSize:"11px", color:"#ef4444", marginTop:"4px" }}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"11px", borderRadius:"11px", border:"none",
              fontSize:"14px", fontWeight:600, color:"#fff", cursor:"pointer",
              background: loading ? "rgba(13,148,136,.6)" : "linear-gradient(135deg,#0d9488,#0891b2)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(13,148,136,.28)",
              transition:"all .2s", marginTop:"4px",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
            }}>
              {loading ? "Creating account…" : <><UserPlus size={15}/> Create Account</>}
            </button>
          </form>
        </div>

        <p style={{ textAlign:"center", fontSize:"12px", color:"#94a3b8", marginTop:"18px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color:"#0d9488", fontWeight:600, textDecoration:"none" }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

