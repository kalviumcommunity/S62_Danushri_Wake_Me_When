import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Zap, Save, CheckCircle, AlertCircle, Clock, Users, Bell, BellRing, Mail, Tag, Plus, X } from "lucide-react";
import Layout from "./components/Layout";
import { useAppData } from "./lib/useAppData";
import { usePushNotifications } from "./lib/usePushNotifications";
import API from "./lib/api";

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, accent = "#059669" }) => (
  <button onClick={() => onChange(!checked)} style={{
    width: "44px", height: "24px", borderRadius: "12px", border: "none",
    cursor: "pointer", position: "relative", flexShrink: 0,
    background: checked ? accent : "var(--surface)",
    outline: `1.5px solid ${checked ? "rgba(5,150,105,0.3)" : "var(--border-dark)"}`,
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
const Section = ({ title, icon: Icon, accent = "#059669", accentBg = "#dcfce7", children }) => (
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
    background: checked ? "#dcfce7" : "var(--surface)",
    border: `1px solid ${checked ? "rgba(5,150,105,0.2)" : "var(--border)"}`,
    transition: "all 0.15s",
  }}>
    <input type="checkbox" checked={checked} onChange={() => onChange(value)}
      style={{ accentColor: "#059669", width: "14px", height: "14px", cursor: "pointer" }}
    />
    <span style={{ fontSize: "13px", fontWeight: checked ? 600 : 400, color: checked ? "#059669" : "var(--ink-2)" }}>
      {label}
    </span>
  </label>
);

// ─── Keyword tag ──────────────────────────────────────────────────────────────
const KeywordTag = ({ keyword, onRemove }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: "5px",
    padding: "4px 10px", background: "#dcfce7",
    border: "1px solid rgba(5,150,105,0.2)", borderRadius: "6px",
    fontSize: "12px", fontWeight: 600, color: "#059669",
  }}>
    {keyword}
    <button onClick={() => onRemove(keyword)} style={{
      background: "none", border: "none", cursor: "pointer", color: "#059669",
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
  const [workStart,       setWorkStart]       = useState(8);
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
  const [testEmailStatus, setTestEmailStatus] = useState(null); // null | "sending" | "ok" | "err"
  const [testEmailMsg,    setTestEmailMsg]    = useState("");
  const push = usePushNotifications();

  useEffect(() => {
    API.get("/api/user-settings")
      .then(r => {
        const d = r.data;
        setWorkStart(d.workStart ?? 8);
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
      <div style={{ maxWidth: "620px", paddingLeft: "6px" }}>
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
      <div style={{ maxWidth: "620px", marginBottom: "32px", paddingLeft: "6px" }}>
        <div style={{
          display: "inline-block", fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: "12px", color: "var(--purple)", marginBottom: "10px",
          padding: "4px 12px", background: "var(--purple-light)",
          border: "1px solid rgba(124,58,237,0.2)", borderRadius: "100px",
        }}>AI Configuration</div>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "32px", fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
          Your preferences
        </h1>
        <p style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.7, maxWidth: "520px" }}>
          Configure how the AI monitors your calendar. Changes take effect on the next calendar sync.
        </p>
      </div>

      <div style={{ maxWidth: "620px", paddingLeft: "6px" }}>

        {/* ── Working hours ── */}
        <Section title="Working Hours" icon={Clock} accent="#059669" accentBg="#dcfce7">
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
              padding: "11px 14px", background: "#dcfce7",
              border: "1px solid rgba(5,150,105,0.2)", borderRadius: "8px",
              fontSize: "12px", color: "#059669", lineHeight: 1.6, marginBottom: "2px",
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
        <Section title="AI Keywords" icon={Tag} accent="#059669" accentBg="#dcfce7">
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
                onFocus={e => e.target.style.borderColor = "#059669"}
                onBlur={e => e.target.style.borderColor = "var(--border)"}
              />
              <button onClick={addKeyword} style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "8px 14px", background: "#dcfce7",
                border: "1px solid rgba(5,150,105,0.2)", borderRadius: "8px",
                color: "#059669", fontSize: "12px", fontWeight: 700, cursor: "pointer",
              }}>
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        </Section>



        {/* ── Email notifications ── */}
        {/* ── Alert window ── */}
        <Section title="Alert Window" icon={Bell} accent="var(--purple)" accentBg="var(--purple-light)">
          <Row label="Alert window" description={`Alert for events up to ${alertRange}h before and after working hours`} right={
            <span style={{
              fontSize: "14px", fontWeight: 700, color: "#059669",
              background: "var(--purple-light)", padding: "3px 10px", borderRadius: "6px",
              fontFamily: "var(--serif)",
            }}>{alertRange}h</span>
          } noBorder />
          <div style={{ padding: "4px 20px 16px" }}>
            <input type="range" min={1} max={8} step={1} value={alertRange}
              onChange={e => setAlertRange(Number(e.target.value))}
              style={{ width: "100%", accentColor: "var(--purple)", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              {[1,2,3,4,5,6,7,8].map(n => (
                <span key={n} style={{ fontSize: "10px", fontWeight: n === alertRange ? 700 : 400, color: n === alertRange ? "var(--purple)" : "var(--ink-4)" }}>{n}h</span>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Email Notifications" icon={Mail} accent="#059669" accentBg="#d1fae5">
          <Row label="Enable email alerts"
            description="Receive email notifications for important meetings (requires Gmail app password on server)"
            right={<Toggle checked={emailEnabled} onChange={setEmailEnabled} accent="#059669" />}
          />
          {emailEnabled && (
            <>
              <Row label="Send alerts to" description="Enter the email address to receive notifications"
                right={
                  <input value={emailAddress} onChange={e => setEmailAddress(e.target.value)}
                    placeholder="you@example.com" type="email"
                    style={{ ...InputStyle, width: "220px" }}
                    onFocus={e => e.target.style.borderColor = "#059669"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"}
                  />
                }
              />

              {/* Test email button */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={async () => {
                    setTestEmailStatus("sending");
                    setTestEmailMsg("");
                    try {
                      const r = await API.post("/api/test-email");
                      setTestEmailStatus("ok");
                      setTestEmailMsg(`Test email sent to ${r.data.sentTo}`);
                    } catch (e) {
                      setTestEmailStatus("err");
                      setTestEmailMsg(e.response?.data?.error || "Failed to send. Check EMAIL_USER and EMAIL_PASS on your server.");
                    }
                    setTimeout(() => setTestEmailStatus(null), 6000);
                  }}
                  disabled={testEmailStatus === "sending"}
                  style={{
                    padding: "7px 16px", borderRadius: "8px", border: "1px solid rgba(5,150,105,0.3)",
                    background: testEmailStatus === "ok" ? "#d1fae5" : testEmailStatus === "err" ? "var(--purple-light)" : "#f0fdf4",
                    color: testEmailStatus === "err" ? "var(--purple)" : "#059669",
                    fontSize: "12px", fontWeight: 600, cursor: testEmailStatus === "sending" ? "not-allowed" : "pointer",
                    opacity: testEmailStatus === "sending" ? 0.6 : 1, transition: "all .15s",
                    fontFamily: "var(--sans)",
                  }}>
                  {testEmailStatus === "sending" ? "Sending…" : testEmailStatus === "ok" ? "✓ Sent!" : testEmailStatus === "err" ? "✗ Failed" : "Send test email"}
                </button>
                {testEmailMsg && (
                  <span style={{ fontSize: "11px", color: testEmailStatus === "err" ? "var(--purple)" : "#059669" }}>
                    {testEmailMsg}
                  </span>
                )}
              </div>
            </>
          )}
          {!emailEnabled && (
            <div style={{ padding: "0 20px 14px" }}>
              <div style={{
                padding: "10px 14px", background: "var(--surface)",
                border: "1px solid var(--border)", borderRadius: "8px",
                fontSize: "12px", color: "var(--ink-3)", lineHeight: 1.6,
              }}>
                📧 Enable email alerts to get notified at 1 hour, 30 min, and 15 min before important meetings.
                Requires <strong>EMAIL_USER</strong> and <strong>EMAIL_PASS</strong> (Gmail app password) in your server <code>.env</code> file.
              </div>
            </div>
          )}
        </Section>

        {/* ── Alarm notifications ── */}
        <Section title="Alarm Notifications" icon={BellRing} accent="#7c3aed" accentBg="#ede9fe">
          <Row
            label="Wake-up alarm"
            description={
              !push.supported ? "Not supported in this browser (use Chrome on desktop or Android)" :
              push.subscribed ? "Alarm is active — you'll be woken 1 hour before important meetings" :
              "Get an alarm notification 1 hour before important meetings, even when the tab is closed"
            }
            right={
              !push.supported ? (
                <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>Not supported</span>
              ) : (
                <Toggle
                  checked={push.subscribed}
                  onChange={() => push.subscribed ? push.disable() : push.enable()}
                  accent="#7c3aed"
                />
              )
            }
          />
          {push.error && (
            <div style={{ padding:"0 20px 12px" }}>
              <div style={{ padding:"8px 12px", background:"var(--purple-light)",
                border:"1px solid rgba(124,58,237,.2)", borderRadius:"7px",
                fontSize:"11px", color:"var(--purple)" }}>
                {push.error}
              </div>
            </div>
          )}
          {push.subscribed && (
            <div style={{ padding:"12px 20px 16px", borderTop:"1px solid var(--border)", display:"flex", alignItems:"center", gap:"10px" }}>
              <button onClick={push.test} disabled={push.loading}
                style={{ padding:"7px 16px", borderRadius:"8px",
                  border:"1px solid rgba(124,58,237,.3)", background:"rgba(237,233,254,.7)",
                  color:"#7c3aed", fontSize:"12px", fontWeight:600,
                  cursor: push.loading ? "not-allowed" : "pointer",
                  opacity: push.loading ? 0.6 : 1, fontFamily:"var(--sans)" }}>
                {push.loading ? "Sending…" : "Send test alarm"}
              </button>
              <span style={{ fontSize:"11px", color:"var(--ink-3)" }}>
                Make sure your device volume is on
              </span>
            </div>
          )}
          {!push.subscribed && push.supported && (
            <div style={{ padding:"0 20px 14px" }}>
              <div style={{ padding:"10px 14px", background:"var(--surface)",
                border:"1px solid var(--border)", borderRadius:"8px",
                fontSize:"12px", color:"var(--ink-3)", lineHeight:1.6 }}>
                🔔 Enable to receive alarm-style push notifications 1 hour before every important meeting.
                Works in the background — no tab needed.
              </div>
            </div>
          )}
        </Section>

        {/* ── Save button ── */}
        <button onClick={save} disabled={saving || status === "ok"} style={{
          width: "100%", padding: "13px",
          background: status === "ok" ? "#d1fae5" : status === "err" ? "var(--purple-light)" : "var(--ink)",
          border: status === "ok" ? "1px solid rgba(5,150,105,0.25)" : status === "err" ? "1px solid rgba(124,58,237,0.25)" : "none",
          borderRadius: "11px",
          color: status === "ok" ? "#059669" : status === "err" ? "var(--purple)" : "#fff",
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
      </div>
    </Layout>
  );
};


export default Config;
