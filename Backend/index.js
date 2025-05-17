



// // // // // // // // import express from "express";
// // // // // // // // import session from "express-session";
// // // // // // // // import passport from "passport";
// // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // import dotenv from "dotenv";
// // // // // // // // import axios from "axios";
// // // // // // // // import mongoose from "mongoose";
// // // // // // // // import cors from "cors";

// // // // // // // // dotenv.config();

// // // // // // // // const app = express();
// // // // // // // // const port = 5000;

// // // // // // // // // MongoDB Schema for important events
// // // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // // //   summary: String,
// // // // // // // //   start: Object,
// // // // // // // //   end: Object,
// // // // // // // //   email: String,
// // // // // // // //   eventId: String,
// // // // // // // //   youAreAnAttendee: Boolean,
// // // // // // // //   status: { type: String, default: "Pending" },
// // // // // // // //   response: { type: String, default: "None" },
// // // // // // // // });
// // // // // // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // // // // // MongoDB Schema for user settings
// // // // // // // // const userSettingsSchema = new mongoose.Schema({
// // // // // // // //   email: { type: String, required: true, unique: true },
// // // // // // // //   includeWeekends: { type: Boolean, default: false },
// // // // // // // //   onlyIfInToList: { type: Boolean, default: false },
// // // // // // // //   alertRange: { type: Number, default: 1 },
// // // // // // // // });
// // // // // // // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // // // // // // Middleware
// // // // // // // // app.use(express.json());
// // // // // // // // app.use(
// // // // // // // //   cors({
// // // // // // // //     origin: "http://localhost:5173",
// // // // // // // //     credentials: true,
// // // // // // // //   })
// // // // // // // // );

// // // // // // // // app.use(
// // // // // // // //   session({
// // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // //     resave: false,
// // // // // // // //     saveUninitialized: true,
// // // // // // // //     cookie: { secure: false }, // secure should be true on HTTPS in production
// // // // // // // //   })
// // // // // // // // );

// // // // // // // // app.use(passport.initialize());
// // // // // // // // app.use(passport.session());

// // // // // // // // // MongoDB Connection
// // // // // // // // mongoose
// // // // // // // //   .connect(process.env.MONGODB_URI)
// // // // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // // // // Passport Strategy
// // // // // // // // passport.use(
// // // // // // // //   new GoogleStrategy(
// // // // // // // //     {
// // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // //     },
// // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // //       // Store accessToken and profile in session for API usage
// // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // //     }
// // // // // // // //   )
// // // // // // // // );

// // // // // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // // // // Middleware to check authentication
// // // // // // // // function ensureAuth(req, res, next) {
// // // // // // // //   if (req.user) return next();
// // // // // // // //   return res.status(401).json({ error: "Not authenticated" });
// // // // // // // // }

// // // // // // // // // Routes

// // // // // // // // // Google OAuth login
// // // // // // // // app.get(
// // // // // // // //   "/api/auth",
// // // // // // // //   passport.authenticate("google", {
// // // // // // // //     scope: [
// // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // //       "openid",
// // // // // // // //     ],
// // // // // // // //     accessType: "offline",
// // // // // // // //     prompt: "consent",
// // // // // // // //   })
// // // // // // // // );

// // // // // // // // // OAuth callback
// // // // // // // // app.get(
// // // // // // // //   "/api/auth/callback",
// // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // //   (req, res) => {
// // // // // // // //     res.redirect("http://localhost:5173"); // Redirect to frontend after login
// // // // // // // //   }
// // // // // // // // );

// // // // // // // // // Check authentication status
// // // // // // // // app.get("/api/user", (req, res) => {
// // // // // // // //   res.json({ authenticated: !!req.user });
// // // // // // // // });

// // // // // // // // // Fetch all events for today from Google Calendar
// // // // // // // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const accessToken = req.user.accessToken;

// // // // // // // //     // Define start and end of today in ISO format
// // // // // // // //     const todayStart = new Date();
// // // // // // // //     todayStart.setHours(0, 0, 0, 0);
// // // // // // // //     const todayEnd = new Date();
// // // // // // // //     todayEnd.setHours(23, 59, 59, 999);

// // // // // // // //     // Call Google Calendar API
// // // // // // // //     const calendarRes = await axios.get(
// // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // //       {
// // // // // // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // // // // // //         params: {
// // // // // // // //           timeMin: todayStart.toISOString(),
// // // // // // // //           timeMax: todayEnd.toISOString(),
// // // // // // // //           singleEvents: true,
// // // // // // // //           orderBy: "startTime",
// // // // // // // //         },
// // // // // // // //       }
// // // // // // // //     );

// // // // // // // //     const events = calendarRes.data.items || [];

// // // // // // // //     // Filter & save important events outside working hours (9-17)
// // // // // // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // // // // // // //     const importantEvents = events.filter((event) => {
// // // // // // // //       const summary = (event.summary || "").toLowerCase();
// // // // // // // //       const startDateTime = event.start.dateTime || event.start.date;

// // // // // // // //       if (!startDateTime) return false;

// // // // // // // //       const startHour = event.start.dateTime ? new Date(event.start.dateTime).getHours() : null;

// // // // // // // //       const outsideWorkingHours =
// // // // // // // //         startHour !== null && (startHour < 9 || startHour >= 17);

// // // // // // // //       // Check if user is attendee
// // // // // // // //       const attendees = event.attendees || [];
// // // // // // // //       const youAreAnAttendee = attendees.some(
// // // // // // // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // // // //       );

// // // // // // // //       const isImportant =
// // // // // // // //         summary.includes("urgent") ||
// // // // // // // //         summary.includes("important") ||
// // // // // // // //         youAreAnAttendee;

// // // // // // // //       // You can also add user settings filtering here if you want

// // // // // // // //       return outsideWorkingHours && isImportant;
// // // // // // // //     });

// // // // // // // //     // Clear old important events
// // // // // // // //     await ImportantEvent.deleteMany({ email: userEmail });

// // // // // // // //     // Save important events to DB
// // // // // // // //     await Promise.all(
// // // // // // // //       importantEvents.map((event) => {
// // // // // // // //         const youAreAnAttendee = (event.attendees || []).some(
// // // // // // // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // // // //         );
// // // // // // // //         return new ImportantEvent({
// // // // // // // //           summary: event.summary,
// // // // // // // //           start: event.start,
// // // // // // // //           end: event.end,
// // // // // // // //           email: userEmail,
// // // // // // // //           eventId: event.id,
// // // // // // // //           youAreAnAttendee,
// // // // // // // //           status: "Pending",
// // // // // // // //           response: "None",
// // // // // // // //         }).save();
// // // // // // // //       })
// // // // // // // //     );

// // // // // // // //     res.json(events);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching events:", error);
// // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // Fetch important events from DB
// // // // // // // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();
// // // // // // // //     const events = await ImportantEvent.find({ email: userEmail });
// // // // // // // //     res.json(events);
// // // // // // // //   } catch (error) {
// // // // // // // //     res.status(500).json({ error: "Failed to fetch important events" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // Get user settings
// // // // // // // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // // //     let settings = await UserSettings.findOne({ email });

// // // // // // // //     if (!settings) {
// // // // // // // //       // Return default if none found
// // // // // // // //       settings = {
// // // // // // // //         includeWeekends: false,
// // // // // // // //         onlyIfInToList: false,
// // // // // // // //         alertRange: 1,
// // // // // // // //       };
// // // // // // // //     }
// // // // // // // //     res.json(settings);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error fetching user settings:", error);
// // // // // // // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // Save or update user settings
// // // // // // // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // // // // // // //     if (
// // // // // // // //       typeof includeWeekends !== "boolean" ||
// // // // // // // //       typeof onlyIfInToList !== "boolean" ||
// // // // // // // //       typeof alertRange !== "number"
// // // // // // // //     ) {
// // // // // // // //       return res.status(400).json({ error: "Invalid data format" });
// // // // // // // //     }

// // // // // // // //     const settings = await UserSettings.findOneAndUpdate(
// // // // // // // //       { email },
// // // // // // // //       { includeWeekends, onlyIfInToList, alertRange },
// // // // // // // //       { new: true, upsert: true }
// // // // // // // //     );

// // // // // // // //     res.json(settings);
// // // // // // // //   } catch (error) {
// // // // // // // //     console.error("Error saving user settings:", error);
// // // // // // // //     res.status(500).json({ error: "Failed to save user settings" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // Update event status/response
// // // // // // // // app.patch("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const eventId = req.params.id;
// // // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // // //     const { status, response } = req.body;

// // // // // // // //     const event = await ImportantEvent.findOne({ _id: eventId, email });
// // // // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // // // // // //     if (status) event.status = status;
// // // // // // // //     if (response) event.response = response;

// // // // // // // //     await event.save();
// // // // // // // //     res.json(event);
// // // // // // // //   } catch (error) {
// // // // // // // //     res.status(500).json({ error: "Failed to update event" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // // Delete event
// // // // // // // // app.delete("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const eventId = req.params.id;
// // // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();

// // // // // // // //     const event = await ImportantEvent.findOneAndDelete({ _id: eventId, email });
// // // // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // // // // // //     res.json({ message: "Event deleted" });
// // // // // // // //   } catch (error) {
// // // // // // // //     res.status(500).json({ error: "Failed to delete event" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // app.listen(port, () => {
// // // // // // // //   console.log(`🚀 Server listening on http://localhost:${port}`);
// // // // // // // // });


// // // // // // // import express from "express";
// // // // // // // import session from "express-session";
// // // // // // // import passport from "passport";
// // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // import dotenv from "dotenv";
// // // // // // // import axios from "axios";
// // // // // // // import mongoose from "mongoose";
// // // // // // // import cors from "cors";
// // // // // // // import moment from "moment-timezone";

// // // // // // // dotenv.config();
// // // // // // // const app = express();
// // // // // // // const port = 5000;

// // // // // // // // MongoDB Schema for important events
// // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // //   summary: String,
// // // // // // //   start: Object,
// // // // // // //   end: Object,
// // // // // // //   email: String,
// // // // // // //   eventId: String,
// // // // // // //   youAreAnAttendee: Boolean,
// // // // // // //   status: { type: String, default: "Pending" },
// // // // // // //   response: { type: String, default: "None" },
// // // // // // // });
// // // // // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // // // // MongoDB Schema for user settings
// // // // // // // const userSettingsSchema = new mongoose.Schema({
// // // // // // //   email: { type: String, required: true, unique: true },
// // // // // // //   includeWeekends: { type: Boolean, default: false },
// // // // // // //   onlyIfInToList: { type: Boolean, default: false },
// // // // // // //   alertRange: { type: Number, default: 1 },
// // // // // // // });
// // // // // // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // // // // // Middleware
// // // // // // // app.use(express.json());
// // // // // // // app.use(
// // // // // // //   cors({
// // // // // // //     origin: "http://localhost:5173",
// // // // // // //     credentials: true,
// // // // // // //   })
// // // // // // // );
// // // // // // // app.use(
// // // // // // //   session({
// // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // //     resave: false,
// // // // // // //     saveUninitialized: true,
// // // // // // //     cookie: { secure: false }, // true for HTTPS in production
// // // // // // //   })
// // // // // // // );
// // // // // // // app.use(passport.initialize());
// // // // // // // app.use(passport.session());

// // // // // // // // MongoDB Connection
// // // // // // // mongoose
// // // // // // //   .connect(process.env.MONGODB_URI)
// // // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // // // Passport Strategy
// // // // // // // passport.use(
// // // // // // //   new GoogleStrategy(
// // // // // // //     {
// // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // //     },
// // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // //       return done(null, { profile, accessToken });
// // // // // // //     }
// // // // // // //   )
// // // // // // // );
// // // // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // // // Authentication check middleware
// // // // // // // function ensureAuth(req, res, next) {
// // // // // // //   if (req.user) return next();
// // // // // // //   return res.status(401).json({ error: "Not authenticated" });
// // // // // // // }

// // // // // // // // Google OAuth
// // // // // // // app.get(
// // // // // // //   "/api/auth",
// // // // // // //   passport.authenticate("google", {
// // // // // // //     scope: [
// // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // //       "openid",
// // // // // // //     ],
// // // // // // //     accessType: "offline",
// // // // // // //     prompt: "consent",
// // // // // // //   })
// // // // // // // );
// // // // // // // app.get(
// // // // // // //   "/api/auth/callback",
// // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // //   (req, res) => {
// // // // // // //     res.redirect("http://localhost:5173");
// // // // // // //   }
// // // // // // // );
// // // // // // // app.get("/api/user", (req, res) => {
// // // // // // //   res.json({ authenticated: !!req.user });
// // // // // // // });

// // // // // // // // 🔧 Fixed: Timezone-aware all-events API
// // // // // // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const accessToken = req.user.accessToken;
// // // // // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // // // // // //     // Timezone-aware start and end of day (Asia/Kolkata)
// // // // // // //     const todayStart = moment.tz("Asia/Kolkata").startOf("day").toISOString();
// // // // // // //     const todayEnd = moment.tz("Asia/Kolkata").endOf("day").toISOString();

// // // // // // //     const response = await axios.get(
// // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // //       {
// // // // // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // // // // //         params: {
// // // // // // //           timeMin: todayStart,
// // // // // // //           timeMax: todayEnd,
// // // // // // //           singleEvents: true,
// // // // // // //           orderBy: "startTime",
// // // // // // //         },
// // // // // // //       }
// // // // // // //     );

// // // // // // //     const events = response.data.items || [];

// // // // // // //     const importantEvents = events.filter((event) => {
// // // // // // //       const summary = (event.summary || "").toLowerCase();

// // // // // // //       const startDateTime = event.start?.dateTime || null;
// // // // // // //       if (!startDateTime) return false;

// // // // // // //       const eventStart = new Date(startDateTime);
// // // // // // //       const startHour = eventStart.getHours();

// // // // // // //       // Exclude working hours
// // // // // // //       const outsideWorkingHours = startHour < 9 || startHour >= 17;

// // // // // // //       const attendees = event.attendees || [];
// // // // // // //       const youAreAnAttendee = attendees.some(
// // // // // // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // // //       );

// // // // // // //       const isImportant =
// // // // // // //         summary.includes("urgent") ||
// // // // // // //         summary.includes("important") ||
// // // // // // //         youAreAnAttendee;

// // // // // // //       return outsideWorkingHours && isImportant;
// // // // // // //     });

// // // // // // //     // Remove old entries for this user
// // // // // // //     await ImportantEvent.deleteMany({ email: userEmail });

// // // // // // //     // Save filtered important events
// // // // // // //     await Promise.all(
// // // // // // //       importantEvents.map((event) => {
// // // // // // //         const youAreAnAttendee = (event.attendees || []).some(
// // // // // // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // // //         );
// // // // // // //         return new ImportantEvent({
// // // // // // //           summary: event.summary,
// // // // // // //           start: event.start,
// // // // // // //           end: event.end,
// // // // // // //           email: userEmail,
// // // // // // //           eventId: event.id,
// // // // // // //           youAreAnAttendee,
// // // // // // //         }).save();
// // // // // // //       })
// // // // // // //     );

// // // // // // //     res.json(events);
// // // // // // //   } catch (error) {
// // // // // // //     console.error("❌ Error fetching events:", error.response?.data || error.message);
// // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // //   }
// // // // // // // });

// // // // // // // // Get filtered important events
// // // // // // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // //     const events = await ImportantEvent.find({ email });
// // // // // // //     res.json(events);
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({ error: "Failed to fetch important events" });
// // // // // // //   }
// // // // // // // });

// // // // // // // // User settings: GET and POST
// // // // // // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // //     let settings = await UserSettings.findOne({ email });
// // // // // // //     if (!settings) {
// // // // // // //       settings = {
// // // // // // //         includeWeekends: false,
// // // // // // //         onlyIfInToList: false,
// // // // // // //         alertRange: 1,
// // // // // // //       };
// // // // // // //     }
// // // // // // //     res.json(settings);
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // // // // // //   }
// // // // // // // });
// // // // // // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // // // // // //     const settings = await UserSettings.findOneAndUpdate(
// // // // // // //       { email },
// // // // // // //       { includeWeekends, onlyIfInToList, alertRange },
// // // // // // //       { new: true, upsert: true }
// // // // // // //     );

// // // // // // //     res.json(settings);
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({ error: "Failed to save user settings" });
// // // // // // //   }
// // // // // // // });

// // // // // // // // Update event status/response
// // // // // // // app.patch("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // //     const { status, response } = req.body;
// // // // // // //     const event = await ImportantEvent.findOne({ _id: req.params.id, email });
// // // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // // // // //     if (status) event.status = status;
// // // // // // //     if (response) event.response = response;

// // // // // // //     await event.save();
// // // // // // //     res.json(event);
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({ error: "Failed to update event" });
// // // // // // //   }
// // // // // // // });

// // // // // // // // Delete an event
// // // // // // // app.delete("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // // //   try {
// // // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // // //     const event = await ImportantEvent.findOneAndDelete({
// // // // // // //       _id: req.params.id,
// // // // // // //       email,
// // // // // // //     });
// // // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });
// // // // // // //     res.json({ message: "Event deleted" });
// // // // // // //   } catch (error) {
// // // // // // //     res.status(500).json({ error: "Failed to delete event" });
// // // // // // //   }
// // // // // // // });

// // // // // // // app.listen(port, () => {
// // // // // // //   console.log(`🚀 Server listening on http://localhost:${port}`);
// // // // // // // });



// // // // // // import express from "express";
// // // // // // import session from "express-session";
// // // // // // import passport from "passport";
// // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // import dotenv from "dotenv";
// // // // // // import axios from "axios";
// // // // // // import mongoose from "mongoose";
// // // // // // import cors from "cors";
// // // // // // import moment from "moment-timezone";

// // // // // // dotenv.config();
// // // // // // const app = express();
// // // // // // const port = 5000;

// // // // // // // MongoDB Schema for important events
// // // // // // const eventSchema = new mongoose.Schema({
// // // // // //   summary: String,
// // // // // //   start: Object,
// // // // // //   end: Object,
// // // // // //   email: String,
// // // // // //   eventId: String,
// // // // // //   youAreAnAttendee: Boolean,
// // // // // //   status: { type: String, default: "Pending" },
// // // // // //   response: { type: String, default: "None" },
// // // // // // });
// // // // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // // // MongoDB Schema for user settings
// // // // // // const userSettingsSchema = new mongoose.Schema({
// // // // // //   email: { type: String, required: true, unique: true },
// // // // // //   includeWeekends: { type: Boolean, default: false },
// // // // // //   onlyIfInToList: { type: Boolean, default: false },
// // // // // //   alertRange: { type: Number, default: 1 },
// // // // // // });
// // // // // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // // // // Middleware
// // // // // // app.use(express.json());
// // // // // // app.use(
// // // // // //   cors({
// // // // // //     origin: "http://localhost:5173",
// // // // // //     credentials: true,
// // // // // //   })
// // // // // // );
// // // // // // app.use(
// // // // // //   session({
// // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // //     resave: false,
// // // // // //     saveUninitialized: true,
// // // // // //     cookie: { secure: false }, // true for HTTPS in production
// // // // // //   })
// // // // // // );
// // // // // // app.use(passport.initialize());
// // // // // // app.use(passport.session());

// // // // // // // MongoDB Connection
// // // // // // mongoose
// // // // // //   .connect(process.env.MONGODB_URI)
// // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // // Passport Strategy
// // // // // // passport.use(
// // // // // //   new GoogleStrategy(
// // // // // //     {
// // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // //     },
// // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // //       return done(null, { profile, accessToken });
// // // // // //     }
// // // // // //   )
// // // // // // );
// // // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // // Authentication check middleware
// // // // // // function ensureAuth(req, res, next) {
// // // // // //   if (req.user) return next();
// // // // // //   return res.status(401).json({ error: "Not authenticated" });
// // // // // // }

// // // // // // // Google OAuth
// // // // // // app.get(
// // // // // //   "/api/auth",
// // // // // //   passport.authenticate("google", {
// // // // // //     scope: [
// // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // //       "openid",
// // // // // //     ],
// // // // // //     accessType: "offline",
// // // // // //     prompt: "consent",
// // // // // //   })
// // // // // // );
// // // // // // app.get(
// // // // // //   "/api/auth/callback",
// // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // //   (req, res) => {
// // // // // //     res.redirect("http://localhost:5173");
// // // // // //   }
// // // // // // );
// // // // // // app.get("/api/user", (req, res) => {
// // // // // //   res.json({ authenticated: !!req.user });
// // // // // // });

// // // // // // // 🔧 Fixed: Timezone-aware all-events API
// // // // // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const accessToken = req.user.accessToken;
// // // // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // // // // //     // Timezone-aware start and end of day (Asia/Kolkata)
// // // // // //     const todayStart = moment.tz("Asia/Kolkata").startOf("day").toISOString();
// // // // // //     const todayEnd = moment.tz("Asia/Kolkata").endOf("day").toISOString();

// // // // // //     const response = await axios.get(
// // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // //       {
// // // // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // // // //         params: {
// // // // // //           timeMin: todayStart,
// // // // // //           timeMax: todayEnd,
// // // // // //           singleEvents: true,
// // // // // //           orderBy: "startTime",
// // // // // //         },
// // // // // //       }
// // // // // //     );

// // // // // //     const events = response.data.items || [];

// // // // // //     const importantEvents = events.filter((event) => {
// // // // // //       const summary = (event.summary || "").toLowerCase();

// // // // // //       const startDateTime = event.start?.dateTime || null;
// // // // // //       if (!startDateTime) return false;

// // // // // //       const eventStart = new Date(startDateTime);
// // // // // //       const startHour = eventStart.getHours();

// // // // // //       // Exclude working hours
// // // // // //       const outsideWorkingHours = startHour < 9 || startHour >= 17;

// // // // // //       const attendees = event.attendees || [];
// // // // // //       const youAreAnAttendee = attendees.some(
// // // // // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // //       );

// // // // // //       const isImportant =
// // // // // //         summary.includes("urgent") ||
// // // // // //         summary.includes("important") ||
// // // // // //         youAreAnAttendee;

// // // // // //       return outsideWorkingHours && isImportant;
// // // // // //     });

// // // // // //     // Remove old entries for this user
// // // // // //     await ImportantEvent.deleteMany({ email: userEmail });

// // // // // //     // Save filtered important events
// // // // // //     await Promise.all(
// // // // // //       importantEvents.map((event) => {
// // // // // //         const youAreAnAttendee = (event.attendees || []).some(
// // // // // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // // // // //         );
// // // // // //         return new ImportantEvent({
// // // // // //           summary: event.summary,
// // // // // //           start: event.start,
// // // // // //           end: event.end,
// // // // // //           email: userEmail,
// // // // // //           eventId: event.id,
// // // // // //           youAreAnAttendee,
// // // // // //         }).save();
// // // // // //       })
// // // // // //     );

// // // // // //     res.json(events);
// // // // // //   } catch (error) {
// // // // // //     console.error("❌ Error fetching events:", error.response?.data || error.message);
// // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // //   }
// // // // // // });

// // // // // // // Get filtered important events
// // // // // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     const events = await ImportantEvent.find({ email });
// // // // // //     res.json(events);
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ error: "Failed to fetch important events" });
// // // // // //   }
// // // // // // });

// // // // // // // User settings: GET and POST
// // // // // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     let settings = await UserSettings.findOne({ email });
// // // // // //     if (!settings) {
// // // // // //       settings = {
// // // // // //         includeWeekends: false,
// // // // // //         onlyIfInToList: false,
// // // // // //         alertRange: 1,
// // // // // //       };
// // // // // //     }
// // // // // //     res.json(settings);
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // // // // //   }
// // // // // // });
// // // // // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // // // // //     const settings = await UserSettings.findOneAndUpdate(
// // // // // //       { email },
// // // // // //       { includeWeekends, onlyIfInToList, alertRange },
// // // // // //       { new: true, upsert: true }
// // // // // //     );

// // // // // //     res.json(settings);
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ error: "Failed to save user settings" });
// // // // // //   }
// // // // // // });

// // // // // // // ** NEW: Save a new important event **
// // // // // // app.post("/api/important-events", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     const { summary, start, end, eventId, youAreAnAttendee } = req.body;

// // // // // //     // Basic validation
// // // // // //     if (!summary || !start || !end || !eventId) {
// // // // // //       return res.status(400).json({ error: "Missing required fields" });
// // // // // //     }

// // // // // //     // Check if event already exists for this user and eventId
// // // // // //     const existing = await ImportantEvent.findOne({ email, eventId });
// // // // // //     if (existing) {
// // // // // //       return res.status(409).json({ error: "Event already saved" });
// // // // // //     }

// // // // // //     const newEvent = new ImportantEvent({
// // // // // //       summary,
// // // // // //       start,
// // // // // //       end,
// // // // // //       email,
// // // // // //       eventId,
// // // // // //       youAreAnAttendee: !!youAreAnAttendee,
// // // // // //     });

// // // // // //     await newEvent.save();
// // // // // //     res.status(201).json(newEvent);
// // // // // //   } catch (error) {
// // // // // //     console.error("❌ Failed to save event:", error);
// // // // // //     res.status(500).json({ error: "Failed to save event" });
// // // // // //   }
// // // // // // });

// // // // // // // Update event status/response
// // // // // // app.patch("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     const { status, response } = req.body;
// // // // // //     const event = await ImportantEvent.findOne({ _id: req.params.id, email });
// // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // // // //     if (status) event.status = status;
// // // // // //     if (response) event.response = response;

// // // // // //     await event.save();
// // // // // //     res.json(event);
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ error: "Failed to update event" });
// // // // // //   }
// // // // // // });

// // // // // // // Delete an event
// // // // // // app.delete("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // // //   try {
// // // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // // //     const event = await ImportantEvent.findOneAndDelete({
// // // // // //       _id: req.params.id,
// // // // // //       email,
// // // // // //     });
// // // // // //     if (!event) return res.status(404).json({ error: "Event not found" });
// // // // // //     res.json({ message: "Event deleted" });
// // // // // //   } catch (error) {
// // // // // //     res.status(500).json({ error: "Failed to delete event" });
// // // // // //   }
// // // // // // });

// // // // // // app.listen(port, () => {
// // // // // //   console.log(`🚀 Server listening on http://localhost:${port}`);
// // // // // // });




// // // // // import express from "express";
// // // // // import session from "express-session";
// // // // // import passport from "passport";
// // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // import dotenv from "dotenv";
// // // // // import axios from "axios";
// // // // // import mongoose from "mongoose";
// // // // // import cors from "cors";
// // // // // import moment from "moment-timezone";

// // // // // dotenv.config();
// // // // // const app = express();
// // // // // const port = 5000;

// // // // // // MongoDB Schema for important events
// // // // // const eventSchema = new mongoose.Schema({
// // // // //   summary: String,
// // // // //   start: Object,
// // // // //   end: Object,
// // // // //   email: String,
// // // // //   eventId: String,
// // // // //   youAreAnAttendee: Boolean,
// // // // //   status: { type: String, default: "Pending" },
// // // // //   response: { type: String, default: "None" },
// // // // // });
// // // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // // MongoDB Schema for user settings
// // // // // const userSettingsSchema = new mongoose.Schema({
// // // // //   email: { type: String, required: true, unique: true },
// // // // //   includeWeekends: { type: Boolean, default: false },
// // // // //   onlyIfInToList: { type: Boolean, default: false },
// // // // //   alertRange: { type: Number, default: 8 }, // Changed default to 8 (working hours)
// // // // // });
// // // // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // // // Middleware
// // // // // app.use(express.json());
// // // // // app.use(
// // // // //   cors({
// // // // //     origin: "http://localhost:5173",
// // // // //     credentials: true,
// // // // //   })
// // // // // );
// // // // // app.use(
// // // // //   session({
// // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // //     resave: false,
// // // // //     saveUninitialized: true,
// // // // //     cookie: { secure: false }, // true for HTTPS in production
// // // // //   })
// // // // // );
// // // // // app.use(passport.initialize());
// // // // // app.use(passport.session());

// // // // // // MongoDB Connection
// // // // // mongoose
// // // // //   .connect(process.env.MONGODB_URI)
// // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // Passport Strategy
// // // // // passport.use(
// // // // //   new GoogleStrategy(
// // // // //     {
// // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // //     },
// // // // //     (accessToken, refreshToken, profile, done) => {
// // // // //       return done(null, { profile, accessToken });
// // // // //     }
// // // // //   )
// // // // // );
// // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // Authentication check middleware
// // // // // function ensureAuth(req, res, next) {
// // // // //   if (req.user) return next();
// // // // //   return res.status(401).json({ error: "Not authenticated" });
// // // // // }

// // // // // // Google OAuth
// // // // // app.get(
// // // // //   "/api/auth",
// // // // //   passport.authenticate("google", {
// // // // //     scope: [
// // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // //       "openid",
// // // // //     ],
// // // // //     accessType: "offline",
// // // // //     prompt: "consent",
// // // // //   })
// // // // // );
// // // // // app.get(
// // // // //   "/api/auth/callback",
// // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // //   (req, res) => {
// // // // //     res.redirect("http://localhost:5173");
// // // // //   }
// // // // // );
// // // // // app.get("/api/user", (req, res) => {
// // // // //   res.json({ authenticated: !!req.user });
// // // // // });

// // // // // // 🔧 Edited: Timezone-aware all-events API with user settings alertRange filtering
// // // // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const accessToken = req.user.accessToken;
// // // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // // // //     // Get user settings from DB
// // // // //     const userSettings = await UserSettings.findOne({ email: userEmail });

// // // // //     // Default alertRange to 8 if not set
// // // // //     const alertRange = userSettings?.alertRange || 8;

// // // // //     // Define working hours start (9 AM) and end (9 AM + alertRange)
// // // // //     const WORK_START_HOUR = 9;
// // // // //     const WORK_END_HOUR = WORK_START_HOUR + alertRange;

// // // // //     // Timezone-aware start and end of day (Asia/Kolkata)
// // // // //     const todayStart = moment.tz("Asia/Kolkata").startOf("day").toISOString();
// // // // //     const todayEnd = moment.tz("Asia/Kolkata").endOf("day").toISOString();

// // // // //     const response = await axios.get(
// // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // //       {
// // // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // // //         params: {
// // // // //           timeMin: todayStart,
// // // // //           timeMax: todayEnd,
// // // // //           singleEvents: true,
// // // // //           orderBy: "startTime",
// // // // //         },
// // // // //       }
// // // // //     );

// // // // //     const events = response.data.items || [];

// // // // //     const importantEvents = events.filter((event) => {
// // // // //       const summary = (event.summary || "").toLowerCase();

// // // // //       const startDateTime = event.start?.dateTime || null;
// // // // //       if (!startDateTime) return false;

// // // // //       const eventStart = new Date(startDateTime);
// // // // //       const startHour = eventStart.getHours();

// // // // //       // Now **INCLUDE** events only if they are within working hours range
// // // // //       const withinWorkingHours = startHour >= WORK_START_HOUR && startHour < WORK_END_HOUR;

// // // // //       const attendees = event.attendees || [];
// // // // //       const youAreAnAttendee = attendees.some(
// // // // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // // // //       );

// // // // //       const isImportant =
// // // // //         summary.includes("urgent") ||
// // // // //         summary.includes("important") ||
// // // // //         youAreAnAttendee;

// // // // //       return withinWorkingHours && isImportant;
// // // // //     });

// // // // //     // Remove old entries for this user
// // // // //     await ImportantEvent.deleteMany({ email: userEmail });

// // // // //     // Save filtered important events
// // // // //     await Promise.all(
// // // // //       importantEvents.map((event) => {
// // // // //         const youAreAnAttendee = (event.attendees || []).some(
// // // // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // // // //         );
// // // // //         return new ImportantEvent({
// // // // //           summary: event.summary,
// // // // //           start: event.start,
// // // // //           end: event.end,
// // // // //           email: userEmail,
// // // // //           eventId: event.id,
// // // // //           youAreAnAttendee,
// // // // //         }).save();
// // // // //       })
// // // // //     );

// // // // //     res.json(events);
// // // // //   } catch (error) {
// // // // //     console.error("❌ Error fetching events:", error.response?.data || error.message);
// // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // //   }
// // // // // });

// // // // // // Get filtered important events
// // // // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     const events = await ImportantEvent.find({ email });
// // // // //     res.json(events);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ error: "Failed to fetch important events" });
// // // // //   }
// // // // // });

// // // // // // User settings: GET and POST
// // // // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     let settings = await UserSettings.findOne({ email });
// // // // //     if (!settings) {
// // // // //       settings = {
// // // // //         includeWeekends: false,
// // // // //         onlyIfInToList: false,
// // // // //         alertRange: 8,
// // // // //       };
// // // // //     }
// // // // //     res.json(settings);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // // // //   }
// // // // // });
// // // // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // // // //     const settings = await UserSettings.findOneAndUpdate(
// // // // //       { email },
// // // // //       { includeWeekends, onlyIfInToList, alertRange },
// // // // //       { new: true, upsert: true }
// // // // //     );

// // // // //     res.json(settings);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ error: "Failed to save user settings" });
// // // // //   }
// // // // // });

// // // // // // ** NEW: Save a new important event **
// // // // // app.post("/api/important-events", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     const { summary, start, end, eventId, youAreAnAttendee } = req.body;

// // // // //     // Basic validation
// // // // //     if (!summary || !start || !end || !eventId) {
// // // // //       return res.status(400).json({ error: "Missing required fields" });
// // // // //     }

// // // // //     // Check if event already exists for this user and eventId
// // // // //     const existing = await ImportantEvent.findOne({ email, eventId });
// // // // //     if (existing) {
// // // // //       return res.status(409).json({ error: "Event already saved" });
// // // // //     }

// // // // //     const newEvent = new ImportantEvent({
// // // // //       summary,
// // // // //       start,
// // // // //       end,
// // // // //       email,
// // // // //       eventId,
// // // // //       youAreAnAttendee: !!youAreAnAttendee,
// // // // //     });

// // // // //     await newEvent.save();
// // // // //     res.status(201).json(newEvent);
// // // // //   } catch (error) {
// // // // //     console.error("❌ Failed to save event:", error);
// // // // //     res.status(500).json({ error: "Failed to save event" });
// // // // //   }
// // // // // });

// // // // // // Update event status/response
// // // // // app.patch("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     const { status, response } = req.body;
// // // // //     const event = await ImportantEvent.findOne({ _id: req.params.id, email });
// // // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // // //     if (status) event.status = status;
// // // // //     if (response) event.response = response;

// // // // //     await event.save();
// // // // //     res.json(event);
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ error: "Failed to update event" });
// // // // //   }
// // // // // });

// // // // // // Delete an event
// // // // // app.delete("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // // //   try {
// // // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // // //     const event = await ImportantEvent.findOneAndDelete({
// // // // //       _id: req.params.id,
// // // // //       email,
// // // // //     });
// // // // //     if (!event) return res.status(404).json({ error: "Event not found" });
// // // // //     res.json({ message: "Event deleted" });
// // // // //   } catch (error) {
// // // // //     res.status(500).json({ error: "Failed to delete event" });
// // // // //   }
// // // // // });

// // // // // app.listen(port, () => {
// // // // //   console.log(`🚀 Server listening on http://localhost:${port}`);
// // // // // });






// // // // import express from "express";
// // // // import session from "express-session";
// // // // import passport from "passport";
// // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // import dotenv from "dotenv";
// // // // import axios from "axios";
// // // // import mongoose from "mongoose";
// // // // import cors from "cors";
// // // // import moment from "moment-timezone";

// // // // dotenv.config();
// // // // const app = express();
// // // // const port = 5000;

// // // // // MongoDB Schema for important events
// // // // const eventSchema = new mongoose.Schema({
// // // //   summary: String,
// // // //   start: Object,
// // // //   end: Object,
// // // //   email: String,
// // // //   eventId: String,
// // // //   youAreAnAttendee: Boolean,
// // // //   status: { type: String, default: "Pending" },
// // // //   response: { type: String, default: "None" },
// // // // });
// // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // MongoDB Schema for user settings
// // // // const userSettingsSchema = new mongoose.Schema({
// // // //   email: { type: String, required: true, unique: true },
// // // //   includeWeekends: { type: Boolean, default: false },
// // // //   onlyIfInToList: { type: Boolean, default: false },
// // // //   alertRange: { type: Number, default: 7 }, // Set default alert range to 7 as you requested
// // // // });
// // // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // // Middleware
// // // // app.use(express.json());
// // // // app.use(
// // // //   cors({
// // // //     origin: "http://localhost:5173",
// // // //     credentials: true,
// // // //   })
// // // // );
// // // // app.use(
// // // //   session({
// // // //     secret: process.env.SESSION_SECRET || "secret",
// // // //     resave: false,
// // // //     saveUninitialized: true,
// // // //     cookie: { secure: false }, // true for HTTPS in production
// // // //   })
// // // // );
// // // // app.use(passport.initialize());
// // // // app.use(passport.session());

// // // // // MongoDB Connection
// // // // mongoose
// // // //   .connect(process.env.MONGODB_URI)
// // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // Passport Strategy
// // // // passport.use(
// // // //   new GoogleStrategy(
// // // //     {
// // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // //     },
// // // //     (accessToken, refreshToken, profile, done) => {
// // // //       return done(null, { profile, accessToken });
// // // //     }
// // // //   )
// // // // );
// // // // passport.serializeUser((user, done) => done(null, user));
// // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // Authentication check middleware
// // // // function ensureAuth(req, res, next) {
// // // //   if (req.user) return next();
// // // //   return res.status(401).json({ error: "Not authenticated" });
// // // // }

// // // // // Google OAuth
// // // // app.get(
// // // //   "/api/auth",
// // // //   passport.authenticate("google", {
// // // //     scope: [
// // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // //       "openid",
// // // //     ],
// // // //     accessType: "offline",
// // // //     prompt: "consent",
// // // //   })
// // // // );
// // // // app.get(
// // // //   "/api/auth/callback",
// // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // //   (req, res) => {
// // // //     res.redirect("http://localhost:5173");
// // // //   }
// // // // );
// // // // app.get("/api/user", (req, res) => {
// // // //   res.json({ authenticated: !!req.user });
// // // // });

// // // // // Updated /api/all-events with alert range filtering based on working hours 9-17 and 7 hour alert
// // // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const accessToken = req.user.accessToken;
// // // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // // //     // Get user settings from DB, default alertRange = 7 if not set
// // // //     const userSettings = await UserSettings.findOne({ email: userEmail });
// // // //     const alertRange = userSettings?.alertRange || 7;

// // // //     // Constants
// // // //     const WORK_START_HOUR = 9; // 9 AM
// // // //     const WORK_END_HOUR = 17;  // 5 PM

// // // //     // Calculate alert ranges:
// // // //     // Before working hours: from (WORK_START_HOUR - alertRange) to WORK_START_HOUR
// // // //     // After working hours: from WORK_END_HOUR to (WORK_END_HOUR + alertRange)
// // // //     // Cap after working hours max to 24 (midnight)
// // // //     const alertStartBefore = WORK_START_HOUR - alertRange; // e.g. 9 - 7 = 2 AM
// // // //     const alertEndAfter = Math.min(WORK_END_HOUR + alertRange, 24); // e.g. 17 + 7 = 24 capped at 24

// // // //     // Get today start and end in timezone Asia/Kolkata
// // // //     const todayStart = moment.tz("Asia/Kolkata").startOf("day").toISOString();
// // // //     const todayEnd = moment.tz("Asia/Kolkata").endOf("day").toISOString();

// // // //     // Fetch events from Google Calendar
// // // //     const response = await axios.get(
// // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // //       {
// // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // //         params: {
// // // //           timeMin: todayStart,
// // // //           timeMax: todayEnd,
// // // //           singleEvents: true,
// // // //           orderBy: "startTime",
// // // //         },
// // // //       }
// // // //     );

// // // //     const events = response.data.items || [];

// // // //     const importantEvents = events.filter((event) => {
// // // //       const summary = (event.summary || "").toLowerCase();

// // // //       const startDateTime = event.start?.dateTime || null;
// // // //       if (!startDateTime) return false;

// // // //       const eventStart = new Date(startDateTime);
// // // //       const startHour = eventStart.getHours();

// // // //       // Determine if event start is within the alert range outside working hours:
// // // //       // Condition:
// // // //       // (startHour >= alertStartBefore && startHour < WORK_START_HOUR) OR
// // // //       // (startHour >= WORK_END_HOUR && startHour < alertEndAfter)
// // // //       const isWithinAlertRangeBefore = startHour >= alertStartBefore && startHour < WORK_START_HOUR;
// // // //       const isWithinAlertRangeAfter = startHour >= WORK_END_HOUR && startHour < alertEndAfter;

// // // //       // We want events only in these alert ranges
// // // //       if (!(isWithinAlertRangeBefore || isWithinAlertRangeAfter)) return false;

// // // //       // Check if user is an attendee
// // // //       const attendees = event.attendees || [];
// // // //       const youAreAnAttendee = attendees.some(
// // // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // // //       );

// // // //       // Filter by importance: urgent, important, or user is attendee
// // // //       const isImportant =
// // // //         summary.includes("urgent") ||
// // // //         summary.includes("important") ||
// // // //         youAreAnAttendee;

// // // //       return isImportant;
// // // //     });

// // // //     // Remove old entries for this user
// // // //     await ImportantEvent.deleteMany({ email: userEmail });

// // // //     // Save filtered important events
// // // //     await Promise.all(
// // // //       importantEvents.map((event) => {
// // // //         const youAreAnAttendee = (event.attendees || []).some(
// // // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // // //         );
// // // //         return new ImportantEvent({
// // // //           summary: event.summary,
// // // //           start: event.start,
// // // //           end: event.end,
// // // //           email: userEmail,
// // // //           eventId: event.id,
// // // //           youAreAnAttendee,
// // // //         }).save();
// // // //       })
// // // //     );

// // // //     res.json(events);
// // // //   } catch (error) {
// // // //     console.error("❌ Error fetching events:", error.response?.data || error.message);
// // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // //   }
// // // // });

// // // // // Other routes (unchanged) ...

// // // // // Get filtered important events
// // // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     const events = await ImportantEvent.find({ email });
// // // //     res.json(events);
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Failed to fetch important events" });
// // // //   }
// // // // });

// // // // // User settings: GET and POST
// // // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     let settings = await UserSettings.findOne({ email });
// // // //     if (!settings) {
// // // //       settings = {
// // // //         includeWeekends: false,
// // // //         onlyIfInToList: false,
// // // //         alertRange: 7,
// // // //       };
// // // //     }
// // // //     res.json(settings);
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // // //   }
// // // // });
// // // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // // //     const settings = await UserSettings.findOneAndUpdate(
// // // //       { email },
// // // //       { includeWeekends, onlyIfInToList, alertRange },
// // // //       { new: true, upsert: true }
// // // //     );

// // // //     res.json(settings);
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Failed to save user settings" });
// // // //   }
// // // // });

// // // // // Save a new important event
// // // // app.post("/api/important-events", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     const { summary, start, end, eventId, youAreAnAttendee } = req.body;

// // // //     if (!summary || !start || !end || !eventId) {
// // // //       return res.status(400).json({ error: "Missing required fields" });
// // // //     }

// // // //     const existing = await ImportantEvent.findOne({ email, eventId });
// // // //     if (existing) {
// // // //       return res.status(409).json({ error: "Event already saved" });
// // // //     }

// // // //     const newEvent = new ImportantEvent({
// // // //       summary,
// // // //       start,
// // // //       end,
// // // //       email,
// // // //       eventId,
// // // //       youAreAnAttendee: !!youAreAnAttendee,
// // // //     });

// // // //     await newEvent.save();
// // // //     res.status(201).json(newEvent);
// // // //   } catch (error) {
// // // //     console.error("❌ Failed to save event:", error);
// // // //     res.status(500).json({ error: "Failed to save event" });
// // // //   }
// // // // });

// // // // // Update event status/response
// // // // app.patch("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     const { status, response } = req.body;
// // // //     const event = await ImportantEvent.findOne({ _id: req.params.id, email });
// // // //     if (!event) return res.status(404).json({ error: "Event not found" });

// // // //     if (status) event.status = status;
// // // //     if (response) event.response = response;

// // // //     await event.save();
// // // //     res.json(event);
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Failed to update event" });
// // // //   }
// // // // });

// // // // // Delete an event
// // // // app.delete("/api/important-events/:id", ensureAuth, async (req, res) => {
// // // //   try {
// // // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // // //     const event = await ImportantEvent.findOneAndDelete({
// // // //       _id: req.params.id,
// // // //       email,
// // // //     });
// // // //     if (!event) return res.status(404).json({ error: "Event not found" });
// // // //     res.json({ message: "Event deleted" });
// // // //   } catch (error) {
// // // //     res.status(500).json({ error: "Failed to delete event" });
// // // //   }
// // // // });

// // // // app.listen(port, () => {
// // // //   console.log(`🚀 Server running on http://localhost:${port}`);
// // // // });




// // // import express from "express";
// // // import session from "express-session";
// // // import passport from "passport";
// // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // import dotenv from "dotenv";
// // // import axios from "axios";
// // // import mongoose from "mongoose";
// // // import cors from "cors";
// // // import moment from "moment-timezone";

// // // dotenv.config();
// // // const app = express();
// // // const port = 5000;

// // // // MongoDB Schemas
// // // const eventSchema = new mongoose.Schema({
// // //   summary: String,
// // //   start: Object,
// // //   end: Object,
// // //   email: String,
// // //   eventId: String,
// // //   youAreAnAttendee: Boolean,
// // //   status: { type: String, default: "Pending" },
// // //   response: { type: String, default: "None" },
// // // });
// // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // const userSettingsSchema = new mongoose.Schema({
// // //   email: { type: String, required: true, unique: true },
// // //   includeWeekends: { type: Boolean, default: false },
// // //   onlyIfInToList: { type: Boolean, default: false },
// // //   alertRange: { type: Number, default: 7 }, // User can update this anytime
// // // });
// // // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // // Middleware setup
// // // app.use(express.json());
// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:5173", // Your frontend origin
// // //     credentials: true,
// // //   })
// // // );
// // // app.use(
// // //   session({
// // //     secret: process.env.SESSION_SECRET || "secret",
// // //     resave: false,
// // //     saveUninitialized: true,
// // //     cookie: { secure: false },
// // //   })
// // // );
// // // app.use(passport.initialize());
// // // app.use(passport.session());

// // // // MongoDB connection
// // // mongoose
// // //   .connect(process.env.MONGODB_URI)
// // //   .then(() => console.log("✅ Connected to MongoDB"))
// // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // Passport Google OAuth setup
// // // passport.use(
// // //   new GoogleStrategy(
// // //     {
// // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // //     },
// // //     (accessToken, refreshToken, profile, done) => {
// // //       return done(null, { profile, accessToken });
// // //     }
// // //   )
// // // );
// // // passport.serializeUser((user, done) => done(null, user));
// // // passport.deserializeUser((user, done) => done(null, user));

// // // // Auth middleware
// // // function ensureAuth(req, res, next) {
// // //   if (req.user) return next();
// // //   res.status(401).json({ error: "Not authenticated" });
// // // }

// // // // Routes for Google OAuth
// // // app.get(
// // //   "/api/auth",
// // //   passport.authenticate("google", {
// // //     scope: [
// // //       "https://www.googleapis.com/auth/calendar.readonly",
// // //       "https://www.googleapis.com/auth/userinfo.email",
// // //       "openid",
// // //     ],
// // //     accessType: "offline",
// // //     prompt: "consent",
// // //   })
// // // );

// // // app.get(
// // //   "/api/auth/callback",
// // //   passport.authenticate("google", { failureRedirect: "/" }),
// // //   (req, res) => {
// // //     res.redirect("http://localhost:5173");
// // //   }
// // // );

// // // app.get("/api/user", (req, res) => {
// // //   res.json({ authenticated: !!req.user });
// // // });

// // // // Utility: Get start and end of today in Asia/Kolkata timezone (ISO strings)
// // // function getTodayRange() {
// // //   const start = moment.tz("Asia/Kolkata").startOf("day").toISOString();
// // //   const end = moment.tz("Asia/Kolkata").endOf("day").toISOString();
// // //   return { start, end };
// // // }

// // // // Main endpoint: fetch all events and save filtered important ones based on user's alert range
// // // app.get("/api/all-events", ensureAuth, async (req, res) => {
// // //   try {
// // //     const accessToken = req.user.accessToken;
// // //     const userEmail = req.user.profile.emails[0].value.toLowerCase();

// // //     // Fetch user settings from DB, default alertRange to 7 if missing
// // //     const userSettings = await UserSettings.findOne({ email: userEmail });
// // //     const alertRange = userSettings?.alertRange ?? 7;

// // //     const WORK_START_HOUR = 9; // 9 AM
// // //     const WORK_END_HOUR = 17;  // 5 PM

// // //     // Calculate alert ranges
// // //     const alertStartBefore = WORK_START_HOUR - alertRange; // e.g. 2 if alertRange=7
// // //     const alertEndAfter = Math.min(WORK_END_HOUR + alertRange, 24); // capped at 24

// // //     const { start: todayStart, end: todayEnd } = getTodayRange();

// // //     // Fetch events from Google Calendar API
// // //     const response = await axios.get(
// // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // //       {
// // //         headers: { Authorization: `Bearer ${accessToken}` },
// // //         params: {
// // //           timeMin: todayStart,
// // //           timeMax: todayEnd,
// // //           singleEvents: true,
// // //           orderBy: "startTime",
// // //         },
// // //       }
// // //     );

// // //     const events = response.data.items || [];

// // //     // Filter important events according to your rules
// // //     const importantEvents = events.filter((event) => {
// // //       const summary = (event.summary || "").toLowerCase();

// // //       const startDateTime = event.start?.dateTime;
// // //       if (!startDateTime) return false;

// // //       const eventStart = new Date(startDateTime);
// // //       const startHour = eventStart.getHours();

// // //       // Check if event is in alert range outside working hours
// // //       const beforeWork = startHour >= alertStartBefore && startHour < WORK_START_HOUR;
// // //       const afterWork = startHour >= WORK_END_HOUR && startHour < alertEndAfter;
// // //       if (!(beforeWork || afterWork)) return false;

// // //       // Check if user is an attendee
// // //       const attendees = event.attendees || [];
// // //       const youAreAnAttendee = attendees.some(
// // //         (a) => a.email && a.email.toLowerCase() === userEmail
// // //       );

// // //       // Only keep if contains 'urgent', 'important' or user is an attendee
// // //       return summary.includes("urgent") || summary.includes("important") || youAreAnAttendee;
// // //     });

// // //     // Clear old important events for user
// // //     await ImportantEvent.deleteMany({ email: userEmail });

// // //     // Save filtered important events to DB
// // //     await Promise.all(
// // //       importantEvents.map((event) => {
// // //         const youAreAnAttendee = (event.attendees || []).some(
// // //           (a) => a.email && a.email.toLowerCase() === userEmail
// // //         );
// // //         return new ImportantEvent({
// // //           summary: event.summary,
// // //           start: event.start,
// // //           end: event.end,
// // //           email: userEmail,
// // //           eventId: event.id,
// // //           youAreAnAttendee,
// // //         }).save();
// // //       })
// // //     );

// // //     // Return all events (not just filtered)
// // //     res.json(events);
// // //   } catch (error) {
// // //     console.error("Error fetching events:", error.response?.data || error.message);
// // //     res.status(500).json({ error: "Failed to fetch events" });
// // //   }
// // // });

// // // // Endpoint to get important events saved in MongoDB
// // // app.get("/api/important-events", ensureAuth, async (req, res) => {
// // //   try {
// // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // //     const events = await ImportantEvent.find({ email });
// // //     res.json(events);
// // //   } catch (error) {
// // //     res.status(500).json({ error: "Failed to fetch important events" });
// // //   }
// // // });

// // // // Get user settings
// // // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// // //   try {
// // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // //     let settings = await UserSettings.findOne({ email });
// // //     if (!settings) {
// // //       settings = {
// // //         includeWeekends: false,
// // //         onlyIfInToList: false,
// // //         alertRange: 7,
// // //       };
// // //     }
// // //     res.json(settings);
// // //   } catch (error) {
// // //     res.status(500).json({ error: "Failed to fetch user settings" });
// // //   }
// // // });

// // // // Update user settings (including alertRange)
// // // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// // //   try {
// // //     const email = req.user.profile.emails[0].value.toLowerCase();
// // //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// // //     const settings = await UserSettings.findOneAndUpdate(
// // //       { email },
// // //       { includeWeekends, onlyIfInToList, alertRange },
// // //       { new: true, upsert: true }
// // //     );

// // //     res.json(settings);
// // //   } catch (error) {
// // //     res.status(500).json({ error: "Failed to save user settings" });
// // //   }
// // // });

// // // // Start server
// // // app.listen(port, () => {
// // //   console.log(`🚀 Server running on http://localhost:${port}`);
// // // });




// // import express from "express";
// // import session from "express-session";
// // import passport from "passport";
// // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // import dotenv from "dotenv";
// // import axios from "axios";
// // import mongoose from "mongoose";
// // import cors from "cors";
// // import moment from "moment-timezone";

// // dotenv.config();
// // const app = express();
// // const port = 5000;

// // // MongoDB Schemas
// // const eventSchema = new mongoose.Schema({
// //   summary: String,
// //   start: Object,
// //   end: Object,
// //   email: String,
// //   eventId: String,
// //   youAreAnAttendee: Boolean,
// //   status: { type: String, default: "Pending" },
// //   response: { type: String, default: "None" },
// // });
// // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // const userSettingsSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true },
// //   includeWeekends: { type: Boolean, default: false },
// //   onlyIfInToList: { type: Boolean, default: false },
// //   alertRange: { type: Number, default: 7 },
// // });
// // const UserSettings = mongoose.model("UserSettings", userSettingsSchema);

// // // Middleware setup
// // app.use(express.json());
// // app.use(
// //   cors({
// //     origin: "http://localhost:5173", // Your frontend origin
// //     credentials: true,
// //   })
// // );
// // app.use(
// //   session({
// //     secret: process.env.SESSION_SECRET || "secret",
// //     resave: false,
// //     saveUninitialized: true,
// //     cookie: { secure: false },
// //   })
// // );
// // app.use(passport.initialize());
// // app.use(passport.session());

// // // MongoDB connection
// // mongoose
// //   .connect(process.env.MONGODB_URI)
// //   .then(() => console.log("✅ Connected to MongoDB"))
// //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // Passport Google OAuth setup
// // passport.use(
// //   new GoogleStrategy(
// //     {
// //       clientID: process.env.GOOGLE_CLIENT_ID,
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// //       callbackURL: "http://localhost:5000/api/auth/callback",
// //     },
// //     (accessToken, refreshToken, profile, done) => {
// //       return done(null, { profile, accessToken });
// //     }
// //   )
// // );
// // passport.serializeUser((user, done) => done(null, user));
// // passport.deserializeUser((user, done) => done(null, user));

// // // Auth middleware
// // function ensureAuth(req, res, next) {
// //   if (req.user) return next();
// //   res.status(401).json({ error: "Not authenticated" });
// // }

// // // Routes for Google OAuth
// // app.get(
// //   "/api/auth",
// //   passport.authenticate("google", {
// //     scope: [
// //       "https://www.googleapis.com/auth/calendar.readonly",
// //       "https://www.googleapis.com/auth/userinfo.email",
// //       "openid",
// //     ],
// //     accessType: "offline",
// //     prompt: "consent",
// //   })
// // );

// // app.get(
// //   "/api/auth/callback",
// //   passport.authenticate("google", { failureRedirect: "/" }),
// //   (req, res) => {
// //     res.redirect("http://localhost:5173");
// //   }
// // );

// // app.get("/api/user", (req, res) => {
// //   res.json({ authenticated: !!req.user });
// // });

// // // Helper: get timeMin param for events from one year ago to 1 year ahead for full coverage
// // function getFullTimeRange() {
// //   const timeMin = moment().subtract(1, "years").toISOString();
// //   const timeMax = moment().add(1, "years").toISOString();
// //   return { timeMin, timeMax };
// // }

// // // New /api/all-events endpoint to fetch all events (no filtering)
// // app.get("/api/all-events", ensureAuth, async (req, res) => {
// //   try {
// //     const accessToken = req.user.accessToken;

// //     // Fetch events over a wide range (e.g. 1 year back to 1 year forward)
// //     const { timeMin, timeMax } = getFullTimeRange();

// //     // Google Calendar API call to fetch all events in the time range
// //     const response = await axios.get(
// //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// //       {
// //         headers: { Authorization: `Bearer ${accessToken}` },
// //         params: {
// //           timeMin,
// //           timeMax,
// //           singleEvents: true,
// //           orderBy: "startTime",
// //           maxResults: 2500, // max allowed by API per request
// //         },
// //       }
// //     );

// //     const events = response.data.items || [];

// //     // Return all events as-is without filtering or saving
// //     res.json(events);
// //   } catch (error) {
// //     console.error("Error fetching events:", error.response?.data || error.message);
// //     res.status(500).json({ error: "Failed to fetch events" });
// //   }
// // });

// // // Keep other endpoints unchanged (important-events, user-settings, etc.)

// // app.get("/api/important-events", ensureAuth, async (req, res) => {
// //   try {
// //     const email = req.user.profile.emails[0].value.toLowerCase();
// //     const events = await ImportantEvent.find({ email });
// //     res.json(events);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch important events" });
// //   }
// // });

// // app.get("/api/user-settings", ensureAuth, async (req, res) => {
// //   try {
// //     const email = req.user.profile.emails[0].value.toLowerCase();
// //     let settings = await UserSettings.findOne({ email });
// //     if (!settings) {
// //       settings = {
// //         includeWeekends: false,
// //         onlyIfInToList: false,
// //         alertRange: 7,
// //       };
// //     }
// //     res.json(settings);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch user settings" });
// //   }
// // });

// // app.post("/api/user-settings", ensureAuth, async (req, res) => {
// //   try {
// //     const email = req.user.profile.emails[0].value.toLowerCase();
// //     const { includeWeekends, onlyIfInToList, alertRange } = req.body;

// //     const settings = await UserSettings.findOneAndUpdate(
// //       { email },
// //       { includeWeekends, onlyIfInToList, alertRange },
// //       { new: true, upsert: true }
// //     );

// //     res.json(settings);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to save user settings" });
// //   }
// // });

// // // Start server
// // app.listen(port, () => {
// //   console.log(`🚀 Server running on http://localhost:${port}`);
// // });




// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import axios from "axios";
// import mongoose from "mongoose";
// import cors from "cors";
// import moment from "moment-timezone";
// import UserSetting from "./models/UserSettings.js";
// import ImportantEvent from "./models/ImportantEvent.js";

// dotenv.config();
// const app = express();
// const port = 5000;

// // Middleware setup
// app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || "secret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Passport Google OAuth setup
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:5000/api/auth/callback",
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, { profile, accessToken });
//     }
//   )
// );
// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// // Auth middleware
// function ensureAuth(req, res, next) {
//   if (req.user) return next();
//   res.status(401).json({ error: "Not authenticated" });
// }

// // OAuth Routes
// app.get(
//   "/api/auth",
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/calendar.readonly",
//       "https://www.googleapis.com/auth/userinfo.email",
//       "openid",
//     ],
//     accessType: "offline",
//     prompt: "consent",
//   })
// );

// app.get(
//   "/api/auth/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("http://localhost:5173");
//   }
// );

// app.get("/api/user", (req, res) => {
//   res.json({ authenticated: !!req.user });
// });

// // Fetch and store all events
// app.get("/api/all-events", ensureAuth, async (req, res) => {
//   try {
//     const today = new Date();
//     const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString();
//     const timeMax = new Date(today.setHours(24, 0, 0, 0)).toISOString();

//     const response = await axios.get(
//       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
//       {
//         headers: {
//           Authorization: `Bearer ${req.user.accessToken}`,
//         },
//         params: {
//           timeMin,
//           timeMax,
//           singleEvents: true,
//           orderBy: "startTime",
//         },
//       }
//     );

//     const events = response.data.items || [];
//     const userEmail = req.user.profile.emails[0].value;
//     await ImportantEvent.deleteMany({ email: userEmail });

//     const importantEvents = events.filter((event) => {
//       const summary = event.summary?.toLowerCase() || "";
//       const attendees = event.attendees?.map((a) => a.email) || [];
//       const isImportant =
//         summary.includes("important") ||
//         summary.includes("urgent") ||
//         summary.includes("attention") ||
//         attendees.includes(userEmail);

//       const startHour = new Date(event.start?.dateTime).getHours();
//       return (
//         isImportant &&
//         event.start?.dateTime &&
//         (startHour < 9 || startHour >= 17)
//       );
//     }).map(event => ({
//       summary: event.summary,
//       start: event.start,
//       end: event.end,
//       email: userEmail,
//       eventId: event.id,
//       youAreAnAttendee: event.attendees?.some((a) => a.email === userEmail),
//       status: "Pending",
//       response: "None",
//     }));

//     await ImportantEvent.insertMany(importantEvents);
//     res.json({ allEvents: events });
//   } catch (err) {
//     console.error("Error fetching events:", err);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

// // Filtered important events
// app.get("/api/important-events", ensureAuth, async (req, res) => {
//   try {
//     const email = req.user.profile.emails[0].value.toLowerCase();
//     const userSetting = await UserSetting.findOne({ email });
//     const alertRange = userSetting?.alertRange || 3;

//     const now = new Date();
//     const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

//     const startBeforeWork = new Date(today);
//     startBeforeWork.setHours(9 - alertRange, 0, 0, 0);
//     const endBeforeWork = new Date(today);
//     endBeforeWork.setHours(9, 0, 0, 0);

//     const startAfterWork = new Date(today);
//     startAfterWork.setHours(17, 0, 0, 0);
//     const endAfterWork = new Date(today);
//     endAfterWork.setHours(17 + alertRange, 0, 0, 0);

//     const events = await ImportantEvent.find({
//       email,
//       $or: [
//         {
//           "start.dateTime": {
//             $gte: startBeforeWork.toISOString(),
//             $lt: endBeforeWork.toISOString(),
//           },
//         },
//         {
//           "start.dateTime": {
//             $gte: startAfterWork.toISOString(),
//             $lt: endAfterWork.toISOString(),
//           },
//         },
//       ],
//     });

//     res.json(events);
//   } catch (error) {
//     console.error("❌ Error fetching important events:", error);
//     res.status(500).json({ error: "Failed to fetch important events" });
//   }
// });

// // PATCH (update) event
// app.patch("/api/:id", ensureAuth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const update = req.body;

//     const updated = await ImportantEvent.findByIdAndUpdate(id, update, {
//       new: true,
//     });

//     if (!updated) {
//       return res.status(404).json({ error: "Event not found" });
//     }

//     res.json(updated);
//   } catch (error) {
//     console.error("❌ Update error:", error.message);
//     res.status(500).json({ error: "Failed to update event" });
//   }
// });

// // DELETE event
// app.delete("/api/:id", ensureAuth, async (req, res) => {
//   try {
//     const deleted = await ImportantEvent.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ error: "Event not found" });
//     }
//     res.json({ message: "Event deleted", id: deleted._id });
//   } catch (error) {
//     console.error("❌ Deletion error:", error.message);
//     res.status(500).json({ error: "Failed to delete event" });
//   }
// });

// app.listen(port, () => {
//   console.log(`🚀 Server running at http://localhost:${port}`);
// });





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
