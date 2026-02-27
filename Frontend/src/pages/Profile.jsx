import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Save, CheckCircle, AlertCircle, Trash2, RefreshCw, Settings, ChevronRight, User, Mail, Shield, Calendar, Star, Moon, Camera } from "lucide-react";
import Layout from "../components/Layout";
import { PageHeader } from "../components/EventRow";
import { useAppData } from "../lib/useAppData";
import API from "../lib/api";

// ─── Stat tile ────────────────────────────────────────────────────────────────
const Stat = ({ icon: Icon, accent, bg, label, value }) => (
  <div style={{
    flex: 1, background: "var(--white)", border: "1px solid var(--border)",
    borderRadius: "12px", padding: "16px", boxShadow: "var(--shadow-sm)",
  }}>
    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
      <Icon size={15} color={accent} />
    </div>
    <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--serif)", lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "4px", fontWeight: 500 }}>{label}</div>
  </div>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, accent = "#059669", last }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "12px", padding: "13px 20px",
    borderBottom: last ? "none" : "1px solid var(--border)",
  }}>
    <div style={{ width: "30px", height: "30px", borderRadius: "8px", flexShrink: 0,
      background: `color-mix(in srgb, ${accent} 10%, transparent)`,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon size={13} color={accent} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "11px", color: "var(--ink-4)", fontWeight: 600,
        textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "13px", color: "var(--ink)", fontWeight: 500, marginTop: "1px" }}>{value}</div>
    </div>
  </div>
);

export default function Profile() {
  const { user, setUser, authed, important, afterHours, allEvents, markDone, declineEvent } = useAppData();
  const nav = useNavigate();

  const [name,       setName]       = useState("");
  const [saving,     setSaving]     = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [authMethod, setAuthMethod] = useState("email");
  const [joinedDate, setJoinedDate] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [totalMtgs,  setTotalMtgs]  = useState(0);
  const [totalImp,   setTotalImp]   = useState(0);

  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef(null);

  if (authed === false) { nav("/login"); return null; }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    // Compress to max 200x200 JPEG at 0.7 quality — keeps payload tiny
    const compressImage = (f) => new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(f);
      img.onload = () => {
        const size = 200;
        const canvas = document.createElement("canvas");
        const ratio = Math.min(size / img.width, size / img.height);
        canvas.width  = img.width  * ratio;
        canvas.height = img.height * ratio;
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = url;
    });
    try {
      const dataUrl = await compressImage(file);
      await API.put("/api/profile/photo", { photo: dataUrl });
      setUser(prev => ({ ...prev, avatar: dataUrl }));
    } catch { alert("Failed to upload photo"); }
    setPhotoUploading(false);
  };

  useEffect(() => {
    if (!user) return;
    setName(user.displayName || user.name || "");
  }, [user]);

  useEffect(() => {
    if (authed !== true) return;
    API.get("/api/user").then(r => {
      setAuthMethod(r.data?.user?.authMethod || "email");
      if (r.data?.user?.createdAt) {
        setJoinedDate(new Date(r.data.user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }));
      }
    }).catch(() => {});
    API.get("/api/profile/stats").then(r => {
      setTotalMtgs(r.data?.totalEvents ?? allEvents.length);
      setTotalImp(r.data?.totalImportant ?? important.length);
    }).catch(() => {
      setTotalMtgs(allEvents.length);
      setTotalImp(important.length);
    });
  }, [authed]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true); setSaveStatus(null);
    try {
      await API.put("/api/profile", { name: name.trim() });
      // Update user state in-place — greeting + sidebar update instantly, no reload
      setUser(prev => ({ ...prev, name: name.trim(), displayName: name.trim() }));
      setSaveStatus("ok");
    } catch (err) {
      setSaveStatus("err");
    }
    setSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleLogout = () => API.get("/api/logout").finally(() => window.location.href = "/");
  const handleDelete = async () => {
    setDeleting(true);
    try { await API.delete("/api/profile"); window.location.href = "/"; }
    catch { setDeleting(false); setShowDelete(false); }
  };

  const displayName = user?.displayName || user?.name || "User";
  const email       = user?.email || "";
  const avatar      = user?.avatar || null;
  const initials    = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <Layout user={user} impCount={important.length} afterHoursCount={afterHours.length}
      alerts={important} onDone={markDone} onDecline={declineEvent}>

      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        .ni:focus { outline:none; border-color:#059669!important; box-shadow:0 0 0 3px rgba(5,150,105,.12)!important; }
        .del-row:hover { background: var(--surface) !important; }
        .settings-row:hover { background: var(--surface) !important; }
      `}</style>

      {/* Page header — matches ImportantPage / AfterHoursPage */}
      <PageHeader
        title="My Profile"
        subtitle={joinedDate ? `Member since ${joinedDate}` : "Manage your account and preferences"}
        right={
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px",
            background: "var(--white)", border: "1px solid var(--border)", borderRadius: "9px",
            color: "var(--ink-2)", fontSize: "13px", fontWeight: 500,
            cursor: "pointer", boxShadow: "var(--shadow-sm)",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--purple)"; e.currentTarget.style.borderColor = "rgba(124,58,237,.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--ink-2)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
            <LogOut size={13} /> Sign out
          </button>
        }
      />

      {/* Avatar + name */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px", padding: "20px 24px",
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: "14px", boxShadow: "var(--shadow-sm)", marginBottom: "20px",
      }}>
        {/* Clickable avatar */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div onClick={() => fileRef.current?.click()} style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: avatar ? "transparent" : "#a78bfa",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden", fontSize: "18px", fontWeight: 700, color: "#fff",
            boxShadow: "0 0 0 3px rgba(124,58,237,.15)", cursor: "pointer", position: "relative",
          }}>
            {avatar ? <img src={avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : initials}
            {/* Hover overlay */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
              opacity: photoUploading ? 1 : 0, transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => { if (!photoUploading) e.currentTarget.style.opacity = "0"; }}>
              <Camera size={16} color="#fff" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange}
            style={{ display: "none" }} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--serif)", fontSize: "20px", color: "var(--ink)", lineHeight: 1.2 }}>
            {displayName}
          </div>
          <div style={{ fontSize: "13px", color: "var(--ink-3)", marginTop: "3px" }}>{email}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <Stat icon={Calendar} accent="#059669"       bg="#dcfce7"              label="Meetings tracked"  value={totalMtgs} />
        <Stat icon={Star}     accent="#059669"       bg="#dcfce7"              label="Flagged important" value={totalImp}  />
        <Stat icon={Moon}     accent="var(--purple)" bg="var(--purple-light)" label="After-hours"       value={afterHours.length} />
      </div>

      {/* Account details */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: "14px", boxShadow: "var(--shadow-sm)", marginBottom: "16px", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Account
          </span>
        </div>
        <InfoRow icon={User}   label="Name"     value={name || displayName} />
        <InfoRow icon={Mail}   label="Email"    value={email}        accent="var(--purple)" />
        <InfoRow icon={Shield} label="Sign-in"  value={authMethod === "google" ? "Google OAuth" : "Email & Password"} accent="var(--purple)" last />
      </div>

      {/* Edit name */}
      <div style={{
        background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: "14px", boxShadow: "var(--shadow-sm)", marginBottom: "16px", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Edit profile
          </span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: "12px", color: "var(--ink-3)", marginBottom: "10px" }}>Display name</div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input className="ni" value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSave()}
              placeholder="Your name"
              style={{ flex: 1, padding: "9px 12px", borderRadius: "9px",
                border: "1px solid var(--border)", background: "var(--off)",
                fontSize: "13px", color: "var(--ink)", fontFamily: "var(--sans)", transition: "all .15s" }} />
            <button onClick={handleSave} disabled={saving || !name.trim()} style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px",
              borderRadius: "9px", background: "#059669",
              border: "none", color: "#fff", fontSize: "13px", fontWeight: 600,
              cursor: saving || !name.trim() ? "not-allowed" : "pointer",
              opacity: saving || !name.trim() ? 0.6 : 1,
              fontFamily: "var(--sans)", boxShadow: "none", whiteSpace: "nowrap",
            }}>
              {saving ? <RefreshCw size={13} style={{ animation: "spin 1s linear infinite" }}/> : <Save size={13}/>}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
          {saveStatus && (
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px",
              fontSize: "12px", color: saveStatus === "ok" ? "#059669" : "#7c3aed", fontWeight: 500 }}>
              {saveStatus === "ok"
                ? <><CheckCircle size={13}/> Name updated successfully</>
                : <><AlertCircle size={13}/> Could not save — please try again</>}
            </div>
          )}
        </div>
      </div>

      {/* Settings shortcut */}
      <div className="settings-row" onClick={() => nav("/config")} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "15px 20px", background: "var(--white)", border: "1px solid var(--border)",
        borderRadius: "14px", boxShadow: "var(--shadow-sm)", marginBottom: "16px",
        cursor: "pointer", transition: "background .15s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px",
            background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Settings size={13} color="var(--purple)" />
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>App settings</div>
            <div style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "1px" }}>Keywords, working hours, email & alarm alerts</div>
          </div>
        </div>
        <ChevronRight size={15} color="var(--ink-4)" />
      </div>

      {/* Danger zone */}
      <div style={{
        background: "var(--white)", border: "1px solid rgba(124,58,237,.2)",
        borderRadius: "14px", boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(124,58,237,.12)" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Danger zone
          </span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {!showDelete ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--ink)" }}>Delete account</div>
                <div style={{ fontSize: "12px", color: "var(--ink-3)", marginTop: "2px" }}>
                  Permanently remove your account and all data
                </div>
              </div>
              <button onClick={() => setShowDelete(true)} style={{
                display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px",
                background: "var(--purple-light)", border: "1px solid rgba(124,58,237,.2)",
                borderRadius: "8px", color: "var(--purple)", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "var(--sans)",
              }}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ) : (
            <div style={{ padding: "14px", background: "var(--purple-light)", borderRadius: "10px", border: "1px solid rgba(124,58,237,.2)" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--purple)", marginBottom: "10px" }}>
                This will permanently erase all your data. Are you sure?
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleDelete} disabled={deleting} style={{
                  padding: "7px 16px", borderRadius: "8px", background: "var(--purple)",
                  border: "none", color: "#fff", fontSize: "12px", fontWeight: 600,
                  cursor: deleting ? "not-allowed" : "pointer", fontFamily: "var(--sans)", opacity: deleting ? 0.7 : 1,
                }}>{deleting ? "Deleting…" : "Yes, delete everything"}</button>
                <button onClick={() => setShowDelete(false)} style={{
                  padding: "7px 14px", borderRadius: "8px", background: "var(--white)",
                  border: "1px solid var(--border)", color: "var(--ink-2)",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--sans)",
                }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

    </Layout>
  );
}
