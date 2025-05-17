import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const port = 5000;

// MongoDB Schema
const eventSchema = new mongoose.Schema({
  summary: String,
  start: Object,
  end: Object,
  email: String,
  eventId: String,
  youAreAnAttendee: Boolean,
  status: { type: String, default: "Pending" },  // Added status field
  response: { type: String, default: "None" },  // Added response field
});
const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",  // Ensure your React app is running on this port
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Passport Strategy
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

// Routes

// Google Auth
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

// User Auth Check
app.get("/api/user", (req, res) => {
  if (req.user) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Fetch All Events + Store Important
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

    // Clear previous important events
    await ImportantEvent.deleteMany({ email: userEmail });

    const importantEvents = [];

    for (const event of events) {
      const summary = event.summary?.toLowerCase() || "";
      const attendees = event.attendees?.map((a) => a.email) || [];
      const creatorEmail = event.creator?.email || "";

      const isUserInAttendees = attendees.includes(userEmail);
      const isDirectToUser = creatorEmail === userEmail || event.organizer?.email === userEmail;

      const isImportant =
        summary.includes("important") ||
        summary.includes("urgent") ||
        summary.includes("attention") || // Added "attention" keyword
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
            status: "Pending", // Added status
            response: "None",  // Added response
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

// Fetch Important Events
app.get("/api/important-events", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const email = req.user.profile.emails[0].value;

  try {
    const importantEvents = await ImportantEvent.find({ email });
    if (!importantEvents) {
      return res.status(404).json({ error: "No important events found" });
    }
    res.json(importantEvents);
  } catch (err) {
    console.error("Error fetching important events:", err);
    res.status(500).json({ error: "Failed to fetch important events" });
  }
});

// POST / Save Important Events
app.post("/api/meetings/save", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  try {
    const meetings = req.body.meetings || [];
    const email = req.user.profile.emails[0].value;

    const enrichedMeetings = meetings.map((m) => ({
      ...m,
      email,
    }));

    await ImportantEvent.insertMany(enrichedMeetings);
    res.json({ message: "Meetings saved" });
  } catch (err) {
    console.error("Error saving meetings:", err);
    res.status(500).json({ error: "Failed to save meetings" });
  }
});

// PUT / Update an Event (Mark as Completed)
app.put("/api/meetings/:id", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.params;
  const { status } = req.body;  // Update the status

  try {
    const updatedEvent = await ImportantEvent.findByIdAndUpdate(
      id,
      { status },  // Update the status in the database
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// PATCH / Update Event Response (Accepted/Declined)
app.patch("/api/meetings/:id/response", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.params;
  const { response } = req.body;  // Accepted or Declined

  try {
    const updatedEvent = await ImportantEvent.findByIdAndUpdate(
      id,
      { response },  // Update the response field
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });

    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating response:", err);
    res.status(500).json({ error: "Failed to update response" });
  }
});

// DELETE / Delete an Event
app.delete("/api/meetings/:id", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { id } = req.params;

  try {
    const deletedEvent = await ImportantEvent.findByIdAndDelete(id);

    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
