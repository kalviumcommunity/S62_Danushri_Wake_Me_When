
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import cors from "cors";
import moment from "moment-timezone";
import UserSetting from "./models/UserSettings.js";
import ImportantEvent from "./models/ImportantEvent.js";

dotenv.config();
const app = express();
const port = 5000;

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Passport Google OAuth setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, { profile, accessToken });
    }
  )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Auth middleware
function ensureAuth(req, res, next) {
  if (req.user) return next();
  res.status(401).json({ error: "Not authenticated" });
}

// Routes for Google OAuth
app.get(
  "/api/auth",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
      "openid",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

app.get(
  "/api/auth/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173");
  }
);

app.get("/api/user", (req, res) => {
  res.json({ authenticated: !!req.user });
});

// Fetch and store important events
app.get("/api/all-events", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const today = new Date();
    const timeMin = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString();
    const timeMax = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).toISOString();

    const response = await axios.get(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
        },
        params: {
          timeMin,
          timeMax,
          singleEvents: true,
          orderBy: "startTime",
        },
      }
    );

    const events = response.data.items || [];
    const userEmail = req.user.profile.emails[0].value;

    await ImportantEvent.deleteMany({ email: userEmail });

    const importantEvents = [];

    for (const event of events) {
      const summary = event.summary?.toLowerCase() || "";
      const attendees = event.attendees?.map((a) => a.email) || [];
      const creatorEmail = event.creator?.email || "";
      const isUserInAttendees = attendees.includes(userEmail);
      const isDirectToUser =
        creatorEmail === userEmail || event.organizer?.email === userEmail;

      const isImportant =
        summary.includes("important") ||
        summary.includes("urgent") ||
        summary.includes("attention") ||
        isUserInAttendees ||
        isDirectToUser;

      if (isImportant && event.start?.dateTime) {
        const eventHour = new Date(event.start.dateTime).getHours();

        if (eventHour < 9 || eventHour >= 17) {
          importantEvents.push({
            summary: event.summary,
            start: event.start,
            end: event.end,
            email: userEmail,
            eventId: event.id,
            youAreAnAttendee: isUserInAttendees,
            status: "Pending",
            response: "None",
          });
        }
      }
    }

    await ImportantEvent.insertMany(importantEvents);

    res.json({ allEvents: events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get filtered important events
app.get("/api/important-events", ensureAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value.toLowerCase();
    const userSetting = await UserSetting.findOne({ email });
    const alertRange = userSetting?.alertRange || 3;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const startBeforeWork = new Date(today);
    startBeforeWork.setHours(9 - alertRange, 0, 0, 0);
    const endBeforeWork = new Date(today);
    endBeforeWork.setHours(9, 0, 0, 0);

    const startAfterWork = new Date(today);
    startAfterWork.setHours(17, 0, 0, 0);
    const endAfterWork = new Date(today);
    endAfterWork.setHours(17 + alertRange, 0, 0, 0);

    const events = await ImportantEvent.find({
      email,
      $or: [
        {
          "start.dateTime": {
            $gte: startBeforeWork.toISOString(),
            $lt: endBeforeWork.toISOString(),
          },
        },
        {
          "start.dateTime": {
            $gte: startAfterWork.toISOString(),
            $lt: endAfterWork.toISOString(),
          },
        },
      ],
    });

    res.json(events);
  } catch (error) {
    console.error("❌ Error fetching important events:", error);
    res.status(500).json({ error: "Failed to fetch important events" });
  }
});

// Get user settings
app.get("/api/user-settings", ensureAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value.toLowerCase();
    let settings = await UserSetting.findOne({ email });
    if (!settings) {
      settings = {
        includeWeekends: false,
        onlyIfInToList: false,
        alertRange: 7,
      };
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user settings" });
  }
});

// Update user settings
app.post("/api/user-settings", ensureAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value.toLowerCase();
    const { includeWeekends, onlyIfInToList, alertRange } = req.body;

    const settings = await UserSetting.findOneAndUpdate(
      { email },
      { includeWeekends, onlyIfInToList, alertRange },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to save user settings" });
  }
});

// Save new important event
app.post("/api/save", ensureAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value.toLowerCase();
    const { summary, start, end, eventId, youAreAnAttendee } = req.body;

    const newEvent = new ImportantEvent({
      summary,
      start,
      end,
      email,
      eventId,
      youAreAnAttendee,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error saving event:", error.message);
    res.status(500).json({ error: "Failed to save event" });
  }
});

// Update event status/response
app.patch("/api/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updatedEvent = await ImportantEvent.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error.message);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete important event
app.delete("/api/:id", ensureAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await ImportantEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted", id });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
