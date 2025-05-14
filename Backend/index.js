// // // // // // // // // // // // // import express from "express";
// // // // // // // // // // // // // import session from "express-session";
// // // // // // // // // // // // // import passport from "passport";
// // // // // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // // import cors from "cors";

// // // // // // // // // // // // // dotenv.config();

// // // // // // // // // // // // // const app = express();
// // // // // // // // // // // // // const port = 5000;

// // // // // // // // // // // // // app.use(
// // // // // // // // // // // // //   cors({
// // // // // // // // // // // // //     origin: "http://localhost:5173",
// // // // // // // // // // // // //     credentials: true,
// // // // // // // // // // // // //   })
// // // // // // // // // // // // // );

// // // // // // // // // // // // // app.use(
// // // // // // // // // // // // //   session({
// // // // // // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // // // // // //     resave: false,
// // // // // // // // // // // // //     saveUninitialized: true,
// // // // // // // // // // // // //   })
// // // // // // // // // // // // // );

// // // // // // // // // // // // // app.use(passport.initialize());
// // // // // // // // // // // // // app.use(passport.session());

// // // // // // // // // // // // // passport.use(
// // // // // // // // // // // // //   new GoogleStrategy(
// // // // // // // // // // // // //     {
// // // // // // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // // // // // //     },
// // // // // // // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   )
// // // // // // // // // // // // // );

// // // // // // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // // });
// // // // // // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // // });

// // // // // // // // // // // // // app.get(
// // // // // // // // // // // // //   "/api/auth",
// // // // // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // // // // //     scope: [
// // // // // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // // // // // //       "openid",
// // // // // // // // // // // // //     ],
// // // // // // // // // // // // //     accessType: "offline",
// // // // // // // // // // // // //     prompt: "consent",
// // // // // // // // // // // // //   })
// // // // // // // // // // // // // );

// // // // // // // // // // // // // app.get(
// // // // // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // // // // //   (req, res) => {
// // // // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // // // //   }
// // // // // // // // // // // // // );

// // // // // // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // // // // //   try {
// // // // // // // // // // // // //     const response = await axios.get(
// // // // // // // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // // // // // //       {
// // // // // // // // // // // // //         headers: {
// // // // // // // // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //     res.json(response.data);
// // // // // // // // // // // // //   } catch (error) {
// // // // // // // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // // // // // // //   }
// // // // // // // // // // // // // });

// // // // // // // // // // // // // app.listen(port, () => {
// // // // // // // // // // // // //   console.log(`Server running at http://localhost:${port}`);
// // // // // // // // // // // // // });



// // // // // // // // // // // // import express from "express";
// // // // // // // // // // // // import session from "express-session";
// // // // // // // // // // // // import passport from "passport";
// // // // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // import cors from "cors";

// // // // // // // // // // // // dotenv.config();

// // // // // // // // // // // // const app = express();
// // // // // // // // // // // // const port = 5000;

// // // // // // // // // // // // // Middleware
// // // // // // // // // // // // app.use(
// // // // // // // // // // // //   cors({
// // // // // // // // // // // //     origin: "http://localhost:5173",
// // // // // // // // // // // //     credentials: true,
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // app.use(
// // // // // // // // // // // //   session({
// // // // // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // // // // //     resave: false,
// // // // // // // // // // // //     saveUninitialized: true,
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // app.use(passport.initialize());
// // // // // // // // // // // // app.use(passport.session());

// // // // // // // // // // // // // Passport configuration
// // // // // // // // // // // // passport.use(
// // // // // // // // // // // //   new GoogleStrategy(
// // // // // // // // // // // //     {
// // // // // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // // // // //     },
// // // // // // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // // // // //     }
// // // // // // // // // // // //   )
// // // // // // // // // // // // );

// // // // // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // });
// // // // // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // });

// // // // // // // // // // // // // Routes

// // // // // // // // // // // // // 1. Start Google OAuth
// // // // // // // // // // // // app.get(
// // // // // // // // // // // //   "/api/auth",
// // // // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // // // //     scope: [
// // // // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // // // // //       "openid",
// // // // // // // // // // // //     ],
// // // // // // // // // // // //     accessType: "offline",
// // // // // // // // // // // //     prompt: "consent",
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // // 2. OAuth callback
// // // // // // // // // // // // app.get(
// // // // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // // // //   (req, res) => {
// // // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // // //   }
// // // // // // // // // // // // );

// // // // // // // // // // // // // 3. Check authentication
// // // // // // // // // // // // app.get("/api/me", (req, res) => {
// // // // // // // // // // // //   if (req.user) {
// // // // // // // // // // // //     res.json({ authenticated: true, user: req.user.profile });
// // // // // // // // // // // //   } else {
// // // // // // // // // // // //     res.json({ authenticated: false });
// // // // // // // // // // // //   }
// // // // // // // // // // // // });

// // // // // // // // // // // // // 4. Fetch calendar events
// // // // // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // // // //   try {
// // // // // // // // // // // //     const response = await axios.get(
// // // // // // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // // // // //       {
// // // // // // // // // // // //         headers: {
// // // // // // // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // // // // //         },
// // // // // // // // // // // //       }
// // // // // // // // // // // //     );
// // // // // // // // // // // //     res.json(response.data);
// // // // // // // // // // // //   } catch (error) {
// // // // // // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // // // // // //   }
// // // // // // // // // // // // });

// // // // // // // // // // // // // 5. Logout (optional)
// // // // // // // // // // // // app.get("/api/logout", (req, res) => {
// // // // // // // // // // // //   req.logout(() => {
// // // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // // //   });
// // // // // // // // // // // // });

// // // // // // // // // // // // // Start server
// // // // // // // // // // // // app.listen(port, () => {
// // // // // // // // // // // //   console.log(`Server running at http://localhost:${port}`);
// // // // // // // // // // // // });




// // // // // // // // // // // // import express from "express";
// // // // // // // // // // // // import session from "express-session";
// // // // // // // // // // // // import passport from "passport";
// // // // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // import cors from "cors";

// // // // // // // // // // // // dotenv.config();

// // // // // // // // // // // // const app = express();
// // // // // // // // // // // // const port = 5000;

// // // // // // // // // // // // app.use(
// // // // // // // // // // // //   cors({
// // // // // // // // // // // //     origin: "http://localhost:5173",
// // // // // // // // // // // //     credentials: true,
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // app.use(
// // // // // // // // // // // //   session({
// // // // // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // // // // //     resave: false,
// // // // // // // // // // // //     saveUninitialized: true,
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // app.use(passport.initialize());
// // // // // // // // // // // // app.use(passport.session());

// // // // // // // // // // // // passport.use(
// // // // // // // // // // // //   new GoogleStrategy(
// // // // // // // // // // // //     {
// // // // // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // // // // //     },
// // // // // // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // // // // //     }
// // // // // // // // // // // //   )
// // // // // // // // // // // // );

// // // // // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // });
// // // // // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // // // // //   done(null, user);
// // // // // // // // // // // // });

// // // // // // // // // // // // app.get(
// // // // // // // // // // // //   "/api/auth",
// // // // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // // // //     scope: [
// // // // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // // // // //       "openid",
// // // // // // // // // // // //     ],
// // // // // // // // // // // //     accessType: "offline",
// // // // // // // // // // // //     prompt: "consent",
// // // // // // // // // // // //   })
// // // // // // // // // // // // );

// // // // // // // // // // // // app.get(
// // // // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // // // //   (req, res) => {
// // // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // // //   }
// // // // // // // // // // // // );

// // // // // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // // // //   try {
// // // // // // // // // // // //     const response = await axios.get(
// // // // // // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // // // // //       {
// // // // // // // // // // // //         headers: {
// // // // // // // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // // // // //         },
// // // // // // // // // // // //       }
// // // // // // // // // // // //     );
// // // // // // // // // // // //     res.json(response.data);
// // // // // // // // // // // //   } catch (error) {
// // // // // // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // // // // // //   }
// // // // // // // // // // // // });

// // // // // // // // // // // // app.listen(port, () => {
// // // // // // // // // // // //   console.log(`Server running at http://localhost:${port}`);
// // // // // // // // // // // // });



// // // // // // // // // // // import express from "express";
// // // // // // // // // // // import session from "express-session";
// // // // // // // // // // // import passport from "passport";
// // // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // import cors from "cors";

// // // // // // // // // // // dotenv.config();

// // // // // // // // // // // const app = express();
// // // // // // // // // // // const port = 5000;

// // // // // // // // // // // // Middleware
// // // // // // // // // // // app.use(
// // // // // // // // // // //   cors({
// // // // // // // // // // //     origin: "http://localhost:5173",
// // // // // // // // // // //     credentials: true,
// // // // // // // // // // //   })
// // // // // // // // // // // );

// // // // // // // // // // // app.use(
// // // // // // // // // // //   session({
// // // // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // // // //     resave: false,
// // // // // // // // // // //     saveUninitialized: true,
// // // // // // // // // // //   })
// // // // // // // // // // // );

// // // // // // // // // // // app.use(passport.initialize());
// // // // // // // // // // // app.use(passport.session());

// // // // // // // // // // // // Passport configuration
// // // // // // // // // // // passport.use(
// // // // // // // // // // //   new GoogleStrategy(
// // // // // // // // // // //     {
// // // // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // // // //     },
// // // // // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // // // //     }
// // // // // // // // // // //   )
// // // // // // // // // // // );

// // // // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // // // //   done(null, user);
// // // // // // // // // // // });
// // // // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // // // //   done(null, user);
// // // // // // // // // // // });

// // // // // // // // // // // // Routes

// // // // // // // // // // // // 1. Start Google OAuth
// // // // // // // // // // // app.get(
// // // // // // // // // // //   "/api/auth",
// // // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // // //     scope: [
// // // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // // // //       "openid",
// // // // // // // // // // //     ],
// // // // // // // // // // //     accessType: "offline",
// // // // // // // // // // //     prompt: "consent",
// // // // // // // // // // //   })
// // // // // // // // // // // );

// // // // // // // // // // // // 2. OAuth callback
// // // // // // // // // // // app.get(
// // // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // // //   (req, res) => {
// // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // //   }
// // // // // // // // // // // );

// // // // // // // // // // // // 3. Check authentication
// // // // // // // // // // // app.get("/api/me", (req, res) => {
// // // // // // // // // // //   if (req.user) {
// // // // // // // // // // //     res.json({ authenticated: true, user: req.user.profile });
// // // // // // // // // // //   } else {
// // // // // // // // // // //     res.json({ authenticated: false });
// // // // // // // // // // //   }
// // // // // // // // // // // });

// // // // // // // // // // // // 4. Fetch calendar events
// // // // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // // //   try {
// // // // // // // // // // //     const response = await axios.get(
// // // // // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // // // //       {
// // // // // // // // // // //         headers: {
// // // // // // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // // // //         },
// // // // // // // // // // //       }
// // // // // // // // // // //     );
// // // // // // // // // // //     res.json(response.data);
// // // // // // // // // // //   } catch (error) {
// // // // // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // // // // //   }
// // // // // // // // // // // });

// // // // // // // // // // // // 5. Logout (optional)
// // // // // // // // // // // app.get("/api/logout", (req, res) => {
// // // // // // // // // // //   req.logout(() => {
// // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // //   });
// // // // // // // // // // // });

// // // // // // // // // // // // Start server
// // // // // // // // // // // app.listen(port, () => {
// // // // // // // // // // //   console.log(`Server running at http://localhost:${port}`);
// // // // // // // // // // // });




// // // // // // // // // // import express from "express";
// // // // // // // // // // import session from "express-session";
// // // // // // // // // // import passport from "passport";
// // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // import axios from "axios";
// // // // // // // // // // import cors from "cors";
// // // // // // // // // // import mongoose from "mongoose";

// // // // // // // // // // // Load environment variables
// // // // // // // // // // dotenv.config();

// // // // // // // // // // // Connect to MongoDB
// // // // // // // // // // mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/wakemewhen", {
// // // // // // // // // //   useNewUrlParser: true,
// // // // // // // // // //   useUnifiedTopology: true,
// // // // // // // // // // })
// // // // // // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // // // // // //   .catch(err => console.log("❌ Failed to connect to MongoDB:", err));

// // // // // // // // // // // Create Event model
// // // // // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // // // // //   summary: String,
// // // // // // // // // //   start: {
// // // // // // // // // //     dateTime: Date,
// // // // // // // // // //     date: Date
// // // // // // // // // //   },
// // // // // // // // // //   end: {
// // // // // // // // // //     dateTime: Date,
// // // // // // // // // //     date: Date
// // // // // // // // // //   },
// // // // // // // // // // });
// // // // // // // // // // const Event = mongoose.model("Event", eventSchema);

// // // // // // // // // // // Initialize Express app
// // // // // // // // // // const app = express();
// // // // // // // // // // const port = 5000;

// // // // // // // // // // // Enable CORS
// // // // // // // // // // app.use(
// // // // // // // // // //   cors({
// // // // // // // // // //     origin: "http://localhost:5173", // frontend URL
// // // // // // // // // //     credentials: true,
// // // // // // // // // //   })
// // // // // // // // // // );

// // // // // // // // // // // Use sessions to track authentication
// // // // // // // // // // app.use(
// // // // // // // // // //   session({
// // // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // // //     resave: false,
// // // // // // // // // //     saveUninitialized: true,
// // // // // // // // // //   })
// // // // // // // // // // );

// // // // // // // // // // app.use(passport.initialize());
// // // // // // // // // // app.use(passport.session());

// // // // // // // // // // // Configure Google OAuth strategy
// // // // // // // // // // passport.use(
// // // // // // // // // //   new GoogleStrategy(
// // // // // // // // // //     {
// // // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // // //     },
// // // // // // // // // //     async (accessToken, refreshToken, profile, done) => {
// // // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // // //     }
// // // // // // // // // //   )
// // // // // // // // // // );

// // // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // // //   done(null, user);
// // // // // // // // // // });

// // // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // // //   done(null, user);
// // // // // // // // // // });

// // // // // // // // // // // Google OAuth authentication route
// // // // // // // // // // app.get(
// // // // // // // // // //   "/api/auth",
// // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // //     scope: [
// // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // // //       "openid",
// // // // // // // // // //     ],
// // // // // // // // // //     accessType: "offline",
// // // // // // // // // //     prompt: "consent",
// // // // // // // // // //   })
// // // // // // // // // // );

// // // // // // // // // // // Google OAuth callback route
// // // // // // // // // // app.get(
// // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // //   async (req, res) => {
// // // // // // // // // //     try {
// // // // // // // // // //       // Fetch user's Google Calendar events
// // // // // // // // // //       const eventsResponse = await axios.get(
// // // // // // // // // //         "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // // //         {
// // // // // // // // // //           headers: {
// // // // // // // // // //             Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // // //           },
// // // // // // // // // //         }
// // // // // // // // // //       );

// // // // // // // // // //       // Save events to MongoDB
// // // // // // // // // //       const eventsData = eventsResponse.data.items;
// // // // // // // // // //       for (let event of eventsData) {
// // // // // // // // // //         const newEvent = new Event({
// // // // // // // // // //           summary: event.summary,
// // // // // // // // // //           start: event.start,
// // // // // // // // // //           end: event.end,
// // // // // // // // // //         });
// // // // // // // // // //         await newEvent.save();
// // // // // // // // // //       }

// // // // // // // // // //       res.redirect("http://localhost:5173"); // Redirect to frontend after authentication
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error("Failed to fetch and save events:", error);
// // // // // // // // // //       res.redirect("http://localhost:5173");
// // // // // // // // // //     }
// // // // // // // // // //   }
// // // // // // // // // // );

// // // // // // // // // // // Fetch events from MongoDB (today's events)
// // // // // // // // // // app.get("/api/db-events", async (req, res) => {
// // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // //   try {
// // // // // // // // // //     const today = new Date();
// // // // // // // // // //     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
// // // // // // // // // //     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

// // // // // // // // // //     const events = await Event.find({
// // // // // // // // // //       "start.dateTime": {
// // // // // // // // // //         $gte: startOfDay,
// // // // // // // // // //         $lte: endOfDay,
// // // // // // // // // //       },
// // // // // // // // // //     });

// // // // // // // // // //     res.json(events);
// // // // // // // // // //   } catch (error) {
// // // // // // // // // //     res.status(500).json({ error: "Failed to fetch events from DB" });
// // // // // // // // // //   }
// // // // // // // // // // });

// // // // // // // // // // // Start the server
// // // // // // // // // // app.listen(port, () => {
// // // // // // // // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // // // // // // // });


// // // // // // // // // import express from "express";
// // // // // // // // // import session from "express-session";
// // // // // // // // // import passport from "passport";
// // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // import axios from "axios";
// // // // // // // // // import cors from "cors";
// // // // // // // // // import mongoose from "mongoose";
// // // // // // // // // import moment from "moment";

// // // // // // // // // dotenv.config();

// // // // // // // // // const app = express();
// // // // // // // // // const port = 5000;

// // // // // // // // // // MongoDB connection
// // // // // // // // // mongoose.connect(process.env.MONGODB_URI, )
// // // // // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // // // // //   .catch((err) => console.error("❌ Failed to connect to MongoDB", err));

// // // // // // // // // // Event Schema
// // // // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // // // //   eventId: { type: String, unique: true },
// // // // // // // // //   summary: String,
// // // // // // // // //   start: {
// // // // // // // // //     dateTime: Date,
// // // // // // // // //     date: String,
// // // // // // // // //   },
// // // // // // // // //   end: {
// // // // // // // // //     dateTime: Date,
// // // // // // // // //     date: String,
// // // // // // // // //   },
// // // // // // // // //   description: String,
// // // // // // // // // });

// // // // // // // // // const Event = mongoose.model("Event", eventSchema);

// // // // // // // // // app.use(
// // // // // // // // //   cors({
// // // // // // // // //     origin: "http://localhost:5173",
// // // // // // // // //     credentials: true,
// // // // // // // // //   })
// // // // // // // // // );

// // // // // // // // // app.use(
// // // // // // // // //   session({
// // // // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // // // //     resave: false,
// // // // // // // // //     saveUninitialized: true,
// // // // // // // // //   })
// // // // // // // // // );

// // // // // // // // // app.use(passport.initialize());
// // // // // // // // // app.use(passport.session());

// // // // // // // // // passport.use(
// // // // // // // // //   new GoogleStrategy(
// // // // // // // // //     {
// // // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // // //     },
// // // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // // //     }
// // // // // // // // //   )
// // // // // // // // // );

// // // // // // // // // passport.serializeUser((user, done) => {
// // // // // // // // //   done(null, user);
// // // // // // // // // });
// // // // // // // // // passport.deserializeUser((user, done) => {
// // // // // // // // //   done(null, user);
// // // // // // // // // });

// // // // // // // // // app.get(
// // // // // // // // //   "/api/auth",
// // // // // // // // //   passport.authenticate("google", {
// // // // // // // // //     scope: [
// // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // //       "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // // //       "openid",
// // // // // // // // //     ],
// // // // // // // // //     accessType: "offline",
// // // // // // // // //     prompt: "consent",
// // // // // // // // //   })
// // // // // // // // // );

// // // // // // // // // app.get(
// // // // // // // // //   "/api/auth/callback",
// // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // //   (req, res) => {
// // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // //   }
// // // // // // // // // );

// // // // // // // // // // Route to delete old events and save new ones
// // // // // // // // // app.post("/api/events", async (req, res) => {
// // // // // // // // //   const events = req.body;

// // // // // // // // //   try {
// // // // // // // // //     // Get today's date in the format YYYY-MM-DD
// // // // // // // // //     const today = moment().startOf("day").toDate();
// // // // // // // // //     const tomorrow = moment().add(1, "day").startOf("day").toDate();

// // // // // // // // //     // Delete old events for today
// // // // // // // // //     await Event.deleteMany({
// // // // // // // // //       "start.dateTime": { $gte: today, $lt: tomorrow },
// // // // // // // // //     });

// // // // // // // // //     // Save new events to the database
// // // // // // // // //     for (let event of events) {
// // // // // // // // //       const newEvent = new Event({
// // // // // // // // //         eventId: event.id,
// // // // // // // // //         summary: event.summary,
// // // // // // // // //         start: event.start,
// // // // // // // // //         end: event.end,
// // // // // // // // //         description: event.description,
// // // // // // // // //       });
// // // // // // // // //       await newEvent.save();
// // // // // // // // //     }

// // // // // // // // //     res.status(200).send("Events saved successfully");
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error("Failed to save events:", error);
// // // // // // // // //     res.status(500).json({ error: "Failed to save events" });
// // // // // // // // //   }
// // // // // // // // // });

// // // // // // // // // // Route to fetch today's events from DB
// // // // // // // // // app.get("/api/db-events", async (req, res) => {
// // // // // // // // //   try {
// // // // // // // // //     const today = moment().startOf("day").toDate();
// // // // // // // // //     const tomorrow = moment().add(1, "day").startOf("day").toDate();

// // // // // // // // //     const events = await Event.find({
// // // // // // // // //       "start.dateTime": { $gte: today, $lt: tomorrow },
// // // // // // // // //     });

// // // // // // // // //     res.status(200).json(events);
// // // // // // // // //   } catch (error) {
// // // // // // // // //     console.error("Failed to fetch events from DB:", error);
// // // // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // // // //   }
// // // // // // // // // });

// // // // // // // // // // Fetch events from Google Calendar
// // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // //   try {
// // // // // // // // //     const response = await axios.get(
// // // // // // // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // // //       {
// // // // // // // // //         headers: {
// // // // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // // // //         },
// // // // // // // // //         params: {
// // // // // // // // //           timeMin: moment().startOf("day").toISOString(), // Start of today
// // // // // // // // //           timeMax: moment().endOf("day").toISOString(), // End of today
// // // // // // // // //           singleEvents: true, // Flatten recurring events
// // // // // // // // //           orderBy: "startTime", // Order by start time
// // // // // // // // //         },
// // // // // // // // //       }
// // // // // // // // //     );

// // // // // // // // //     // Save today's events to the database
// // // // // // // // //     await axios.post("http://localhost:5000/api/events", response.data.items);

// // // // // // // // //     res.json(response.data.items);
// // // // // // // // //   } catch (error) {
// // // // // // // // //     res.status(500).json({ error: "Failed to fetch/save events" });
// // // // // // // // //   }
// // // // // // // // // });

// // // // // // // // // app.listen(port, () => {
// // // // // // // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // // // // // // });



// // // // // // // // import express from "express";
// // // // // // // // import session from "express-session";
// // // // // // // // import passport from "passport";
// // // // // // // // import mongoose from "mongoose";
// // // // // // // // import dotenv from "dotenv";
// // // // // // // // import axios from "axios";
// // // // // // // // import cors from "cors";
// // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// // // // // // // // dotenv.config();
// // // // // // // // const app = express();
// // // // // // // // const port = 5000;

// // // // // // // // // MongoDB connection
// // // // // // // // mongoose
// // // // // // // //   .connect(process.env.MONGO_URI)
// // // // // // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // // // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // // // // Define Mongoose schema
// // // // // // // // const meetingSchema = new mongoose.Schema({
// // // // // // // //   summary: String,
// // // // // // // //   start: Date,
// // // // // // // // });
// // // // // // // // const Meeting = mongoose.model("Meeting", meetingSchema);

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
// // // // // // // //   })
// // // // // // // // );
// // // // // // // // app.use(passport.initialize());
// // // // // // // // app.use(passport.session());

// // // // // // // // // Google OAuth Strategy
// // // // // // // // passport.use(
// // // // // // // //   new GoogleStrategy(
// // // // // // // //     {
// // // // // // // //       clientID: process.env.GOOGLE_CLIENT_ID,
// // // // // // // //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// // // // // // // //       callbackURL: "http://localhost:5000/api/auth/callback",
// // // // // // // //     },
// // // // // // // //     (accessToken, refreshToken, profile, done) => {
// // // // // // // //       return done(null, { profile, accessToken });
// // // // // // // //     }
// // // // // // // //   )
// // // // // // // // );
// // // // // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // // // // Routes
// // // // // // // // app.get("/api/auth", passport.authenticate("google", {
// // // // // // // //   scope: [
// // // // // // // //     "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // //     "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // //     "https://www.googleapis.com/auth/userinfo.profile",
// // // // // // // //     "openid",
// // // // // // // //   ],
// // // // // // // //   accessType: "offline",
// // // // // // // //   prompt: "consent",
// // // // // // // // }));

// // // // // // // // app.get("/api/auth/callback",
// // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // //   async (req, res) => {
// // // // // // // //     try {
// // // // // // // //       const accessToken = req.user.accessToken;
// // // // // // // //       const userEmail = req.user.profile.emails[0].value;

// // // // // // // //       const now = new Date();
// // // // // // // //       const startOfDay = new Date(now.setHours(0, 0, 0, 0));
// // // // // // // //       const endOfDay = new Date(now.setHours(23, 59, 59, 999));

// // // // // // // //       const response = await axios.get(
// // // // // // // //         "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // // // // // //         {
// // // // // // // //           headers: {
// // // // // // // //             Authorization: `Bearer ${accessToken}`,
// // // // // // // //           },
// // // // // // // //           params: {
// // // // // // // //             timeMin: startOfDay.toISOString(),
// // // // // // // //             timeMax: endOfDay.toISOString(),
// // // // // // // //             singleEvents: true,
// // // // // // // //             orderBy: "startTime",
// // // // // // // //           },
// // // // // // // //         }
// // // // // // // //       );

// // // // // // // //       const data = response.data;
// // // // // // // //       const filtered = (data.items || []).filter((event) => {
// // // // // // // //         const title = event.summary?.toLowerCase() || "";
// // // // // // // //         const attendees = event.attendees || [];
// // // // // // // //         return (
// // // // // // // //           title.includes("urgent") ||
// // // // // // // //           title.includes("important") ||
// // // // // // // //           attendees.some((a) => a.email === userEmail)
// // // // // // // //         );
// // // // // // // //       });

// // // // // // // //       await Meeting.deleteMany({});
// // // // // // // //       const meetingDocs = filtered.map((event) => ({
// // // // // // // //         summary: event.summary,
// // // // // // // //         start: new Date(event.start?.dateTime || event.start?.date),
// // // // // // // //       }));
// // // // // // // //       await Meeting.insertMany(meetingDocs);
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("❌ Error fetching or saving events:", err.message);
// // // // // // // //     }

// // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // //   }
// // // // // // // // );

// // // // // // // // // Check auth
// // // // // // // // app.get("/api/check-auth", (req, res) => {
// // // // // // // //   res.json({ authenticated: !!req.user });
// // // // // // // // });

// // // // // // // // // Get today's stored meetings
// // // // // // // // app.get("/api/meetings", async (req, res) => {
// // // // // // // //   try {
// // // // // // // //     const today = new Date();
// // // // // // // //     const start = new Date(today.setHours(0, 0, 0, 0));
// // // // // // // //     const end = new Date(today.setHours(23, 59, 59, 999));

// // // // // // // //     const meetings = await Meeting.find({
// // // // // // // //       start: { $gte: start, $lte: end },
// // // // // // // //     });

// // // // // // // //     res.json({ meetings });
// // // // // // // //   } catch (err) {
// // // // // // // //     res.status(500).json({ error: "Failed to fetch meetings" });
// // // // // // // //   }
// // // // // // // // });

// // // // // // // // app.listen(port, () => {
// // // // // // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // // // // // });








// // // // // // // import express from "express";
// // // // // // // import session from "express-session";
// // // // // // // import passport from "passport";
// // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // import dotenv from "dotenv";
// // // // // // // import axios from "axios";
// // // // // // // import mongoose from "mongoose";
// // // // // // // import cors from "cors";

// // // // // // // dotenv.config();

// // // // // // // const app = express();
// // // // // // // const port = 5000;

// // // // // // // // CORS setup
// // // // // // // app.use(
// // // // // // //   cors({
// // // // // // //     origin: "http://localhost:5173",
// // // // // // //     credentials: true,
// // // // // // //   })
// // // // // // // );

// // // // // // // // Session setup
// // // // // // // app.use(
// // // // // // //   session({
// // // // // // //     secret: process.env.SESSION_SECRET || "secret",
// // // // // // //     resave: false,
// // // // // // //     saveUninitialized: true,
// // // // // // //   })
// // // // // // // );

// // // // // // // // Passport initialization
// // // // // // // app.use(passport.initialize());
// // // // // // // app.use(passport.session());

// // // // // // // // MongoDB connection
// // // // // // // mongoose
// // // // // // //   .connect(process.env.MONGO_URI)
// // // // // // //   .then(() => console.log("✅ MongoDB connected"))
// // // // // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // // // // // // // MongoDB schema and model
// // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // //   summary: String,
// // // // // // //   start: Object,
// // // // // // //   end: Object,
// // // // // // //   email: String,
// // // // // // //   eventId: String,
// // // // // // // });
// // // // // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // // // // // // Google OAuth setup
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

// // // // // // // passport.serializeUser((user, done) => {
// // // // // // //   done(null, user);
// // // // // // // });
// // // // // // // passport.deserializeUser((user, done) => {
// // // // // // //   done(null, user);
// // // // // // // });

// // // // // // // // Auth route
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

// // // // // // // // Callback after Google login
// // // // // // // app.get(
// // // // // // //   "/api/auth/callback",
// // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // //   (req, res) => {
// // // // // // //     res.redirect("http://localhost:5173");
// // // // // // //   }
// // // // // // // );

// // // // // // // // User authentication check
// // // // // // // app.get("/api/user", (req, res) => {
// // // // // // //   if (req.user) {
// // // // // // //     res.json({ authenticated: true });
// // // // // // //   } else {
// // // // // // //     res.json({ authenticated: false });
// // // // // // //   }
// // // // // // // });

// // // // // // // // Fetch all today's events and store important ones
// // // // // // // app.get("/api/all-events", async (req, res) => {
// // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // //   try {
// // // // // // //     const today = new Date();
// // // // // // //     const timeMin = new Date(
// // // // // // //       today.getFullYear(),
// // // // // // //       today.getMonth(),
// // // // // // //       today.getDate()
// // // // // // //     ).toISOString();
// // // // // // //     const timeMax = new Date(
// // // // // // //       today.getFullYear(),
// // // // // // //       today.getMonth(),
// // // // // // //       today.getDate() + 1
// // // // // // //     ).toISOString();

// // // // // // //     const response = await axios.get(
// // // // // // //       `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
// // // // // // //       {
// // // // // // //         headers: {
// // // // // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // // // // //         },
// // // // // // //         params: {
// // // // // // //           timeMin,
// // // // // // //           timeMax,
// // // // // // //           singleEvents: true,
// // // // // // //           orderBy: "startTime",
// // // // // // //         },
// // // // // // //       }
// // // // // // //     );

// // // // // // //     const events = response.data.items || [];
// // // // // // //     const userEmail = req.user.profile.emails[0].value;

// // // // // // //     // Clear old events from MongoDB
// // // // // // //     await ImportantEvent.deleteMany({});

// // // // // // //     const importantEvents = [];

// // // // // // //     for (const event of events) {
// // // // // // //       const summary = event.summary?.toLowerCase() || "";
// // // // // // //       const attendees = event.attendees?.map((a) => a.email) || [];

// // // // // // //       const isImportant =
// // // // // // //         summary.includes("urgent") ||
// // // // // // //         summary.includes("important") ||
// // // // // // //         attendees.includes(userEmail);

// // // // // // //       if (isImportant) {
// // // // // // //         importantEvents.push({
// // // // // // //           summary: event.summary,
// // // // // // //           start: event.start,
// // // // // // //           end: event.end,
// // // // // // //           email: userEmail,
// // // // // // //           eventId: event.id,
// // // // // // //         });
// // // // // // //       }
// // // // // // //     }

// // // // // // //     // Insert today's important events into MongoDB
// // // // // // //     await ImportantEvent.insertMany(importantEvents);

// // // // // // //     res.json({ allEvents: events });
// // // // // // //   } catch (err) {
// // // // // // //     console.error("❌ Error fetching calendar events:", err);
// // // // // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // // // // //   }
// // // // // // // });

// // // // // // // // Get important events from MongoDB
// // // // // // // app.get("/api/important-events", async (req, res) => {
// // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // //   const events = await ImportantEvent.find({});
// // // // // // //   res.json(events);
// // // // // // // });

// // // // // // // // Start the server
// // // // // // // app.listen(port, () => {
// // // // // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // // // // });





// // // // import express from "express";
// // // // import session from "express-session";
// // // // import passport from "passport";
// // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // import dotenv from "dotenv";
// // // // import axios from "axios";
// // // // import mongoose from "mongoose";
// // // // import cors from "cors";

// // // // dotenv.config();

// // // // const app = express();
// // // // const port = 5000;

// // // // const eventSchema = new mongoose.Schema({
// // // //   summary: String,
// // // //   start: Object,
// // // //   end: Object,
// // // //   email: String,
// // // //   eventId: String,
// // // // });
// // // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

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
// // // //   })
// // // // );

// // // // app.use(passport.initialize());
// // // // app.use(passport.session());

// // // // mongoose
// // // //   .connect(process.env.MONGO_URI)
// // // //   .then(() => console.log("✅ Connected to MongoDB"))
// // // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

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
// // // //   if (req.user) {
// // // //     res.json({ authenticated: true });
// // // //   } else {
// // // //     res.json({ authenticated: false });
// // // //   }
// // // // });

// // // // app.get("/api/all-events", async (req, res) => {
// // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // //   try {
// // // //     const today = new Date();
// // // //     const timeMin = new Date(
// // // //       today.getFullYear(),
// // // //       today.getMonth(),
// // // //       today.getDate()
// // // //     ).toISOString();
// // // //     const timeMax = new Date(
// // // //       today.getFullYear(),
// // // //       today.getMonth(),
// // // //       today.getDate() + 1
// // // //     ).toISOString();

// // // //     const response = await axios.get(
// // // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // // //       {
// // // //         headers: {
// // // //           Authorization: `Bearer ${req.user.accessToken}`,
// // // //         },
// // // //         params: {
// // // //           timeMin,
// // // //           timeMax,
// // // //           singleEvents: true,
// // // //           orderBy: "startTime",
// // // //         },
// // // //       }
// // // //     );

// // // //     const events = response.data.items || [];
// // // //     const email = req.user.profile.emails[0].value;

// // // //     await ImportantEvent.deleteMany({ email });

// // // //     const importantEvents = [];

// // // //     for (const event of events) {
// // // //       const summary = event.summary?.toLowerCase() || "";
// // // //       const attendees = event.attendees?.map((a) => a.email) || [];

// // // //       const isImportant =
// // // //         summary.includes("important") ||
// // // //         summary.includes("urgent") ||
// // // //         attendees.includes(email);

// // // //       if (isImportant) {
// // // //         importantEvents.push({
// // // //           summary: event.summary,
// // // //           start: event.start,
// // // //           end: event.end,
// // // //           email,
// // // //           eventId: event.id,
// // // //         });
// // // //       }
// // // //     }

// // // //     await ImportantEvent.insertMany(importantEvents);

// // // //     res.json({ allEvents: events });
// // // //   } catch (err) {
// // // //     console.error("Error fetching events:", err);
// // // //     res.status(500).json({ error: "Failed to fetch events" });
// // // //   }
// // // // });

// // // // app.get("/api/important-events", async (req, res) => {
// // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // //   const email = req.user.profile.emails[0].value;
// // // //   const events = await ImportantEvent.find({ email });
// // // //   res.json(events);
// // // // });

// // // // // Start server
// // // // app.listen(port, () => {
// // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // });





// // // import express from "express";
// // // import session from "express-session";
// // // import passport from "passport";
// // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // import dotenv from "dotenv";
// // // import axios from "axios";
// // // import mongoose from "mongoose";
// // // import cors from "cors";

// // // dotenv.config();

// // // const app = express();
// // // const port = 5000;

// // // const eventSchema = new mongoose.Schema({
// // //   summary: String,
// // //   start: Object,
// // //   end: Object,
// // //   email: String,
// // //   eventId: String,
// // // });
// // // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:5173",
// // //     credentials: true,
// // //   })
// // // );

// // // app.use(
// // //   session({
// // //     secret: process.env.SESSION_SECRET || "secret",
// // //     resave: false,
// // //     saveUninitialized: true,
// // //   })
// // // );

// // // app.use(passport.initialize());
// // // app.use(passport.session());

// // // mongoose
// // //   .connect(process.env.MONGO_URI)
// // //   .then(() => console.log("✅ Connected to MongoDB"))
// // //   .catch((err) => console.error("❌ MongoDB connection error:", err));

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
// // //   if (req.user) {
// // //     res.json({ authenticated: true });
// // //   } else {
// // //     res.json({ authenticated: false });
// // //   }
// // // });

// // // app.get("/api/all-events", async (req, res) => {
// // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // //   try {
// // //     const today = new Date();
// // //     const timeMin = new Date(
// // //       today.getFullYear(),
// // //       today.getMonth(),
// // //       today.getDate()
// // //     ).toISOString();
// // //     const timeMax = new Date(
// // //       today.getFullYear(),
// // //       today.getMonth(),
// // //       today.getDate() + 1
// // //     ).toISOString();

// // //     const response = await axios.get(
// // //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// // //       {
// // //         headers: {
// // //           Authorization: `Bearer ${req.user.accessToken}`,
// // //         },
// // //         params: {
// // //           timeMin,
// // //           timeMax,
// // //           singleEvents: true,
// // //           orderBy: "startTime",
// // //         },
// // //       }
// // //     );

// // //     const events = response.data.items || [];
// // //     const email = req.user.profile.emails[0].value;

// // //     await ImportantEvent.deleteMany({ email });

// // //     const importantEvents = [];

// // //     for (const event of events) {
// // //       const summary = event.summary?.toLowerCase() || "";
// // //       const attendees = event.attendees?.map((a) => a.email) || [];

// // //       const isImportant =
// // //         summary.includes("important") ||
// // //         summary.includes("urgent") ||
// // //         attendees.includes(email);

// // //       if (isImportant) {
// // //         const startDateTime = event.start?.dateTime;

// // //         if (startDateTime) {
// // //           const eventHour = new Date(startDateTime).getHours();

// // //           // Only include events outside 9AM–5PM
// // //           if (eventHour < 9 || eventHour >= 17) {
// // //             importantEvents.push({
// // //               summary: event.summary,
// // //               start: event.start,
// // //               end: event.end,
// // //               email,
// // //               eventId: event.id,
// // //             });
// // //           }
// // //         }
// // //       }
// // //     }

// // //     await ImportantEvent.insertMany(importantEvents);

// // //     res.json({ allEvents: events });
// // //   } catch (err) {
// // //     console.error("Error fetching events:", err);
// // //     res.status(500).json({ error: "Failed to fetch events" });
// // //   }
// // // });

// // // app.get("/api/important-events", async (req, res) => {
// // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // //   const email = req.user.profile.emails[0].value;
// // //   const events = await ImportantEvent.find({ email });
// // //   res.json(events);
// // // });

// // // // Start server
// // // app.listen(port, () => {
// // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // });





// // import express from "express";
// // import session from "express-session";
// // import passport from "passport";
// // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // import dotenv from "dotenv";
// // import axios from "axios";
// // import mongoose from "mongoose";
// // import cors from "cors";

// // dotenv.config();

// // const app = express();
// // const port = 5000;

// // const eventSchema = new mongoose.Schema({
// //   summary: String,
// //   start: Object,
// //   end: Object,
// //   email: String,
// //   eventId: String,
// // });
// // const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // app.use(
// //   cors({
// //     origin: "http://localhost:5173", // Your frontend URL
// //     credentials: true,
// //   })
// // );

// // app.use(
// //   session({
// //     secret: process.env.SESSION_SECRET || "secret",
// //     resave: false,
// //     saveUninitialized: true,
// //   })
// // );

// // app.use(passport.initialize());
// // app.use(passport.session());

// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log("✅ Connected to MongoDB"))
// //   .catch((err) => console.error("❌ MongoDB connection error:", err));

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
// //     res.redirect("http://localhost:5173"); // Frontend URL after authentication
// //   }
// // );

// // app.get("/api/user", (req, res) => {
// //   if (req.user) {
// //     res.json({ authenticated: true });
// //   } else {
// //     res.json({ authenticated: false });
// //   }
// // });

// // app.get("/api/all-events", async (req, res) => {
// //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// //   try {
// //     const today = new Date();
// //     const timeMin = new Date(
// //       today.getFullYear(),
// //       today.getMonth(),
// //       today.getDate()
// //     ).toISOString();
// //     const timeMax = new Date(
// //       today.getFullYear(),
// //       today.getMonth(),
// //       today.getDate() + 1
// //     ).toISOString();

// //     const response = await axios.get(
// //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
// //       {
// //         headers: {
// //           Authorization: `Bearer ${req.user.accessToken}`,
// //         },
// //         params: {
// //           timeMin,
// //           timeMax,
// //           singleEvents: true,
// //           orderBy: "startTime",
// //         },
// //       }
// //     );

// //     const events = response.data.items || [];
// //     const email = req.user.profile.emails[0].value;

// //     await ImportantEvent.deleteMany({ email });

// //     const importantEvents = [];

// //     for (const event of events) {
// //       const summary = event.summary?.toLowerCase() || "";
// //       const attendees = event.attendees?.map((a) => a.email) || [];

// //       const isImportant =
// //         summary.includes("important") ||
// //         summary.includes("urgent") ||
// //         attendees.includes(email);

// //       if (isImportant) {
// //         const startDateTime = event.start?.dateTime;

// //         if (startDateTime) {
// //           const eventHour = new Date(startDateTime).getHours();

// //           // Only include events outside 9AM–5PM
// //           if (eventHour < 9 || eventHour >= 17) {
// //             importantEvents.push({
// //               summary: event.summary,
// //               start: event.start,
// //               end: event.end,
// //               email,
// //               eventId: event.id,
// //             });
// //           }
// //         }
// //       }
// //     }

// //     await ImportantEvent.insertMany(importantEvents);

// //     res.json({ allEvents: events });
// //   } catch (err) {
// //     console.error("Error fetching events:", err);
// //     res.status(500).json({ error: "Failed to fetch events" });
// //   }
// // });

// // app.get("/api/important-events", async (req, res) => {
// //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// //   const email = req.user.profile.emails[0].value;
// //   const events = await ImportantEvent.find({ email });
// //   res.json(events);
// // });

// // // Start server
// // app.listen(port, () => {
// //   console.log(`🚀 Server running at http://localhost:${port}`);
// // });





// import express from "express";
// import session from "express-session";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import dotenv from "dotenv";
// import axios from "axios";
// import mongoose from "mongoose";
// import cors from "cors";

// dotenv.config();

// const app = express();
// const port = 5000;

// // MongoDB Schema
// const eventSchema = new mongoose.Schema({
//   summary: String,
//   start: Object,
//   end: Object,
//   email: String,
//   eventId: String,
// });
// const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// // Middleware
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
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ Connected to MongoDB"))
//   .catch((err) => console.error("❌ MongoDB connection error:", err));

// // Google OAuth Strategy
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

// // Routes
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
//   if (req.user) {
//     res.json({ authenticated: true });
//   } else {
//     res.json({ authenticated: false });
//   }
// });

// // All Events API (includes logic for storing important ones)
// app.get("/api/all-events", async (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

//   try {
//     const today = new Date();
//     const timeMin = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate()
//     ).toISOString();
//     const timeMax = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       today.getDate() + 1
//     ).toISOString();

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
//     const email = req.user.profile.emails[0].value;

//     // Clear existing events for this user
//     await ImportantEvent.deleteMany({ email });

//     const importantEvents = [];

//     for (const event of events) {
//       const summary = event.summary?.toLowerCase() || "";
//       const attendees = event.attendees?.map((a) => a.email) || [];
//       const startDateTime = event.start?.dateTime;

//       if (startDateTime) {
//         const eventHour = new Date(startDateTime).getHours();
//         const isOutsideWorkingHours = eventHour < 9 || eventHour >= 17;

//         const isImportantByTitle = summary.includes("important") || summary.includes("urgent");
//         const isUserAnAttendee = attendees.includes(email);

//         if (isOutsideWorkingHours && (isImportantByTitle || isUserAnAttendee)) {
//           importantEvents.push({
//             summary: event.summary,
//             start: event.start,
//             end: event.end,
//             email,
//             eventId: event.id,
//           });
//         }
//       }
//     }

//     await ImportantEvent.insertMany(importantEvents);

//     res.json({ allEvents: events });
//   } catch (err) {
//     console.error("Error fetching events:", err);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// });

// // Important Events API
// app.get("/api/important-events", async (req, res) => {
//   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

//   const email = req.user.profile.emails[0].value;
//   const events = await ImportantEvent.find({ email });
//   res.json(events);
// });

// // Start server
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
});
const ImportantEvent = mongoose.model("ImportantEvent", eventSchema);

// Middleware
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
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
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
  const events = await ImportantEvent.find({ email });
  res.json(events);
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

