import React, { useState, useMemo, useEffect } from "react";
import { RefreshCw, Search, X, AlertTriangle } from "lucide-react";
import Layout from "./components/Layout";
import SummaryCards from "./components/SummaryCards";
import { EventRow, EmptyState } from "./components/EventRow";
import TimelineStrip from "./components/TimelineStrip";
import OverlapBanner from "./components/OverlapBanner";
import API from "./lib/api";
import { useAppData } from "./lib/useAppData";

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
