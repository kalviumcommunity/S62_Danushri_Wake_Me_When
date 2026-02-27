import express        from "express";
import jwt            from "jsonwebtoken";
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
import AlertLog          from "./models/AlertLog.js";
import PushSubscription  from "./models/PushSubscription.js";
import webpush       from "web-push";

dotenv.config();
const app  = express();
const JWT_SECRET = process.env.JWT_SECRET || "wmw-jwt-secret-key";
const PORT = process.env.PORT || 5000;

// ── Web Push (VAPID) ───────────────────────────────────────────────────────────
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:" + (process.env.EMAIL_USER || "admin@wakemewhen.app"),
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
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


async function notifyAdminNewUser({ name, email, method }) {
  const adminEmail = "danushri.prakashsaranya@gmail.com"; // hardcoded admin
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("notifyAdminNewUser: EMAIL_USER or EMAIL_PASS not set — skipping");
    return;
  }
  const signedUpAt = new Date().toLocaleString("en-US", {
    weekday:"short", month:"short", day:"numeric",
    hour:"2-digit", minute:"2-digit", timeZoneName:"short",
  });
  try {
    await transporter.sendMail({
      from:    `"Wake Me When" <${process.env.EMAIL_USER}>`,
      to:      adminEmail,
      subject: `👤 New signup — ${name} (${email})`,
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:28px;background:#f7f6f4;border-radius:12px;">
          <div style="background:#0d9488;border-radius:8px;padding:14px 18px;margin-bottom:22px;">
            <span style="font-size:16px;font-weight:700;color:#fff;">⚡ Wake Me When — New User</span>
          </div>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 14px;background:#fff;border:1px solid #e5e2dd;border-radius:8px 8px 0 0;font-size:12px;color:#6b6560;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Name</td>
              <td style="padding:10px 14px;background:#fff;border:1px solid #e5e2dd;border-top:none;font-size:14px;font-weight:600;color:#1a1916;">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;background:#f7f6f4;border:1px solid #e5e2dd;border-top:none;font-size:12px;color:#6b6560;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Email</td>
              <td style="padding:10px 14px;background:#f7f6f4;border:1px solid #e5e2dd;border-top:none;font-size:14px;color:#0d9488;font-weight:600;">${email}</td>
            </tr>
            <tr>
              <td style="padding:10px 14px;background:#fff;border:1px solid #e5e2dd;border-top:none;border-radius:0 0 0 8px;font-size:12px;color:#6b6560;font-weight:600;text-transform:uppercase;letter-spacing:.06em;">Method</td>
              <td style="padding:10px 14px;background:#fff;border:1px solid #e5e2dd;border-top:none;border-radius:0 0 8px 0;font-size:14px;color:#1a1916;">${method}</td>
            </tr>
          </table>
          <p style="font-size:12px;color:#9a9187;margin-top:18px;">Signed up at ${signedUpAt}</p>
        </div>
      `,
    });
    console.log(`📬 Admin notified of new signup: ${email}`);
  } catch (err) {
    console.error("Admin notification failed:", err.message);
  }
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
  async (req, res) => {
    try {
      const gEmail = req.user?.profile?.emails?.[0]?.value?.toLowerCase();
      const gName  = req.user?.profile?.displayName || "Unknown";
      if (gEmail) {
        const exists = await User.findOne({ email: gEmail });
        if (!exists) {
          notifyAdminNewUser({ name: gName, email: gEmail, method: "Google OAuth" })
            .catch(err => console.error("Admin notify failed:", err.message));
        }
      }
    } catch (_) {}
    res.redirect("http://localhost:5173/home");
  }
);

app.get("/api/logout", (req, res) => req.logout(() => res.redirect("http://localhost:5173")));

// ── Email Auth: Register ───────────────────────────────────────────────────────

// ── JWT: Verify token ──────────────────────────────────────────────────────────
app.get("/api/auth/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided." });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ ok: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
});

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

    // Notify admin of new signup
    notifyAdminNewUser({ name: user.name, email: user.email, method: "Email/Password" })
      .catch(err => console.error("Admin notify failed:", err.message));

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ ok: true, calendarLinked: false, name: user.name, email: user.email, token });
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

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ ok: true, calendarLinked, name: user.name, email: user.email, token });
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
app.get("/api/user", async (req, res) => {
  if (req.session?.emailUser) {
    const u = req.session.emailUser;
    const dbUser = u.id ? await User.findById(u.id).catch(() => null) : null;
    return res.json({
      authenticated: true,
      calendarLinked: !!(dbUser?.accessToken && dbUser?.calendarLinked) || u.calendarLinked || false,
      outlookLinked: dbUser?.outlookLinked || false,
      outlookEmail:  dbUser?.outlookEmail  || null,
      user: { id: u.id, displayName: dbUser?.name || u.name, email: u.email, avatar: dbUser?.customPhoto || null, authMethod: "email", createdAt: dbUser?.createdAt || null },
    });
  }
  if (!req.user) return res.json({ authenticated: false });
  const p = req.user.profile;
  const googleEmail = p.emails?.[0]?.value?.toLowerCase();
  const dbUser = googleEmail ? await User.findOne({ email: googleEmail }).catch(() => null) : null;
  res.json({
    authenticated: true,
    calendarLinked: !!(dbUser?.accessToken && dbUser?.calendarLinked),
    outlookLinked: dbUser?.outlookLinked || false,
    outlookEmail:  dbUser?.outlookEmail  || null,
    user: {
      name:        dbUser?.name || p.displayName,
      email:       googleEmail,
      avatar:      dbUser?.customPhoto || p.photos?.[0]?.value,
      authMethod:  "google",
      createdAt:   dbUser?.createdAt || null,
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

    // Merge Outlook events if linked
    let outlookEvents = [];
    try {
      const dbUser = req.session?.emailUser?.id
        ? await User.findById(req.session.emailUser.id)
        : await User.findOne({ email: userEmail });
      if (dbUser?.outlookLinked) {
        outlookEvents = await fetchOutlookEvents(dbUser, timeMin, timeMax);
      }
    } catch (outErr) {
      console.log("Outlook fetch skipped:", outErr.message);
    }

    const allEvents = [
      ...events,
      ...outlookEvents.filter(oe => !events.some(ge => ge.summary === oe.summary &&
        ge.start?.dateTime?.slice(0,16) === oe.start?.dateTime?.slice(0,16)
      )),
    ].sort((a, b) => new Date(a.start?.dateTime) - new Date(b.start?.dateTime));

    res.json({ allEvents });
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

    const includeWeekends  = settings?.includeWeekends ?? false;
    const includeOrganized = settings?.onlyIfInToList  ?? false;

    // Base query — anything in ImportantEvents that isn't dismissed
    const query = {
      email,
      status: { $nin: ["Completed", "Declined"] },
    };

    // If "only include meetings I'm invited to" is OFF (default),
    // exclude organizer-only events unless toggle is ON
    if (!includeOrganized) {
      query.$or = [
        { importanceReasons: { $in: ["keyword", "highImportance", "attendee"] } },
        { youAreAnAttendee: true },
      ];
    }

    const events = await ImportantEvent.find(query).sort({ "start.dateTime": 1 });

    const filtered = includeWeekends
      ? events
      : events.filter(e => !isWeekend(e.start?.dateTime));

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
// ── Profile routes ─────────────────────────────────────────────────────────────

app.get("/api/profile/stats", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const dbUser = req.session?.emailUser?.id
      ? await User.findById(req.session.emailUser.id)
      : await User.findOne({ email });

    const [totalImportant, totalEvents, afterHoursCount] = await Promise.all([
      ImportantEvent.countDocuments({ email, status: { $nin: ["Completed", "Declined"] } }),
      ImportantEvent.countDocuments({ email }),
      ImportantEvent.countDocuments({ email, importanceReasons: "afterHours" }),
    ]);

    res.json({
      totalImportant,
      totalEvents,
      afterHours: afterHoursCount,
      memberSince: dbUser?.createdAt || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load stats." });
  }
});

app.put("/api/profile/photo", ensureAuth, async (req, res) => {
  try {
    const { photo } = req.body;
    if (!photo) return res.status(400).json({ error: "No photo provided." });
    // Validate it's a base64 image (data URI)
    if (!photo.startsWith("data:image/")) return res.status(400).json({ error: "Invalid image format." });
    // Limit size — base64 of 2MB image ~2.7MB string
    if (photo.length > 3 * 1024 * 1024) return res.status(400).json({ error: "Image too large. Max 2MB." });

    const email = getUserEmail(req);
    const id = req.session?.emailUser?.id;
    if (id) {
      await User.findByIdAndUpdate(id, { customPhoto: photo });
    } else if (email) {
      await User.findOneAndUpdate({ email }, { customPhoto: photo });
    } else {
      return res.status(400).json({ error: "Could not identify user." });
    }
    res.json({ ok: true, photo });
  } catch (err) {
    console.error("photo upload error:", err.message);
    res.status(500).json({ error: "Failed to save photo." });
  }
});

app.put("/api/profile", ensureAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: "Name is required." });

    const trimmed = name.trim();
    const email = getUserEmail(req);

    if (req.session?.emailUser?.id) {
      await User.findByIdAndUpdate(req.session.emailUser.id, { name: trimmed });
      req.session.emailUser.name = trimmed;
      // Explicitly save session so reload picks up the new name
      await new Promise((resolve, reject) =>
        req.session.save(err => err ? reject(err) : resolve())
      );
    } else if (email) {
      await User.findOneAndUpdate({ email }, { name: trimmed });
    } else {
      return res.status(400).json({ error: "Could not identify user." });
    }
    res.json({ ok: true, name: trimmed });
  } catch (err) {
    console.error("profile PUT error:", err.message);
    res.status(500).json({ error: err.message || "Failed to update profile." });
  }
});

app.delete("/api/profile", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const userId = req.session?.emailUser?.id;

    // Delete all user data
    await Promise.all([
      User.findOneAndDelete(userId ? { _id: userId } : { email }),
      ImportantEvent.deleteMany({ email }),
      UserSetting.deleteMany({ email }),
      AlertLog.deleteMany({ email }),
      PushSubscription.deleteMany({ email }),
    ]);

    req.logout?.(() => {});
    req.session?.destroy?.(() => {});
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account." });
  }
});


// ── Debug: check current user DB state ───────────────────────────────────────
app.get("/api/debug/me", ensureAuth, async (req, res) => {
  const email = getUserEmail(req);
  const id = req.session?.emailUser?.id;
  const dbUser = id ? await User.findById(id).lean() : await User.findOne({ email }).lean();
  res.json({
    sessionEmail: email,
    sessionId: id,
    dbFound: !!dbUser,
    calendarLinked: dbUser?.calendarLinked,
    hasAccessToken: !!dbUser?.accessToken,
    name: dbUser?.name,
  });
});

// ── Debug: test admin notification (TEMP — remove before production) ──────────
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



// ── Accept event (RSVP yes) ────────────────────────────────────────────────────
app.post("/api/accept-event/:eventId", ensureAuth, async (req, res) => {
  try {
    const { eventId } = req.params;
    let token;
    try { token = await getAccessTokenForRequest(req); }
    catch { return res.status(401).json({ error: "Session expired.", reauth: true }); }

    // Patch Google Calendar — set self responseStatus to accepted
    await axios.patch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      { attendees: undefined },  // Google ignores attendees in patch; use sendUpdates
      {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        params:  { sendUpdates: "none" },
      }
    );
    res.json({ ok: true });
  } catch (err) {
    // Non-fatal — may fail if user is organizer (no self attendee entry)
    console.error("accept-event error:", err?.response?.data || err.message);
    res.json({ ok: true }); // still resolve so UI updates
  }
});

// ── Overlap detection ──────────────────────────────────────────────────────────
app.get("/api/overlap-events", ensureAuth, async (req, res) => {
  try {
    const userEmail = getUserEmail(req);
    let token;
    try { token = await getAccessTokenForRequest(req); }
    catch { return res.status(401).json({ error: "Session expired.", reauth: true }); }

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

    const events = (gcalResp.data.items || []).filter(e => e.start?.dateTime);

    // Find all overlapping pairs
    const overlaps = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const aStart = new Date(events[i].start.dateTime).getTime();
        const aEnd   = new Date(events[i].end?.dateTime  || events[i].start.dateTime).getTime() + 60000;
        const bStart = new Date(events[j].start.dateTime).getTime();
        const bEnd   = new Date(events[j].end?.dateTime  || events[j].start.dateTime).getTime() + 60000;

        // Overlap: one starts before the other ends
        if (aStart < bEnd && bStart < aEnd) {
          overlaps.push({
            a: { id: events[i].id, summary: events[i].summary, start: events[i].start.dateTime, end: events[i].end?.dateTime },
            b: { id: events[j].id, summary: events[j].summary, start: events[j].start.dateTime, end: events[j].end?.dateTime },
          });
        }
      }
    }

    res.json({ overlaps });
  } catch (err) {
    console.error("overlap error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to check overlaps." });
  }
});



// ── Raw email test (no auth needed) ──────────────────────────────────────────
app.get("/api/debug/send-raw-email", async (req, res) => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  console.log("RAW TEST — EMAIL_USER:", user || "NOT SET");
  console.log("RAW TEST — EMAIL_PASS:", pass ? "SET" : "NOT SET");

  if (!user || !pass) {
    return res.status(500).json({ error: "EMAIL_USER or EMAIL_PASS not set in .env" });
  }

  try {
    const nodemailer = (await import("nodemailer")).default;
    const t = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await t.sendMail({
      from: user,
      to: "danushri.prakashsaranya@gmail.com",
      subject: "WMW test email",
      text: "If you got this, email is working.",
    });

    res.json({ ok: true, from: user, to: "danushri.prakashsaranya@gmail.com" });
  } catch (err) {
    console.error("RAW EMAIL ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ── Outlook / Microsoft 365 OAuth ─────────────────────────────────────────────
const AZURE_CLIENT_ID     = process.env.AZURE_CLIENT_ID;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET;
const AZURE_REDIRECT_URI  = "http://localhost:5000/api/auth/outlook/callback";
const MS_SCOPES           = "openid profile email offline_access Calendars.Read User.Read";

app.get("/api/auth/outlook", (req, res) => {
  if (!AZURE_CLIENT_ID) return res.status(500).json({ error: "Outlook integration not configured." });
  const state = req.session?.emailUser?.id
    ? Buffer.from(JSON.stringify({ uid: req.session.emailUser.id })).toString("base64")
    : "google";
  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?`
    + `client_id=${AZURE_CLIENT_ID}`
    + `&response_type=code`
    + `&redirect_uri=${encodeURIComponent(AZURE_REDIRECT_URI)}`
    + `&scope=${encodeURIComponent(MS_SCOPES)}`
    + `&response_mode=query`
    + `&prompt=consent`
    + `&state=${state}`;
  res.redirect(url);
});

app.get("/api/auth/outlook/callback", async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.redirect("http://localhost:5173/home?outlookError=no_code");

  try {
    // Exchange code for tokens
    const tokenResp = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id:     AZURE_CLIENT_ID,
        client_secret: AZURE_CLIENT_SECRET,
        code,
        redirect_uri:  AZURE_REDIRECT_URI,
        grant_type:    "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenResp.data;

    // Get user profile from Microsoft Graph
    const profileResp = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const msEmail = (profileResp.data.mail || profileResp.data.userPrincipalName || "").toLowerCase();

    // Find the user — by session ID or by email
    let userId = null;
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      userId = decoded.uid;
    } catch (_) {}

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        outlookAccessToken:  access_token,
        outlookRefreshToken: refresh_token,
        outlookTokenIssuedAt: Date.now(),
        outlookEmail:        msEmail,
        outlookLinked:       true,
      });
    } else if (req.user?.profile?.emails?.[0]?.value) {
      // Google-auth user — find by google email
      const googleEmail = req.user.profile.emails[0].value.toLowerCase();
      await User.findOneAndUpdate({ email: googleEmail }, {
        outlookAccessToken:  access_token,
        outlookRefreshToken: refresh_token,
        outlookTokenIssuedAt: Date.now(),
        outlookEmail:        msEmail,
        outlookLinked:       true,
      });
    }

    res.redirect("http://localhost:5173/home?outlookLinked=1");
  } catch (err) {
    console.error("Outlook callback error:", err?.response?.data || err.message);
    res.redirect("http://localhost:5173/home?outlookError=1");
  }
});

app.post("/api/auth/outlook/disconnect", ensureAuth, async (req, res) => {
  try {
    const userEmail = getUserEmail(req);
    let query = req.session?.emailUser?.id
      ? { _id: req.session.emailUser.id }
      : { email: userEmail };
    await User.findOneAndUpdate(query, {
      outlookAccessToken:  null,
      outlookRefreshToken: null,
      outlookTokenIssuedAt: null,
      outlookEmail:        null,
      outlookLinked:       false,
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to disconnect Outlook." });
  }
});

// ── Outlook events helper ──────────────────────────────────────────────────────
async function getOutlookAccessToken(user) {
  if (!user?.outlookAccessToken) throw new Error("OUTLOOK_NOT_LINKED");
  const elapsed = Date.now() - (user.outlookTokenIssuedAt || 0);
  if (elapsed < 55 * 60 * 1000) return user.outlookAccessToken;

  // Refresh
  if (!user.outlookRefreshToken) throw new Error("OUTLOOK_NOT_LINKED");
  const resp = await axios.post(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    new URLSearchParams({
      client_id:     AZURE_CLIENT_ID,
      client_secret: AZURE_CLIENT_SECRET,
      refresh_token: user.outlookRefreshToken,
      grant_type:    "refresh_token",
      scope:         MS_SCOPES,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  const newToken = resp.data.access_token;
  await User.findByIdAndUpdate(user._id, {
    outlookAccessToken: newToken,
    outlookTokenIssuedAt: Date.now(),
    ...(resp.data.refresh_token ? { outlookRefreshToken: resp.data.refresh_token } : {}),
  });
  return newToken;
}

async function fetchOutlookEvents(user, timeMin, timeMax) {
  const token = await getOutlookAccessToken(user);
  const resp = await axios.get(
    `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${timeMin}&endDateTime=${timeMax}&$orderby=start/dateTime&$top=50`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  // Normalize to Google Calendar event shape
  return (resp.data.value || []).map(e => ({
    id:       e.id,
    summary:  e.subject || "Untitled",
    start:    { dateTime: e.start?.dateTime ? new Date(e.start.dateTime).toISOString() : null },
    end:      { dateTime: e.end?.dateTime   ? new Date(e.end.dateTime).toISOString()   : null },
    attendees: (e.attendees || []).map(a => ({
      email:          a.emailAddress?.address?.toLowerCase() || "",
      displayName:    a.emailAddress?.name || "",
      responseStatus: a.status?.response === "accepted"  ? "accepted"
                    : a.status?.response === "tentatively" ? "tentative"
                    : a.status?.response === "declined"  ? "declined"
                    : "needsAction",
    })),
    organizer: { email: e.organizer?.emailAddress?.address?.toLowerCase() || "" },
    source:   "outlook",
    description: e.bodyPreview || "",
  }));
}


// ── Push notification routes ───────────────────────────────────────────────────

// Return VAPID public key so frontend can subscribe
app.get("/api/push/vapid-public-key", (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(400).json({ error: "Push notifications not configured." });
  }
  res.json({ key: process.env.VAPID_PUBLIC_KEY });
});

// Save push subscription from browser
app.post("/api/push/subscribe", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const { subscription } = req.body;
    if (!subscription?.endpoint) return res.status(400).json({ error: "Invalid subscription." });

    await PushSubscription.findOneAndUpdate(
      { email, "subscription.endpoint": subscription.endpoint },
      { email, subscription },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("push subscribe error:", err.message);
    res.status(500).json({ error: "Failed to save subscription." });
  }
});

// Remove push subscription
app.post("/api/push/unsubscribe", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ email, "subscription.endpoint": endpoint });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove subscription." });
  }
});

// Send test push to current user
app.post("/api/push/test", ensureAuth, async (req, res) => {
  try {
    const email = getUserEmail(req);
    const subs  = await PushSubscription.find({ email });
    if (!subs.length) return res.status(400).json({ error: "No push subscription found. Enable notifications first." });
    if (!process.env.VAPID_PUBLIC_KEY) return res.status(400).json({ error: "Push not configured on server." });

    const payload = JSON.stringify({
      title: "⏰ Wake Me When — Test Alarm",
      body:  "Alarm notifications are working! You'll be woken up before important meetings.",
      tag:   "wmw-test",
    });

    await Promise.all(subs.map(s =>
      webpush.sendNotification(s.subscription, payload).catch(err => {
        if (err.statusCode === 410) PushSubscription.deleteOne({ _id: s._id }).catch(() => {});
      })
    ));
    res.json({ ok: true });
  } catch (err) {
    console.error("push test error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ── Debug: dump all ImportantEvents for current user ─────────────────────────
app.get("/api/debug/important-raw", ensureAuth, async (req, res) => {
  const email = getUserEmail(req);
  const all = await ImportantEvent.find({ email }).lean();
  res.json({ count: all.length, events: all.map(e => ({
    summary: e.summary,
    status: e.status,
    importanceReason: e.importanceReason,
    importanceReasons: e.importanceReasons,
    youAreAnAttendee: e.youAreAnAttendee,
    start: e.start?.dateTime,
  }))});
});



app.get("/api/debug/test-admin-email", async (req, res) => {
  console.log("🧪 Debug test-admin-email called");
  console.log("EMAIL_USER:", process.env.EMAIL_USER || "NOT SET");
  console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "SET" : "NOT SET");
  console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "NOT SET");
  try {
    await notifyAdminNewUser({ name: "Test User", email: "test@example.com", method: "Debug Test" });
    res.json({ ok: true, sentTo: process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "none" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Test email ─────────────────────────────────────────────────────────────────
app.post("/api/test-email", ensureAuth, async (req, res) => {
  try {
    const userEmail = getUserEmail(req);
    const settings  = await UserSetting.findOne({ email: userEmail });
    const toEmail   = settings?.emailAddress || userEmail;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ error: "EMAIL_USER and EMAIL_PASS are not configured on the server." });
    }

    await transporter.sendMail({
      from:    `"Wake Me When" <${process.env.EMAIL_USER}>`,
      to:      toEmail,
      subject: "✅ Wake Me When — Email alerts are working!",
      html: `
        <div style="font-family:-apple-system,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f7f6f4;border-radius:12px;">
          <div style="background:#0d9488;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <span style="font-size:18px;font-weight:700;color:#fff;">⚡ Wake Me When</span>
          </div>
          <h2 style="font-size:20px;color:#1a1916;margin:0 0 12px;">Email alerts are working!</h2>
          <p style="font-size:14px;color:#6b6560;line-height:1.7;">
            Your email alert setup is confirmed. You'll receive alerts at your chosen intervals
            (60, 30, and 15 minutes) before any important meetings.
          </p>
          <p style="font-size:12px;color:#9a9187;margin-top:20px;">Sent to: ${toEmail}</p>
        </div>
      `,
    });

    res.json({ ok: true, sentTo: toEmail });
  } catch (err) {
    console.error("test email error:", err.message);
    res.status(500).json({ error: err.message || "Failed to send test email." });
  }
});

// ── Background polling + alert scheduler ──────────────────────────────────────
// Runs every 5 minutes. For each user session in MongoDB we'd need token storage,
// but since sessions are in-memory, we schedule alerts based on stored events.
// Alert emails are sent based on stored ImportantEvents vs current time.
// Helper: check if now is within the alert window for a given meeting + interval
function inAlertWindow(start, mins, now) {
  const alertTime   = new Date(start.getTime() - mins * 60 * 1000);
  const windowStart = new Date(alertTime.getTime() - 2.5 * 60 * 1000);
  const windowEnd   = new Date(alertTime.getTime() + 2.5 * 60 * 1000);
  return now >= windowStart && now <= windowEnd;
}

cron.schedule("*/5 * * * *", async () => {
  console.log("⏰ Running alert check...");
  try {
    const now = new Date();

    // ── Email alerts ───────────────────────────────────────────────────────────
    const emailUsers = await UserSetting.find({ emailEnabled: true, emailAddress: { $ne: "" } });
    for (const settings of emailUsers) {
      const intervals = settings.alertIntervals?.length ? settings.alertIntervals : [60, 30, 15];
      const events    = await ImportantEvent.find({ email: settings.email, status: "Pending" });

      for (const event of events) {
        const start = new Date(event.start.dateTime);
        for (const mins of intervals) {
          if (!inAlertWindow(start, mins, now)) continue;
          try {
            await AlertLog.create({ email: settings.email, eventId: event.eventId, interval: mins });
            await sendAlertEmail(settings.emailAddress, event, mins);
            console.log(`📧 Email sent: ${settings.email} — "${event.summary}" in ${mins}min`);
          } catch (dupErr) { /* already sent */ }
        }
      }
    }

    // ── Push alarms (independent of email — fires for ALL users with push subs) ─
    if (process.env.VAPID_PUBLIC_KEY) {
      const pushSubs = await PushSubscription.find({});
      // Group by email
      const subsByEmail = {};
      for (const s of pushSubs) {
        if (!subsByEmail[s.email]) subsByEmail[s.email] = [];
        subsByEmail[s.email].push(s);
      }

      for (const [email, subs] of Object.entries(subsByEmail)) {
        const events = await ImportantEvent.find({ email, status: "Pending" });

        for (const event of events) {
          const start = new Date(event.start.dateTime);
          // Always alert at 60 min for push (alarm behaviour)
          const pushIntervals = [60, 30, 15];
          for (const mins of pushIntervals) {
            if (!inAlertWindow(start, mins, now)) continue;
            try {
              // Use AlertLog with a push- prefix to avoid colliding with email log
              await AlertLog.create({ email, eventId: `push-${event.eventId}`, interval: mins });
              const startTime = new Date(event.start.dateTime).toLocaleTimeString("en-US", {
                hour: "2-digit", minute: "2-digit",
              });
              const payload = JSON.stringify({
                title: `⏰ Meeting in ${mins === 60 ? "1 hour" : mins + " min"}`,
                body:  `${event.summary || "Untitled"} starts at ${startTime}`,
                tag:   `wmw-${event.eventId}-${mins}`,
              });
              await Promise.all(subs.map(s =>
                webpush.sendNotification(s.subscription, payload).catch(err => {
                  if (err.statusCode === 410) PushSubscription.deleteOne({ _id: s._id }).catch(() => {});
                })
              ));
              console.log(`🔔 Push sent: ${email} — "${event.summary}" in ${mins}min`);
            } catch (dupErr) { /* already sent */ }
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
