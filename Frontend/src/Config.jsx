import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Zap, Save, CheckCircle, AlertCircle, Clock, Users, Bell, Mail, Tag, Plus, X } from "lucide-react";
import Layout from "./components/Layout";
import { useAppData } from "./lib/useAppData";
import API from "./lib/api";

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, accent = "var(--teal)" }) => (
  <button onClick={() => onChange(!checked)} style={{
    width: "44px", height: "24px", borderRadius: "12px", border: "none",
    cursor: "pointer", position: "relative", flexShrink: 0,
    background: checked ? accent : "var(--surface)",
    outline: `1.5px solid ${checked ? "rgba(13,148,136,0.3)" : "var(--border-dark)"}`,
    transition: "all 0.2s",
  }}>
    <span style={{
      position: "absolute", top: "3px", left: checked ? "23px" : "3px",
      width: "18px", height: "18px", borderRadius: "50%",
      background: "#fff", transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
    }} />
  </button>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, accent = "var(--teal)", accentBg = "var(--teal-light)", children }) => (
  <div style={{ marginBottom: "28px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "12px" }}>
      <div style={{
        width: "28px", height: "28px", borderRadius: "7px",
        background: accentBg, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={14} color={accent} />
      </div>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>{title}</span>
    </div>
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)",
      borderRadius: "14px", overflow: "hidden", boxShadow: "var(--shadow-sm)",
    }}>
      {children}
    </div>
  </div>
);

// ─── Row inside section ───────────────────────────────────────────────────────
const Row = ({ label, description, right, noBorder }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px", borderBottom: noBorder ? "none" : "1px solid var(--border)", gap: "16px",
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{label}</div>
      {description && <div style={{ fontSize: "11px", color: "var(--ink-3)", marginTop: "2px", lineHeight: 1.4 }}>{description}</div>}
    </div>
    {right}
  </div>
);

// ─── Interval checkbox ────────────────────────────────────────────────────────
const IntervalCheck = ({ value, label, checked, onChange }) => (
  <label style={{
    display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
    padding: "10px 14px", borderRadius: "9px",
    background: checked ? "var(--teal-light)" : "var(--surface)",
    border: `1px solid ${checked ? "rgba(13,148,136,0.2)" : "var(--border)"}`,
    transition: "all 0.15s",
  }}>
    <input type="checkbox" checked={checked} onChange={() => onChange(value)}
      style={{ accentColor: "var(--teal)", width: "14px", height: "14px", cursor: "pointer" }}
    />
    <span style={{ fontSize: "13px", fontWeight: checked ? 600 : 400, color: checked ? "var(--teal)" : "var(--ink-2)" }}>
      {label}
    </span>
  </label>
);

// ─── Keyword tag ──────────────────────────────────────────────────────────────
const KeywordTag = ({ keyword, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 10px", background: "var(--amber-light)",
    border: "1px solid rgba(180,83,9,0.2)", borderRadius: "6px",
    fontSize: "12px", fontWeight: 600, color: "var(--amber)",
  }}>
    {keyword}
    <button onClick={() => onRemove(keyword)} style={{
      background: "none", border: "none", cursor: "pointer", color: "var(--amber)",
      padding: "0", display: "flex", alignItems: "center",
      opacity: 0.6, transition: "opacity 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
      onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
    ><X size={11} /></button>
  </span>
);

// ─── Config page ──────────────────────────────────────────────────────────────
const Config = () => {
  const { user, important, afterHours } = useAppData();
  const nav = useNavigate();

  // Form state
  const [workStart,       setWorkStart]       = useState(9);
  const [workEnd,         setWorkEnd]         = useState(17);
  const [alertRange,      setAlertRange]      = useState(3);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [onlyIfInToList,  setOnlyIfInToList]  = useState(false);
  const [keywords,        setKeywords]        = useState(["urgent","attention","important","high importance","critical"]);
  const [newKeyword,      setNewKeyword]      = useState("");
  const [emailEnabled,    setEmailEnabled]    = useState(false);
  const [emailAddress,    setEmailAddress]    = useState("");
  const [alertIntervals,  setAlertIntervals]  = useState([60, 30, 15]);
  const [saving,          setSaving]          = useState(false);
  const [status,          setStatus]          = useState(null);

  useEffect(() => {
    API.get("/api/user-settings")
      .then(r => {
        const d = r.data;
        setWorkStart(d.workStart ?? 9);
        setWorkEnd(d.workEnd ?? 17);
        setAlertRange(d.alertRange ?? 3);
        setIncludeWeekends(d.includeWeekends ?? false);
        setOnlyIfInToList(d.onlyIfInToList ?? false);
        setKeywords(d.keywords?.length ? d.keywords : ["urgent","attention","important","high importance","critical"]);
        setEmailEnabled(d.emailEnabled ?? false);
        setEmailAddress(d.emailAddress ?? "");
        setAlertIntervals(d.alertIntervals?.length ? d.alertIntervals : [60, 30, 15]);
      }).catch(() => {});
  }, []);

  const addKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords(p => [...p, kw]);
      setNewKeyword("");
    }
  };

  const removeKeyword = kw => setKeywords(p => p.filter(k => k !== kw));

  const toggleInterval = val => {
    setAlertIntervals(p => p.includes(val) ? p.filter(v => v !== val) : [...p, val].sort((a,b) => b-a));
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const ampm = i < 12 ? "AM" : "PM";
    const h    = i === 0 ? 12 : i > 12 ? i - 12 : i;
    return { value: i, label: `${h}:00 ${ampm}` };
  });

  const save = async () => {
    setSaving(true); setStatus(null);
    try {
      // 1. Persist settings to DB
      await API.post("/api/user-settings", {
        workStart, workEnd, alertRange, includeWeekends, onlyIfInToList,
        keywords, emailEnabled, emailAddress, alertIntervals,
      });

      // 2. Immediately re-classify all events with the new settings
      //    so changes are visible the moment the user lands back on the dashboard
      await API.post("/api/resync");

      setStatus("ok");
      setTimeout(() => nav("/home"), 900);
    } catch { setStatus("err"); setSaving(false); }
  };

  const InputStyle = {
    padding: "8px 12px", background: "var(--off)",
    border: "1px solid var(--border)", borderRadius: "8px",
    color: "var(--ink)", fontSize: "13px", fontFamily: "var(--sans)",
    outline: "none", transition: "border-color 0.15s",
  };

  const SelectStyle = { ...InputStyle, cursor: "pointer", appearance: "none" };

  return (
    <Layout user={user} impCount={important?.length || 0} afterHoursCount={afterHours?.length || 0} alerts={important || []} onDone={() => {}} onDecline={() => {}}>
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: "var(--white)", border: "1px solid var(--border)",
            borderRadius: "7px", padding: "6px 12px", color: "var(--ink-2)",
            fontSize: "12px", fontWeight: 500, cursor: "pointer", boxShadow: "var(--shadow-sm)",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-dark)"; e.currentTarget.style.color = "var(--ink)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink-2)"; }}
          >
            <ArrowLeft size={12} /> Back
          </button>
        </Link>
        <span style={{ color: "var(--ink-4)", fontSize: "13px" }}>·</span>
        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink-2)" }}>Preferences</span>
      </div>

      {/* Heading */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{
          display: "inline-block", fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: "12px", color: "var(--teal)", marginBottom: "10px",
          padding: "4px 12px", background: "var(--teal-light)",
          border: "1px solid rgba(13,148,136,0.2)", borderRadius: "100px",
        }}>AI Configuration</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "32px", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Your preferences
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.7, maxWidth: "520px" }}>
          Configure how the AI monitors your calendar. Changes take effect on the next calendar sync.
        </p>
      </div>

      <div style={{ maxWidth: "620px" }}>

        {/* ── Working hours ── */}
        <Section title="Working Hours" icon={Clock} accent="var(--teal)" accentBg="var(--teal-light)">
          <Row label="Work day start" description="Meetings before this time are flagged as after-hours"
            right={
              <select value={workStart} onChange={e => setWorkStart(Number(e.target.value))} style={SelectStyle}>
                {hourOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            }
          />
          <Row label="Work day end" description="Meetings after this time are flagged as after-hours"
            right={
              <select value={workEnd} onChange={e => setWorkEnd(Number(e.target.value))} style={SelectStyle}>
                {hourOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            }
          />
          <Row label="Include weekends" description="Flag important events that fall on Saturday or Sunday"
            right={<Toggle checked={includeWeekends} onChange={setIncludeWeekends} />}
            noBorder
          />
        </Section>

        {/* ── Attendee filter ── */}
        <Section title="Meeting Filters" icon={Users} accent="var(--purple)" accentBg="var(--purple-light)">
          {/* Info pill — always-on rules */}
          <div style={{ padding: "14px 20px 0" }}>
            <div style={{
              padding: "11px 14px", background: "var(--teal-light)",
              border: "1px solid rgba(13,148,136,0.2)", borderRadius: "8px",
              fontSize: "12px", color: "var(--teal)", lineHeight: 1.6, marginBottom: "2px",
            }}>
              ✅ <strong>Always flagged as Important:</strong> meetings whose title/description matches your keywords, and any meeting where you appear in the <strong>To field</strong>. These are non-configurable by design.
            </div>
          </div>
          <Row label="Also include meetings I organised"
            description="When ON, meetings you created (but aren't explicitly To'd in) also appear in Important"
            right={<Toggle checked={onlyIfInToList} onChange={setOnlyIfInToList} accent="var(--purple)" />}
            noBorder
          />
        </Section>

        {/* ── Keywords ── */}
        <Section title="AI Keywords" icon={Tag} accent="var(--amber)" accentBg="var(--amber-light)">
          <Row label="Critical keywords" description="Meetings whose title or description contains any of these are flagged as important"
            right={null}
          />
          <div style={{ padding: "4px 20px 16px" }}>
            {/* Tag list */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
              {keywords.map(kw => <KeywordTag key={kw} keyword={kw} onRemove={removeKeyword} />)}
            </div>
            {/* Add keyword */}
            <div style={{ display: "flex", gap: "8px" }}>
              <input value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addKeyword()}
                placeholder="Add keyword and press Enter…"
                style={{ ...InputStyle, flex: 1 }}
                onFocus={e => e.target.style.borderColor = "var(--amber)"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={addKeyword} style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "8px 14px", background: "var(--amber-light)",
                border: "1px solid rgba(180,83,9,0.2)", borderRadius: "8px",
                color: "var(--amber)", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              }}>
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        </Section>

        {/* ── Alert timeline ── */}
        <Section title="Alert Timeline" icon={Bell} accent="var(--teal)" accentBg="var(--teal-light)">
          <Row label="Alert me before meetings" description="Choose when to receive reminders before important after-hours meetings" right={null} />
          <div style={{ padding: "4px 20px 16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <IntervalCheck value={60} label="1 hour before"    checked={alertIntervals.includes(60)} onChange={toggleInterval} />
            <IntervalCheck value={30} label="30 mins before"   checked={alertIntervals.includes(30)} onChange={toggleInterval} />
            <IntervalCheck value={15} label="15 mins before"   checked={alertIntervals.includes(15)} onChange={toggleInterval} />
          </div>

          {/* Alert window slider */}
          <Row label="Alert window" description={`Alert for events up to ${alertRange}h before 9am and after ${workEnd % 12 || 12}${workEnd < 12 ? "am" : "pm"}`} right={
            <span style={{
              fontSize: "14px", fontWeight: 700, color: "var(--teal)",
              background: "var(--teal-light)", padding: "3px 10px", borderRadius: "6px",
              fontFamily: "var(--serif)",
            }}>{alertRange}h</span>
          } noBorder />
          <div style={{ padding: "4px 20px 16px" }}>
            <input type="range" min={1} max={8} step={1} value={alertRange}
              onChange={e => setAlertRange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--teal)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <span key={n} style={{ fontSize: "10px", fontWeight: n === alertRange ? 700 : 400, color: n === alertRange ? "var(--teal)" : "var(--ink-4)" }}>{n}h</span>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Email notifications ── */}
        <Section title="Email Notifications" icon={Mail} accent="#059669" accentBg="#d1fae5">
          <Row label="Enable email alerts"
            description="Receive email notifications for important meetings (requires Gmail app password)"
            right={<Toggle checked={emailEnabled} onChange={setEmailEnabled} accent="#059669" />}
          />
          {emailEnabled && (
            <Row label="Send alerts to" description="Enter the email address to receive notifications" noBorder
              right={
                <input value={emailAddress} onChange={e => setEmailAddress(e.target.value)}
                  placeholder="you@example.com" type="email"
                  style={{ ...InputStyle, width: "220px" }}
                  onFocus={e => e.target.style.borderColor = "#059669"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              }
            />
          )}
          {!emailEnabled && (
            <div style={{ padding: "0 20px 14px" }}>
              <div style={{
                padding: "10px 14px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: "8px",
                fontSize: "12px", color: "var(--ink-3)", lineHeight: 1.6,
              }}>
                📧 Enable email alerts to receive notifications at 1 hour, 30 minutes, and 15 minutes before important after-hours meetings. Requires <strong>EMAIL_USER</strong> and <strong>EMAIL_PASS</strong> in your server <code>.env</code> file.
              </div>
            </div>
          )}
        </Section>

        {/* ── Save button ── */}
        <button onClick={save} disabled={saving || status === "ok"} style={{
          width: "100%", padding: "13px",
          background: status === "ok" ? "#d1fae5" : status === "err" ? "var(--red-light)" : "var(--ink)",
          border: status === "ok" ? "1px solid rgba(5,150,105,0.25)" : status === "err" ? "1px solid rgba(220,38,38,0.25)" : "none",
          borderRadius: "11px",
          color: status === "ok" ? "#059669" : status === "err" ? "var(--red)" : "#fff",
          fontFamily: "var(--sans)", fontSize: "14px", fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          opacity: saving ? 0.75 : 1, transition: "all 0.2s", boxShadow: status ? "none" : "var(--shadow-md)",
        }}
          onMouseEnter={e => { if (!saving && !status) { e.currentTarget.style.background = "#2d2b28"; }}}
          onMouseLeave={e => { if (!saving && !status) { e.currentTarget.style.background = "var(--ink)"; }}}
        >
          {status === "ok" ? <><CheckCircle size={15} /> Saved &amp; applied! Redirecting…</>
            : status === "err" ? <><AlertCircle size={15} /> Something went wrong — try again</>
            : saving ? "Saving &amp; applying changes…"
            : <><Save size={15} /> Save preferences</>}
        </button>
        <p style={{ textAlign: "center", fontSize: "11px", color: "var(--ink-4)", marginTop: "10px" }}>
          Changes take effect on the next calendar sync (every 7 minutes)
        </p>
      </div>
    </Layout>
  );
};


export default Config;
