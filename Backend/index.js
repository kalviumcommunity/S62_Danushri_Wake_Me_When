import express        from "express";
import session        from "express-session";
import passport       from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv         from "dotenv";
import axios          from "axios";
import mongoose       from "mongoose";
import cors           from "cors";
import nodemailer     from "nodemailer";
import cron           from "node-cron";
import UserSetting    from "./models/UserSettings.js";
import User           from "./models/User.js";
import bcrypt         from "bcryptjs";
import ImportantEvent from "./models/ImportantEvent.js";
import AlertLog       from "./models/AlertLog.js";

dotenv.config();
const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "dev-secret",
  resave: false, saveUninitialized: true,
  cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
}));
app.use(passport.initialize());
app.use(passport.session());

// Prevent browser from caching ANY /api/* response — avoids 304 with empty body
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

// ── MongoDB ────────────────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(e  => console.error("❌ MongoDB error:", e));

// ── Google OAuth (store refreshToken so we can refresh later) ──────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "http://localhost:5000/api/auth/callback",
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, {
      accessToken,
      refreshToken: refreshToken || null,
      tokenIssuedAt: Date.now(),
      profile: {
        id:          profile.id,
        displayName: profile.displayName,
        emails:      profile.emails,
        photos:      profile.photos,
      },
    });
  }
));
passport.serializeUser((user, done)   => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ── Auth middleware ────────────────────────────────────────────────────────────
const ensureAuth = (req, res, next) => {
  if (req.user || req.session?.emailUser) return next();
  res.status(401).json({ error: "Not authenticated" });
};

// Get user email regardless of auth method
const getUserEmail = (req) => {
  if (req.session?.emailUser) {
    // Always use the signup email as the DB key
    return req.session.emailUser.email?.toLowerCase() || req.session.emailUser.googleEmail;
  }
  return req.user?.profile?.emails?.[0]?.value?.toLowerCase();
};

// Get access token regardless of auth method
async function getAccessTokenForRequest(req) {
  if (req.session?.emailUser) {
    // Load from DB — try by ID first, then by email
    let dbUser = req.session.emailUser.id
      ? await User.findById(req.session.emailUser.id)
      : null;
    if (!dbUser && req.session.emailUser.email) {
      dbUser = await User.findOne({ email: req.session.emailUser.email.toLowerCase() });
    }
    if (!dbUser?.accessToken) throw new Error("CALENDAR_NOT_LINKED");
    // Refresh if needed
    const elapsed = Date.now() - (dbUser.tokenIssuedAt || 0);
    if (elapsed < 3500 * 1000) return dbUser.accessToken;
    // Refresh
    if (!dbUser.refreshToken) throw new Error("CALENDAR_NOT_LINKED");
    const resp = await axios.post("https://oauth2.googleapis.com/token", {
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: dbUser.refreshToken,
      grant_type:    "refresh_token",
    });
    const newToken = resp.data.access_token;
    await User.findByIdAndUpdate(dbUser._id, { accessToken: newToken, tokenIssuedAt: Date.now() });
    return newToken;
  }
  return getValidAccessToken(req);
};

// ── Token refresh helper ───────────────────────────────────────────────────────
// Google access tokens expire after 1 hour. Refresh before calling Calendar API.
async function getValidAccessToken(req) {
  const { accessToken, refreshToken, tokenIssuedAt } = req.user;
  const elapsed = Date.now() - (tokenIssuedAt || 0);
  const ONE_HOUR = 3600 * 1000;

  // Token still fresh
  if (elapsed < ONE_HOUR - 60000) return accessToken;

  // Need to refresh
  if (!refreshToken) {
    throw new Error("Access token expired and no refresh token available. Please sign in again.");
  }

  const resp = await axios.post("https://oauth2.googleapis.com/token", {
    client_id:     process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type:    "refresh_token",
  });

  const newToken = resp.data.access_token;
  // Update session in place
  req.user.accessToken    = newToken;
  req.user.tokenIssuedAt  = Date.now();
  req.session.passport.user = req.user;

  return newToken;
}

// ── Email helper ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

async function sendAlertEmail(toEmail, event, minutesBefore) {
  const timeLabel = minutesBefore === 60 ? "1 hour"
    : minutesBefore === 30 ? "30 minutes" : "15 minutes";

  const startTime = new Date(event.start.dateTime).toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  await transporter.sendMail({
    from:    `"Wake Me When" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: `⚡ Heads up — "${event.summary}" starts in ${timeLabel}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f7f6f4; border-radius: 12px;">
        <div style="background: #1a1916; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700; color: #fff;">⚡ Wake Me When</span>
        </div>
        <h2 style="font-size: 22px; color: #1a1916; margin: 0 0 8px;">Meeting alert — ${timeLabel} away</h2>
        <div style="background: #fff; border: 1px solid #e5e2dd; border-radius: 10px; padding: 20px; margin: 20px 0;">
          <div style="font-size: 18px; font-weight: 600; color: #1a1916; margin-bottom: 8px;">${event.summary || "Untitled meeting"}</div>
          <div style="font-size: 14px; color: #6b6560;">📅 ${startTime}</div>
          ${event.importanceReason ? `<div style="margin-top: 10px; display: inline-block; padding: 3px 10px; background: #fef3c7; color: #b45309; border-radius: 5px; font-size: 12px; font-weight: 600;">${event.importanceReason}</div>` : ""}
        </div>
        <p style="font-size: 13px; color: #9a9187;">This alert was sent because this meeting was flagged as important by Wake Me When.</p>
      </div>
    `,
  });
}

// ── Importance classifier ──────────────────────────────────────────────────────
function classifyImportance(event, userEmail, keywords = []) {
  const summary     = (event.summary     || "").toLowerCase();
  const description = (event.description || "").toLowerCase();
  const attendees   = (event.attendees   || []).map(a => a.email.toLowerCase());
  const userLower   = userEmail.toLowerCase();

  const reasons = [];

  // ① High importance flag from Google/Exchange
  if (event.importance === "high") reasons.push("highImportance");

  // ② Keyword match in title or description — these ALWAYS go to Important
  const allKeywords = [...new Set(["urgent", "attention", "important", "critical", ...keywords])];
  if (allKeywords.some(kw => summary.includes(kw) || description.includes(kw)))
    reasons.push("keyword");

  // ④ Organizer check first — Google puts the organizer in the attendees array too,
  //    so we must identify organizer status before deciding if user is a "real" attendee
  const isOrganizer =
    (event.organizer?.email || "").toLowerCase() === userLower ||
    (event.creator?.email   || "").toLowerCase() === userLower;
  if (isOrganizer) reasons.push("organizer");

  // ③ User is in the To / required attendees list (and is NOT the organizer of this event)
  //    Only non-organizer attendance counts — otherwise every self-created event shows up
  const isAttendee = !isOrganizer && attendees.includes(userLower);
  if (isAttendee) reasons.push("attendee");

  if (reasons.length === 0) return { important: false, reason: "", reasons: [], isAttendee: false };

  // Primary display reason: keyword > attendee > highImportance > organizer
  const primary = reasons.includes("keyword")        ? "keyword"
                : reasons.includes("attendee")       ? "attendee"
                : reasons.includes("highImportance") ? "highImportance"
                : "organizer";

  return { important: true, reason: primary, reasons, isAttendee };
}

function isAfterHours(dateTimeStr, workStart = 9, workEnd = 17) {
  if (!dateTimeStr) return false;
  const h = new Date(dateTimeStr).getHours();
  return h < workStart || h >= workEnd;
}

function isWeekend(dateTimeStr) {
  if (!dateTimeStr) return false;
  const d = new Date(dateTimeStr).getDay();
  return d === 0 || d === 6;
}

// ── Routes ─────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.send("Wake Me When ✅"));

// Auth
app.get("/api/auth", passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
  accessType: "offline",
  prompt: "consent",   // force refresh token every login
}));

app.get("/api/auth/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173" }),
  (req, res) => res.redirect("http://localhost:5173/home")
);

app.get("/api/logout", (req, res) => req.logout(() => res.redirect("http://localhost:5173")));

// ── Email Auth: Register ───────────────────────────────────────────────────────
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Name, email and password are required." });
    if (password.length < 8)
      return res.status(400).json({ error: "Password must be at least 8 characters." });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ error: "An account with this email already exists." });

    const user = await User.create({ name, email, password, authMethod: "email" });

    // Log them in immediately via session
    req.session.emailUser = {
      id:            user._id.toString(),
      name:          user.name,
      email:         user.email,
      calendarLinked: user.calendarLinked,
      authMethod:    "email",
    };

    res.json({ ok: true, calendarLinked: false, name: user.name, email: user.email });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ── Email Auth: Login ──────────────────────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ error: "No account found with this email." });
    if (user.authMethod === "google" && !user.password)
      return res.status(401).json({ error: "This account uses Google Sign-In. Please log in with Google." });

    const match = await user.checkPassword(password);
    if (!match)
      return res.status(401).json({ error: "Incorrect password." });

    // Check if calendar still linked (tokens still present)
    const calendarLinked = !!(user.accessToken && user.calendarLinked);

    req.session.emailUser = {
      id:            user._id.toString(),
      name:          user.name,
      email:         user.email,
      calendarLinked,
      authMethod:    "email",
    };

    res.json({ ok: true, calendarLinked, name: user.name, email: user.email });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// ── Google OAuth callback — link calendar to email account ────────────────────
// Separate route for linking calendar to an existing email account
app.get("/api/auth/link-calendar", (req, res, next) => {
  // Embed the email-user's MongoDB ID in state so we can recover it after OAuth
  const state = req.session?.emailUser?.id
    ? Buffer.from(JSON.stringify({ uid: req.session.emailUser.id })).toString("base64")
    : undefined;

  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    accessType: "offline",
    prompt: "consent",
    ...(state ? { state } : {}),
  })(req, res, next);
});

// Store tokens on linked email account after Google OAuth
app.get("/api/auth/link-calendar/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const googleEmail = req.user.profile.emails[0].value.toLowerCase();

      // Recover email-user ID from state param — passport may have regenerated the session
      let emailUserId = req.session?.emailUser?.id;
      if (!emailUserId && req.query.state) {
        try {
          const decoded = JSON.parse(Buffer.from(req.query.state, "base64").toString());
          emailUserId = decoded.uid;
        } catch (_) {}
      }

      if (emailUserId) {
        // Save Google tokens to the email-auth user's DB record
        await User.findByIdAndUpdate(emailUserId, {
          googleId:       req.user.profile.id,
          accessToken:    req.user.accessToken,
          refreshToken:   req.user.refreshToken,
          tokenIssuedAt:  Date.now(),
          calendarLinked: true,
          photo:          req.user.profile.photos?.[0]?.value || null,
        });
        // Restore the emailUser session so all subsequent API calls work
        const dbUser = await User.findById(emailUserId);
        req.session.emailUser = {
          id:             emailUserId,
          name:           dbUser?.name  || "",
          email:          dbUser?.email || "",
          googleEmail,
          calendarLinked: true,
          authMethod:     "email",
        };
      }

      res.redirect("http://localhost:5173/home");
    } catch (err) {
      console.error("Link calendar error:", err);
      res.redirect("http://localhost:5173/home");
    }
  }
);

// User info
app.get("/api/user", (req, res) => {
  // Email-auth session
  if (req.session?.emailUser) {
    const u = req.session.emailUser;
    return res.json({
      authenticated: true,
      calendarLinked: u.calendarLinked || false,
      user: { id: u.id, displayName: u.name, email: u.email, photo: null, authMethod: "email" },
    });
  }
  if (!req.user) return res.json({ authenticated: false });
  const p = req.user.profile;
  res.json({
    authenticated: true,
    user: {
      name:   p.displayName,
      email:  p.emails?.[0]?.value,
      avatar: p.photos?.[0]?.value,
    },
  });
});

// ── All events ─────────────────────────────────────────────────────────────────
app.get("/api/all-events", ensureAuth, async (req, res) => {
  try {
    const userEmail = getUserEmail(req);
    const settings  = await UserSetting.findOne({ email: userEmail });

    const workStart      = settings?.workStart       ?? 9;
    const workEnd        = settings?.workEnd         ?? 17;
    const includeWeekends= settings?.includeWeekends ?? false;
    const keywords       = settings?.keywords        ?? [];

    // Refresh token if needed
    let token;
    try {
      token = await getAccessTokenForRequest(req);
    } catch (tokenErr) {
      if (tokenErr.message === "CALENDAR_NOT_LINKED") {
        return res.status(403).json({
          error: "Calendar not connected. Please connect your Google Calendar.",
          calendarNotLinked: true,
        });
      }
      return res.status(401).json({
        error: "Session expired. Please sign in again.",
        reauth: true,
      });
    }

    const today  = new Date();
    const timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const timeMax = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString();

    const gcalResp = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${token}` },
        params:  { timeMin, timeMax, singleEvents: true, orderBy: "startTime" },
      }
    );

    const events = gcalResp.data.items || [];

    // Upsert important events (stable _id via eventId)
    const currentIds = events.map(e => e.id).filter(Boolean);
    await ImportantEvent.deleteMany({ email: userEmail, eventId: { $nin: currentIds } });

    for (const event of events) {
      const dt = event.start?.dateTime;
      if (!dt) continue;
      if (!includeWeekends && isWeekend(dt)) continue;

      const { important, reason, reasons, isAttendee } = classifyImportance(event, userEmail, keywords);

      if (important) {
        await ImportantEvent.findOneAndUpdate(
          { email: userEmail, eventId: event.id },
          {
            $set: {
              summary:          event.summary,
              start:            { dateTime: event.start.dateTime },
              end:              { dateTime: event.end?.dateTime || event.start.dateTime },
              email:            userEmail,
              eventId:          event.id,
              youAreAnAttendee: isAttendee,          // true if user is in To field
              isAfterHours:     isAfterHours(dt, workStart, workEnd),
              importanceReason: reason,              // primary reason
              importanceReasons: reasons,            // ALL reasons (keyword + attendee possible)
            },
            $setOnInsert: { status: "Pending", response: "None" },
          },
          { upsert: true, new: true }
        );
      } else {
        await ImportantEvent.deleteOne({ email: userEmail, eventId: event.id });
      }
    }

    res.json({ allEvents: events });
  } catch (err) {
    console.error("all-events error:", err?.response?.data || err.message);

    // Google auth error — token invalid
    if (err?.response?.status === 401) {
      return res.status(401).json({ error: "Google token expired. Please sign in again.", reauth: true });
    }
    res.status(500).json({ error: "Failed to fetch calendar. Check your Google connection." });
  }
});

// ── Important events ───────────────────────────────────────────────────────────
app.get("/api/important-events", ensureAuth, async (req, res) => {
  try {
    const email    = getUserEmail(req);
    const settings = await UserSetting.findOne({ email });

    const includeWeekends  = settings?.includeWeekends  ?? false;
    const includeOrganized = settings?.onlyIfInToList   ?? false; // "Also include meetings I organised"

    // Build the $or conditions based on what the user has enabled
    const orConditions = [
      { importanceReasons: { $in: ["keyword", "highImportance"] } }, // keyword always included
      { youAreAnAttendee: true },                                    // To-field always included
    ];

    // Only add organizer meetings if the toggle is ON
    if (includeOrganized) {
      orConditions.push({ importanceReasons: { $in: ["organizer"] } });
    }

    const events = await ImportantEvent.find({
      email,
      status: { $nin: ["Completed", "Declined"] },
      $or: orConditions,
    }).sort({ "start.dateTime": 1 });

    const filtered = events.filter(e => {
      if (!includeWeekends && isWeekend(e.start?.dateTime)) return false;
      return true;
    });

    res.json(filtered);
  } catch (err) {
          if (err.message === "CALENDAR_NOT_LINKED") {
        return res.status(403).json({ error: "Calendar not connected.", calendarNotLinked: true });
      }
      console.error("important-events error:", err.message);
    res.status(500).json({ error: "Failed to fetch important events." });
  }
});

// ── After-hours events ─────────────────────────────────────────────────────────
app.get("/api/after-hours-events", ensureAuth, async (req, res) => {
  try {
    const email    = getUserEmail(req);
    const settings = await UserSetting.findOne({ email });
    const workStart= settings?.workStart ?? 9;
    const workEnd  = settings?.workEnd   ?? 17;

    const all = await ImportantEvent.find({ email, status: { $nin: ["Completed", "Declined"] } }).sort({ "start.dateTime": 1 });
    const afterHours = all.filter(e => isAfterHours(e.start?.dateTime, workStart, workEnd));

    res.json(afterHours);
  } catch (err) {
          if (err.message === "CALENDAR_NOT_LINKED") {
        return res.status(403).json({ error: "Calendar not connected.", calendarNotLinked: true });
      }
      res.status(500).json({ error: "Failed to fetch after-hours events." });
  }
});

// ── User settings ──────────────────────────────────────────────────────────────
app.get("/api/user-settings", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const s = await UserSetting.findOne({ email }) || {
      workStart: 9, workEnd: 17, alertRange: 3,
      includeWeekends: false, onlyIfInToList: false,
      keywords: ["urgent","attention","important","high importance","critical"],
      emailEnabled: false, emailAddress: "",
      alertIntervals: [60, 30, 15],
    };
    res.json(s);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings." });
  }
});

app.post("/api/user-settings", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const {
      workStart, workEnd, alertRange,
      includeWeekends, onlyIfInToList,
      keywords, emailEnabled, emailAddress,
      alertIntervals,
    } = req.body;

    const settings = await UserSetting.findOneAndUpdate(
      { email },
      { workStart, workEnd, alertRange, includeWeekends, onlyIfInToList,
        keywords, emailEnabled, emailAddress, alertIntervals },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    console.error("settings save error:", err.message);
    res.status(500).json({ error: "Failed to save settings." });
  }
});

// ── Event actions ──────────────────────────────────────────────────────────────

// Mark as Done — sets status:Completed so it won't re-appear on next sync
app.put("/api/:id", ensureAuth, async (req, res) => {
  try {
    const updated = await ImportantEvent.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "Completed", ...req.body } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found." });
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as done." });
  }
});

// Decline — sets status:Declined (soft delete) so next sync upsert won't resurrect it
app.delete("/api/:id", ensureAuth, async (req, res) => {
  try {
    const updated = await ImportantEvent.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "Declined" } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Event not found." });
    res.json({ ok: true, id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to decline event." });
  }
});

// ── Resync — re-classifies stored events with current settings ────────────────
// Called immediately after user saves preferences so changes apply right away.
app.post("/api/resync", ensureAuth, async (req, res) => {
  try {
    const userEmail = getUserEmail(req);
    const settings  = await UserSetting.findOne({ email: userEmail });

    const workStart       = settings?.workStart       ?? 9;
    const workEnd         = settings?.workEnd         ?? 17;
    const includeWeekends = settings?.includeWeekends ?? false;
    const keywords        = settings?.keywords        ?? [];

    // Get fresh token
    let token;
    try { token = await getAccessTokenForRequest(req); }
    catch { return res.status(401).json({ error: "Session expired.", reauth: true }); }

    // Fetch fresh events from Google
    const today   = new Date();
    const timeMin = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const timeMax = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString();

    const gcalResp = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: { Authorization: `Bearer ${token}` },
        params:  { timeMin, timeMax, singleEvents: true, orderBy: "startTime" },
      }
    );

    const events     = gcalResp.data.items || [];
    const currentIds = events.map(e => e.id).filter(Boolean);

    // Remove events no longer in Google Calendar
    await ImportantEvent.deleteMany({
      email: userEmail,
      eventId: { $nin: currentIds },
      status:  { $nin: ["Completed", "Declined"] },
    });

    // Re-classify every event with the NEW settings
    for (const event of events) {
      const dt = event.start?.dateTime;
      if (!dt) continue;
      if (!includeWeekends && isWeekend(dt)) continue;

      const { important, reason, reasons, isAttendee } = classifyImportance(event, userEmail, keywords);

      if (important) {
        await ImportantEvent.findOneAndUpdate(
          { email: userEmail, eventId: event.id },
          {
            $set: {
              summary:           event.summary,
              start:             { dateTime: event.start.dateTime },
              end:               { dateTime: event.end?.dateTime || event.start.dateTime },
              email:             userEmail,
              eventId:           event.id,
              youAreAnAttendee:  isAttendee,
              isAfterHours:      isAfterHours(dt, workStart, workEnd),
              importanceReason:  reason,
              importanceReasons: reasons,
            },
            $setOnInsert: { status: "Pending", response: "None" },
          },
          { upsert: true, new: true }
        );
      } else {
        // Event no longer qualifies with new settings — soft-remove (keep dismissed ones)
        await ImportantEvent.deleteOne({
          email:   userEmail,
          eventId: event.id,
          status:  { $nin: ["Completed", "Declined"] },
        });
      }
    }

    console.log(`✅ Resync complete for ${userEmail} — ${events.length} events re-classified`);
    res.json({ ok: true, reclassified: events.length });
  } catch (err) {
    console.error("resync error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Resync failed." });
  }
});

// ── Background polling + alert scheduler ──────────────────────────────────────
// Runs every 5 minutes. For each user session in MongoDB we'd need token storage,
// but since sessions are in-memory, we schedule alerts based on stored events.
// Alert emails are sent based on stored ImportantEvents vs current time.
cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Running alert check...");
  try {
    const now = new Date();

    // Get all users with email alerts enabled
    const usersWithAlerts = await UserSetting.find({ emailEnabled: true, emailAddress: { $ne: "" } });

    for (const settings of usersWithAlerts) {
      const intervals = settings.alertIntervals || [60, 30, 15];
      const events    = await ImportantEvent.find({
        email: settings.email,
        status: "Pending",
      });

      for (const event of events) {
        const start = new Date(event.start.dateTime);

        for (const mins of intervals) {
          const alertTime    = new Date(start.getTime() - mins * 60 * 1000);
          const windowStart  = new Date(alertTime.getTime() - 2.5 * 60 * 1000); // ±2.5min window
          const windowEnd    = new Date(alertTime.getTime() + 2.5 * 60 * 1000);

          if (now >= windowStart && now <= windowEnd) {
            // Check if already sent
            try {
              await AlertLog.create({
                email:    settings.email,
                eventId:  event.eventId,
                interval: mins,
              });
              // If create succeeded (no duplicate), send email
              await sendAlertEmail(settings.emailAddress, event, mins);
              console.log(`📧 Alert sent: ${settings.email} — "${event.summary}" in ${mins}min`);
            } catch (dupErr) {
              // Duplicate key = already sent, skip silently
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Alert scheduler error:", err.message);
  }
});

// ── Start ──────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
