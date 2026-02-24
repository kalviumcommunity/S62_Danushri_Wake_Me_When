import { useState, useEffect, useCallback } from "react";
import API from "../lib/api";

export function useAppData() {
  const [user,       setUser]       = useState(null);
  const [authed,     setAuthed]     = useState(null); // null=loading, true=in, false=out
  const [allEvents,  setAllEvents]  = useState([]);
  const [important,  setImportant]  = useState([]);
  const [afterHours, setAfterHours] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [calendarNotLinked, setCalendarNotLinked] = useState(false);

  // ── Check auth once on mount ────────────────────────────────────────────────
  useEffect(() => {
    API.get("/api/user")
      .then(r => {
        // Guard against 304/empty body edge case
        const isAuthed = r.data?.authenticated === true;
        setAuthed(isAuthed);
        if (r.data?.user) setUser(r.data.user);
      })
      .catch(() => setAuthed(false));
  }, []);

  // ── Fetch all calendar data ─────────────────────────────────────────────────
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) { setLoading(true); setError(""); }
    try {
      const [allRes, impRes, ahRes] = await Promise.allSettled([
        API.get("/api/all-events"),
        API.get("/api/important-events"),
        API.get("/api/after-hours-events"),
      ]);

      if (allRes.status === "fulfilled") {
        setAllEvents(allRes.value.data?.allEvents || []);
      } else {
        if (allRes.reason?.response?.status === 403 && allRes.reason?.response?.data?.calendarNotLinked) {
          setCalendarNotLinked(true);
        } else {
          const msg = allRes.reason?.response?.data?.error;
          if (msg) setError(msg);
        }
      }
      if (impRes.status === "fulfilled") setImportant(impRes.value.data || []);
      if (ahRes.status  === "fulfilled") setAfterHours(ahRes.value.data  || []);

    } catch (err) {
      // ignore — specific errors handled per-request above
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Trigger initial load once authed
  useEffect(() => {
    if (authed === true) fetchAll();
  }, [authed, fetchAll]);

  // Background poll every 7 minutes (silent — no spinner)
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => fetchAll(true), 7 * 60 * 1000);
    return () => clearInterval(id);
  }, [authed, fetchAll]);

  // ── Event actions — optimistic UI (remove instantly, API call in background) ──
  const markDone = (id) => {
    // Remove from UI immediately — don't wait for the server
    setImportant(p  => p.filter(e => e._id !== id));
    setAfterHours(p => p.filter(e => e._id !== id));
    setAllEvents(p  => p.filter(e => e.id !== id && e._id !== id));
    // Persist to server in background
    API.put(`/api/${id}`, { status: "Completed" }).catch(() => {
      // If it fails, silently ignore — the event was already shown as gone
      // and will be re-fetched correctly on next poll
    });
  };

  const declineEvent = (id) => {
    // Remove from UI immediately
    setImportant(p  => p.filter(e => e._id !== id));
    setAfterHours(p => p.filter(e => e._id !== id));
    setAllEvents(p  => p.filter(e => e.id !== id && e._id !== id));
    // Persist to server in background
    API.delete(`/api/${id}`).catch(() => {});
  };

  return {
    user, authed, allEvents, important, afterHours,
    loading, error, setError, calendarNotLinked, fetchAll, markDone, declineEvent,
  };
}
