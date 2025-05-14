// // // // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // // // import axios from "axios";

// // // // // // // // // // // // // // // function App() {
// // // // // // // // // // // // // // //   const [events, setEvents] = useState([]);
// // // // // // // // // // // // // // //   const [loading, setLoading] = useState(false);

// // // // // // // // // // // // // // //   const handleSignIn = () => {
// // // // // // // // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // // //     const fetchEvents = async () => {
// // // // // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // // // // //       try {
// // // // // // // // // // // // // // //         const response = await axios.get("http://localhost:5000/api/events", {
// // // // // // // // // // // // // // //           withCredentials: true,
// // // // // // // // // // // // // // //         });
// // // // // // // // // // // // // // //         setEvents(response.data.items || []);
// // // // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // // // //         console.error("Failed to fetch events:", error);
// // // // // // // // // // // // // // //       } finally {
// // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // //       }
// // // // // // // // // // // // // // //     };

// // // // // // // // // // // // // // //     fetchEvents();
// // // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // // // // // // // // // // // // // //       <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-center">
// // // // // // // // // // // // // // //         <h1 className="text-2xl font-bold mb-4">Google Calendar Events</h1>

// // // // // // // // // // // // // // //         <button
// // // // // // // // // // // // // // //           className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // // // // // // // //           onClick={handleSignIn}
// // // // // // // // // // // // // // //         >
// // // // // // // // // // // // // // //           Sign in with Google
// // // // // // // // // // // // // // //         </button>

// // // // // // // // // // // // // // //         {loading ? (
// // // // // // // // // // // // // // //           <p className="mt-4">Loading events...</p>
// // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // //           <ul className="mt-4 text-left">
// // // // // // // // // // // // // // //             {events.map((event, index) => (
// // // // // // // // // // // // // // //               <li key={index} className="border-b py-2">
// // // // // // // // // // // // // // //                 <strong>{event.summary || "No Title"}</strong><br />
// // // // // // // // // // // // // // //                 {event.start?.dateTime
// // // // // // // // // // // // // // //                   ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // // // // // // // //                   : "No time info"}
// // // // // // // // // // // // // // //               </li>
// // // // // // // // // // // // // // //             ))}
// // // // // // // // // // // // // // //           </ul>
// // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // export default App;




// // // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // // import axios from "axios";

// // // // // // // // // // // // // // function App() {
// // // // // // // // // // // // // //   const [events, setEvents] = useState([]);
// // // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false); // Track authentication state

// // // // // // // // // // // // // //   // Handle Google sign-in
// // // // // // // // // // // // // //   const handleSignIn = () => {
// // // // // // // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   // Fetch events after checking if user is authenticated
// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     const checkAuth = async () => {
// // // // // // // // // // // // // //       try {
// // // // // // // // // // // // // //         await axios.get("http://localhost:5000/api/db-events", { withCredentials: true });
// // // // // // // // // // // // // //         setAuthenticated(true); // Set authenticated to true if response is successful
// // // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // // //         setAuthenticated(false); // Set authenticated to false if error occurs
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     checkAuth(); // Check authentication status

// // // // // // // // // // // // // //     if (authenticated) {
// // // // // // // // // // // // // //       const fetchEvents = async () => {
// // // // // // // // // // // // // //         setLoading(true);
// // // // // // // // // // // // // //         try {
// // // // // // // // // // // // // //           const response = await axios.get("http://localhost:5000/api/db-events", {
// // // // // // // // // // // // // //             withCredentials: true,
// // // // // // // // // // // // // //           });
// // // // // // // // // // // // // //           setEvents(response.data || []);
// // // // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // // // //           console.error("Failed to fetch events from DB:", error);
// // // // // // // // // // // // // //         } finally {
// // // // // // // // // // // // // //           setLoading(false);
// // // // // // // // // // // // // //         }
// // // // // // // // // // // // // //       };

// // // // // // // // // // // // // //       fetchEvents();
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   }, [authenticated]);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // // // // // // // // // // // // //       <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-center">
// // // // // // // // // // // // // //         <h1 className="text-2xl font-bold mb-4">Today's Meetings</h1>

// // // // // // // // // // // // // //         {!authenticated ? (
// // // // // // // // // // // // // //           <button
// // // // // // // // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // // // // // // //             onClick={handleSignIn}
// // // // // // // // // // // // // //           >
// // // // // // // // // // // // // //             Sign in with Google
// // // // // // // // // // // // // //           </button>
// // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // //           // If authenticated, directly display the events (no extra message)
// // // // // // // // // // // // // //           <div>
// // // // // // // // // // // // // //             {loading ? (
// // // // // // // // // // // // // //               <p className="mt-4">Loading today's meetings...</p>
// // // // // // // // // // // // // //             ) : events.length === 0 ? (
// // // // // // // // // // // // // //               <p className="mt-4 text-gray-500">No meetings for today.</p>
// // // // // // // // // // // // // //             ) : (
// // // // // // // // // // // // // //               <ul className="mt-4 text-left">
// // // // // // // // // // // // // //                 {events.map((event, index) => (
// // // // // // // // // // // // // //                   <li key={index} className="border-b py-2">
// // // // // // // // // // // // // //                     <strong>{event.summary || "No Title"}</strong>
// // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // //                     {event.start?.dateTime
// // // // // // // // // // // // // //                       ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // // // // // // //                       : event.start?.date
// // // // // // // // // // // // // //                         ? event.start.date
// // // // // // // // // // // // // //                         : "No time info"}
// // // // // // // // // // // // // //                   </li>
// // // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // // //               </ul>
// // // // // // // // // // // // // //             )}
// // // // // // // // // // // // // //           </div>
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //       </div>
// // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // export default App;


// // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // import axios from "axios";

// // // // // // // // // // // // // function App() {
// // // // // // // // // // // // //   const [events, setEvents] = useState([]);
// // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);

// // // // // // // // // // // // //   // Handle Google sign-in
// // // // // // // // // // // // //   const handleSignIn = () => {
// // // // // // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   // Fetch events after checking if user is authenticated
// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     const checkAuth = async () => {
// // // // // // // // // // // // //       try {
// // // // // // // // // // // // //         await axios.get("http://localhost:5000/api/db-events", { withCredentials: true });
// // // // // // // // // // // // //         setAuthenticated(true); // Set authenticated to true if response is successful
// // // // // // // // // // // // //       } catch (error) {
// // // // // // // // // // // // //         setAuthenticated(false); // Set authenticated to false if error occurs
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     };

// // // // // // // // // // // // //     checkAuth(); // Check authentication status

// // // // // // // // // // // // //     if (authenticated) {
// // // // // // // // // // // // //       const fetchEvents = async () => {
// // // // // // // // // // // // //         setLoading(true);
// // // // // // // // // // // // //         try {
// // // // // // // // // // // // //           const response = await axios.get("http://localhost:5000/api/db-events", {
// // // // // // // // // // // // //             withCredentials: true,
// // // // // // // // // // // // //           });
// // // // // // // // // // // // //           setEvents(response.data || []);
// // // // // // // // // // // // //         } catch (error) {
// // // // // // // // // // // // //           console.error("Failed to fetch events from DB:", error);
// // // // // // // // // // // // //         } finally {
// // // // // // // // // // // // //           setLoading(false);
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //       };

// // // // // // // // // // // // //       fetchEvents();
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   }, [authenticated]);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // // // // // // // // // // // //       <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-center">
// // // // // // // // // // // // //         <h1 className="text-2xl font-bold mb-4">Today's Meetings</h1>

// // // // // // // // // // // // //         {!authenticated ? (
// // // // // // // // // // // // //           <button
// // // // // // // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // // // // // //             onClick={handleSignIn}
// // // // // // // // // // // // //           >
// // // // // // // // // // // // //             Sign in with Google
// // // // // // // // // // // // //           </button>
// // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // //           <div>
// // // // // // // // // // // // //             {loading ? (
// // // // // // // // // // // // //               <p className="mt-4">Loading today's meetings...</p>
// // // // // // // // // // // // //             ) : events.length === 0 ? (
// // // // // // // // // // // // //               <p className="mt-4 text-gray-500">No meetings for today.</p>
// // // // // // // // // // // // //             ) : (
// // // // // // // // // // // // //               <ul className="mt-4 text-left">
// // // // // // // // // // // // //                 {events.map((event, index) => (
// // // // // // // // // // // // //                   <li key={index} className="border-b py-2">
// // // // // // // // // // // // //                     <strong>{event.summary || "No Title"}</strong>
// // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // //                     {event.start?.dateTime
// // // // // // // // // // // // //                       ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // // // // // //                       : event.start?.date
// // // // // // // // // // // // //                         ? event.start.date
// // // // // // // // // // // // //                         : "No time info"}
// // // // // // // // // // // // //                   </li>
// // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // //               </ul>
// // // // // // // // // // // // //             )}
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export default App;



// // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // import axios from "axios";

// // // // // // // // // // // // function App() {
// // // // // // // // // // // //   const [events, setEvents] = useState([]);
// // // // // // // // // // // //   const [isAuthenticated, setIsAuthenticated] = useState(false);

// // // // // // // // // // // //   const fetchEvents = async () => {
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       const response = await axios.get("http://localhost:5000/api/events/from-db", {
// // // // // // // // // // // //         withCredentials: true,
// // // // // // // // // // // //       });

// // // // // // // // // // // //       if (response.data && response.data.length > 0) {
// // // // // // // // // // // //         setIsAuthenticated(true);
// // // // // // // // // // // //         setEvents(response.data);
// // // // // // // // // // // //       } else {
// // // // // // // // // // // //         setIsAuthenticated(false);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //       setIsAuthenticated(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     fetchEvents();
// // // // // // // // // // // //   }, []);

// // // // // // // // // // // //   const handleSignIn = () => {
// // // // // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // // // // // // // // // // //       <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-center">
// // // // // // // // // // // //         <h1 className="text-2xl font-bold mb-4">Today's Urgent/Important Meetings</h1>

// // // // // // // // // // // //         {!isAuthenticated && (
// // // // // // // // // // // //           <button
// // // // // // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // // // // //             onClick={handleSignIn}
// // // // // // // // // // // //           >
// // // // // // // // // // // //             Sign in with Google
// // // // // // // // // // // //           </button>
// // // // // // // // // // // //         )}

// // // // // // // // // // // //         {isAuthenticated && events.length === 0 && (
// // // // // // // // // // // //           <p className="mt-4">No urgent or important meetings found today.</p>
// // // // // // // // // // // //         )}

// // // // // // // // // // // //         {events.length > 0 && (
// // // // // // // // // // // //           <ul className="mt-4 text-left">
// // // // // // // // // // // //             {events.map((event, index) => (
// // // // // // // // // // // //               <li key={index} className="border-b py-2">
// // // // // // // // // // // //                 <strong>{event.summary || "No Title"}</strong>
// // // // // // // // // // // //                 <br />
// // // // // // // // // // // //                 {event.start?.dateTime
// // // // // // // // // // // //                   ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // // // // //                   : "No time info"}
// // // // // // // // // // // //               </li>
// // // // // // // // // // // //             ))}
// // // // // // // // // // // //           </ul>
// // // // // // // // // // // //         )}
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }

// // // // // // // // // // // // export default App;






// // // // // // // // // // // import express from "express";
// // // // // // // // // // // import session from "express-session";
// // // // // // // // // // // import passport from "passport";
// // // // // // // // // // // import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// // // // // // // // // // // import dotenv from "dotenv";
// // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // import cors from "cors";
// // // // // // // // // // // import mongoose from "mongoose";

// // // // // // // // // // // dotenv.config();

// // // // // // // // // // // const app = express();
// // // // // // // // // // // const port = 5000;

// // // // // // // // // // // // MongoDB model
// // // // // // // // // // // const eventSchema = new mongoose.Schema({
// // // // // // // // // // //   googleId: String,
// // // // // // // // // // //   summary: String,
// // // // // // // // // // //   start: String,
// // // // // // // // // // // });
// // // // // // // // // // // const Event = mongoose.model("Event", eventSchema);

// // // // // // // // // // // // MongoDB connection
// // // // // // // // // // // mongoose
// // // // // // // // // // //   .connect(process.env.MONGO_URI)
// // // // // // // // // // //   .then(() => console.log("✅ MongoDB connected"))
// // // // // // // // // // //   .catch((err) => console.error("❌ MongoDB error:", err));

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

// // // // // // // // // // // passport.serializeUser((user, done) => done(null, user));
// // // // // // // // // // // passport.deserializeUser((user, done) => done(null, user));

// // // // // // // // // // // // Auth endpoints
// // // // // // // // // // // app.get(
// // // // // // // // // // //   "/api/auth",
// // // // // // // // // // //   passport.authenticate("google", {
// // // // // // // // // // //     scope: [
// // // // // // // // // // //       "https://www.googleapis.com/auth/calendar.readonly",
// // // // // // // // // // //       "https://www.googleapis.com/auth/userinfo.email",
// // // // // // // // // // //     ],
// // // // // // // // // // //     accessType: "offline",
// // // // // // // // // // //     prompt: "consent",
// // // // // // // // // // //   })
// // // // // // // // // // // );

// // // // // // // // // // // app.get(
// // // // // // // // // // //   "/api/auth/callback",
// // // // // // // // // // //   passport.authenticate("google", { failureRedirect: "/" }),
// // // // // // // // // // //   (req, res) => {
// // // // // // // // // // //     res.redirect("http://localhost:5173");
// // // // // // // // // // //   }
// // // // // // // // // // // );

// // // // // // // // // // // // Filter & store only today's urgent/important meetings
// // // // // // // // // // // app.get("/api/fetch-events", async (req, res) => {
// // // // // // // // // // //   if (!req.user) return res.status(401).json({ error: "Not authenticated" });

// // // // // // // // // // //   const accessToken = req.user.accessToken;
// // // // // // // // // // //   const userEmail = req.user.profile.emails[0].value;

// // // // // // // // // // //   const today = new Date();
// // // // // // // // // // //   const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
// // // // // // // // // // //   const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

// // // // // // // // // // //   try {
// // // // // // // // // // //     // Delete old events
// // // // // // // // // // //     await Event.deleteMany({});

// // // // // // // // // // //     const response = await axios.get(
// // // // // // // // // // //       `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`,
// // // // // // // // // // //       {
// // // // // // // // // // //         headers: { Authorization: `Bearer ${accessToken}` },
// // // // // // // // // // //       }
// // // // // // // // // // //     );

// // // // // // // // // // //     const filtered = (response.data.items || []).filter((event) => {
// // // // // // // // // // //       const summary = (event.summary || "").toLowerCase();
// // // // // // // // // // //       const attendees = event.attendees || [];
// // // // // // // // // // //       const isUrgent = summary.includes("urgent") || summary.includes("important");
// // // // // // // // // // //       const isToYou = attendees.some(
// // // // // // // // // // //         (a) => a.email === userEmail && (a.responseStatus === "accepted" || a.responseStatus === "needsAction")
// // // // // // // // // // //       );
// // // // // // // // // // //       return isUrgent || isToYou;
// // // // // // // // // // //     });

// // // // // // // // // // //     // Store in MongoDB
// // // // // // // // // // //     await Event.insertMany(
// // // // // // // // // // //       filtered.map((event) => ({
// // // // // // // // // // //         googleId: event.id,
// // // // // // // // // // //         summary: event.summary || "No Title",
// // // // // // // // // // //         start: event.start?.dateTime || event.start?.date || "No time info",
// // // // // // // // // // //       }))
// // // // // // // // // // //     );

// // // // // // // // // // //     res.json({ message: "Events fetched and saved", count: filtered.length });
// // // // // // // // // // //   } catch (err) {
// // // // // // // // // // //     console.error(err);
// // // // // // // // // // //     res.status(500).json({ error: "Failed to fetch/save events" });
// // // // // // // // // // //   }
// // // // // // // // // // // });

// // // // // // // // // // // // Serve events to frontend
// // // // // // // // // // // app.get("/api/events", async (req, res) => {
// // // // // // // // // // //   try {
// // // // // // // // // // //     const events = await Event.find({});
// // // // // // // // // // //     res.json(events);
// // // // // // // // // // //   } catch (err) {
// // // // // // // // // // //     res.status(500).json({ error: "Failed to retrieve events" });
// // // // // // // // // // //   }
// // // // // // // // // // // });

// // // // // // // // // // // app.listen(port, () => {
// // // // // // // // // // //   console.log(`🚀 Server running at http://localhost:${port}`);
// // // // // // // // // // // });




// // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // import axios from "axios";

// // // // // // // // // // function App() {
// // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // // //   const [meetings, setMeetings] = useState([]);

// // // // // // // // // //   const handleSignIn = () => {
// // // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // // //   };

// // // // // // // // // //   const fetchMeetings = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       const res = await axios.get("http://localhost:5000/api/meetings", {
// // // // // // // // // //         withCredentials: true,
// // // // // // // // // //       });
// // // // // // // // // //       setMeetings(res.data.meetings || []);
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Error fetching meetings:", err);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const checkAuth = async () => {
// // // // // // // // // //     try {
// // // // // // // // // //       const res = await axios.get("http://localhost:5000/api/check-auth", {
// // // // // // // // // //         withCredentials: true,
// // // // // // // // // //       });
// // // // // // // // // //       setAuthenticated(res.data.authenticated);
// // // // // // // // // //       if (res.data.authenticated) fetchMeetings();
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Auth check failed:", err);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     checkAuth();
// // // // // // // // // //   }, []);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// // // // // // // // // //       <div className="p-6 max-w-lg bg-white rounded shadow text-center">
// // // // // // // // // //         <h1 className="text-2xl font-bold mb-4">Today's Meetings</h1>

// // // // // // // // // //         {!authenticated && (
// // // // // // // // // //           <button
// // // // // // // // // //             onClick={handleSignIn}
// // // // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // // //           >
// // // // // // // // // //             Sign in with Google
// // // // // // // // // //           </button>
// // // // // // // // // //         )}

// // // // // // // // // //         {authenticated && (
// // // // // // // // // //           <ul className="text-left mt-4">
// // // // // // // // // //             {meetings.length === 0 ? (
// // // // // // // // // //               <p>No urgent/important meetings today.</p>
// // // // // // // // // //             ) : (
// // // // // // // // // //               meetings.map((meeting, index) => (
// // // // // // // // // //                 <li key={index} className="mb-2 border-b pb-2">
// // // // // // // // // //                   <strong>{meeting.summary || "No Title"}</strong>
// // // // // // // // // //                   <br />
// // // // // // // // // //                   {new Date(meeting.start).toLocaleString()}
// // // // // // // // // //                 </li>
// // // // // // // // // //               ))
// // // // // // // // // //             )}
// // // // // // // // // //           </ul>
// // // // // // // // // //         )}
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // export default App;





// // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // import axios from "axios";

// // // // // // // // // function App() {
// // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // // //   const [showImportant, setShowImportant] = useState(false);

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const checkAuth = async () => {
// // // // // // // // //       try {
// // // // // // // // //         const res = await axios.get("http://localhost:5000/api/user", {
// // // // // // // // //           withCredentials: true,
// // // // // // // // //         });
// // // // // // // // //         if (res.data.authenticated) {
// // // // // // // // //           setAuthenticated(true);
// // // // // // // // //           fetchAllEvents();
// // // // // // // // //         }
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("Error checking auth:", err);
// // // // // // // // //       }
// // // // // // // // //     };
// // // // // // // // //     checkAuth();
// // // // // // // // //   }, []);

// // // // // // // // //   const handleSignIn = () => {
// // // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // // //   };

// // // // // // // // //   const fetchAllEvents = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const res = await axios.get("http://localhost:5000/api/all-events", {
// // // // // // // // //         withCredentials: true,
// // // // // // // // //       });
// // // // // // // // //       setAllEvents(res.data.allEvents || []);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Error fetching all events:", err);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const fetchImportantEvents = async () => {
// // // // // // // // //     try {
// // // // // // // // //       const res = await axios.get("http://localhost:5000/api/important-events", {
// // // // // // // // //         withCredentials: true,
// // // // // // // // //       });
// // // // // // // // //       setImportantEvents(res.data || []);
// // // // // // // // //       setShowImportant(true);
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Error fetching important events:", err);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <div className="min-h-screen bg-gray-100 p-8">
// // // // // // // // //       {!authenticated ? (
// // // // // // // // //         <div className="flex justify-center">
// // // // // // // // //           <button
// // // // // // // // //             onClick={handleSignIn}
// // // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // // //           >
// // // // // // // // //             Sign in with Google
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       ) : (
// // // // // // // // //         <div className="grid grid-cols-2 gap-8">
// // // // // // // // //           {/* All Events */}
// // // // // // // // //           <div className="bg-white rounded shadow p-6">
// // // // // // // // //             <h2 className="text-xl font-bold mb-4">All Today's Meetings</h2>
// // // // // // // // //             <ul>
// // // // // // // // //               {allEvents.map((event, index) => (
// // // // // // // // //                 <li key={index} className="border-b py-2">
// // // // // // // // //                   <strong>{event.summary || "No Title"}</strong>
// // // // // // // // //                   <br />
// // // // // // // // //                   {event.start?.dateTime
// // // // // // // // //                     ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // //                     : "No time info"}
// // // // // // // // //                 </li>
// // // // // // // // //               ))}
// // // // // // // // //             </ul>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Important Events */}
// // // // // // // // //           <div className="bg-white rounded shadow p-6">
// // // // // // // // //             <div className="flex justify-between items-center mb-4">
// // // // // // // // //               <h2 className="text-xl font-bold">Urgent/Important Meetings</h2>
// // // // // // // // //               <button
// // // // // // // // //                 onClick={fetchImportantEvents}
// // // // // // // // //                 className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
// // // // // // // // //               >
// // // // // // // // //                 Show
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //             {showImportant ? (
// // // // // // // // //               <ul>
// // // // // // // // //                 {importantEvents.length === 0 ? (
// // // // // // // // //                   <p>No urgent/important meetings today.</p>
// // // // // // // // //                 ) : (
// // // // // // // // //                   importantEvents.map((event, index) => (
// // // // // // // // //                     <li key={index} className="border-b py-2">
// // // // // // // // //                       <strong>{event.summary}</strong>
// // // // // // // // //                       <br />
// // // // // // // // //                       {event.start?.dateTime
// // // // // // // // //                         ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // // //                         : "No time info"}
// // // // // // // // //                     </li>
// // // // // // // // //                   ))
// // // // // // // // //                 )}
// // // // // // // // //               </ul>
// // // // // // // // //             ) : (
// // // // // // // // //               <p className="text-gray-500">Click the button to view important meetings.</p>
// // // // // // // // //             )}
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default App;









// // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // import axios from "axios";

// // // // // // // // function App() {
// // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // //   const [showImportant, setShowImportant] = useState(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     const checkAuth = async () => {
// // // // // // // //       try {
// // // // // // // //         const res = await axios.get("http://localhost:5000/api/user", {
// // // // // // // //           withCredentials: true,
// // // // // // // //         });
// // // // // // // //         if (res.data.authenticated) {
// // // // // // // //           setAuthenticated(true);
// // // // // // // //           fetchAllEvents();
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Error checking auth:", err);
// // // // // // // //       }
// // // // // // // //     };

// // // // // // // //     checkAuth();
// // // // // // // //   }, []);

// // // // // // // //   const handleSignIn = () => {
// // // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // // //   };

// // // // // // // //   const fetchAllEvents = async () => {
// // // // // // // //     try {
// // // // // // // //       const res = await axios.get("http://localhost:5000/api/all-events", {
// // // // // // // //         withCredentials: true,
// // // // // // // //       });
// // // // // // // //       setAllEvents(res.data.allEvents || []);
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Error fetching all events:", err);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const fetchImportantEvents = async () => {
// // // // // // // //     try {
// // // // // // // //       const res = await axios.get("http://localhost:5000/api/important-events", {
// // // // // // // //         withCredentials: true,
// // // // // // // //       });
// // // // // // // //       setImportantEvents(res.data || []);
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Error fetching important events:", err);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handleToggleImportant = () => {
// // // // // // // //     if (!showImportant) {
// // // // // // // //       fetchImportantEvents();
// // // // // // // //     }
// // // // // // // //     setShowImportant(!showImportant);
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div className="min-h-screen bg-gray-100 p-8">
// // // // // // // //       {!authenticated ? (
// // // // // // // //         <div className="flex justify-center">
// // // // // // // //           <button
// // // // // // // //             onClick={handleSignIn}
// // // // // // // //             className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
// // // // // // // //           >
// // // // // // // //             Sign in with Google
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //       ) : (
// // // // // // // //         <div className="grid grid-cols-2 gap-8">
// // // // // // // //           {/* Left: All Events */}
// // // // // // // //           <div className="bg-white rounded shadow p-6">
// // // // // // // //             <h2 className="text-xl font-bold mb-4">All Today's Meetings</h2>
// // // // // // // //             <ul>
// // // // // // // //               {allEvents.map((event, index) => (
// // // // // // // //                 <li key={index} className="border-b py-2">
// // // // // // // //                   <strong>{event.summary || "No Title"}</strong>
// // // // // // // //                   <br />
// // // // // // // //                   {event.start?.dateTime
// // // // // // // //                     ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // //                     : "No time info"}
// // // // // // // //                 </li>
// // // // // // // //               ))}
// // // // // // // //             </ul>
// // // // // // // //           </div>

// // // // // // // //           {/* Right: Important Events */}
// // // // // // // //           <div className="bg-white rounded shadow p-6">
// // // // // // // //             <div className="flex justify-between items-center mb-4">
// // // // // // // //               <h2 className="text-xl font-bold">Urgent/Important Meetings</h2>
// // // // // // // //               <button
// // // // // // // //                 onClick={handleToggleImportant}
// // // // // // // //                 className={`px-4 py-1 ${
// // // // // // // //                   showImportant
// // // // // // // //                     ? "bg-red-600 hover:bg-red-700"
// // // // // // // //                     : "bg-green-600 hover:bg-green-700"
// // // // // // // //                 } text-white rounded`}
// // // // // // // //               >
// // // // // // // //                 {showImportant ? "Hide" : "Show"}
// // // // // // // //               </button>
// // // // // // // //             </div>
// // // // // // // //             {showImportant ? (
// // // // // // // //               <ul>
// // // // // // // //                 {importantEvents.length === 0 ? (
// // // // // // // //                   <p>No urgent/important meetings today.</p>
// // // // // // // //                 ) : (
// // // // // // // //                   importantEvents.map((event, index) => (
// // // // // // // //                     <li key={index} className="border-b py-2">
// // // // // // // //                       <strong>{event.summary}</strong>
// // // // // // // //                       <br />
// // // // // // // //                       {event.start?.dateTime
// // // // // // // //                         ? new Date(event.start.dateTime).toLocaleString()
// // // // // // // //                         : "No time info"}
// // // // // // // //                     </li>
// // // // // // // //                   ))
// // // // // // // //                 )}
// // // // // // // //               </ul>
// // // // // // // //             ) : (
// // // // // // // //               <p className="text-gray-500">Click the button to view important meetings.</p>
// // // // // // // //             )}
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default App;



// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import axios from "axios";

// // // // // // // function App() {
// // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // //   const [showImportant, setShowImportant] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     const checkAuth = async () => {
// // // // // // //       try {
// // // // // // //         const res = await axios.get("http://localhost:5000/api/user", {
// // // // // // //           withCredentials: true,
// // // // // // //         });
// // // // // // //         if (res.data.authenticated) {
// // // // // // //           setAuthenticated(true);
// // // // // // //           fetchAllEvents();
// // // // // // //         }
// // // // // // //       } catch (err) {
// // // // // // //         console.error("Auth check failed:", err);
// // // // // // //       }
// // // // // // //     };
// // // // // // //     checkAuth();
// // // // // // //   }, []);

// // // // // // //   const handleSignIn = () => {
// // // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // // //   };

// // // // // // //   const fetchAllEvents = async () => {
// // // // // // //     try {
// // // // // // //       const res = await axios.get("http://localhost:5000/api/all-events", {
// // // // // // //         withCredentials: true,
// // // // // // //       });
// // // // // // //       setAllEvents(res.data.allEvents || []);
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Error fetching events:", err);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const fetchImportantEvents = async () => {
// // // // // // //     try {
// // // // // // //       const res = await axios.get("http://localhost:5000/api/important-events", {
// // // // // // //         withCredentials: true,
// // // // // // //       });
// // // // // // //       setImportantEvents(res.data || []);
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Error fetching important events:", err);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleToggleImportant = () => {
// // // // // // //     if (!showImportant) {
// // // // // // //       fetchImportantEvents();
// // // // // // //     }
// // // // // // //     setShowImportant(!showImportant);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen flex">
// // // // // // //       {/* Left side: Dark Purple */}
// // // // // // //       <div className="w-1/2 bg-purple-900 text-white p-6 font-sans">
// // // // // // //         {!authenticated ? (
// // // // // // //           <div className="flex justify-center items-center h-full">
// // // // // // //             <button
// // // // // // //               onClick={handleSignIn}
// // // // // // //               className="px-8 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-white text-lg shadow-md transition duration-200"
// // // // // // //             >
// // // // // // //               Sign in with Google
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         ) : (
// // // // // // //           <div className="bg-purple-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // // // // // //             <h2 className="text-2xl font-semibold mb-4 border-b border-purple-700 pb-2">
// // // // // // //               All Today's Meetings
// // // // // // //             </h2>
// // // // // // //             <ul className="space-y-3">
// // // // // // //               {allEvents.map((event, index) => (
// // // // // // //                 <li key={index} className="border-b border-purple-700 pb-2">
// // // // // // //                   <strong>{event.summary || "No Title"}</strong>
// // // // // // //                   <br />
// // // // // // //                   <span className="text-gray-300 text-sm">
// // // // // // //                     {event.start?.dateTime
// // // // // // //                       ? new Date(event.start.dateTime).toLocaleString()
// // // // // // //                       : "No time info"}
// // // // // // //                   </span>
// // // // // // //                 </li>
// // // // // // //               ))}
// // // // // // //             </ul>
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>

// // // // // // //       {/* Right side: Dark Black */}
// // // // // // //       <div className="w-1/2 bg-black text-white p-6 font-sans">
// // // // // // //         {authenticated && (
// // // // // // //           <div className="bg-gray-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // // // // // //             <div className="flex justify-between items-center mb-4">
// // // // // // //               <h2 className="text-2xl font-semibold text-red-400 border-b border-gray-700 pb-2">
// // // // // // //                 Urgent/Important Meetings
// // // // // // //               </h2>
// // // // // // //               <button
// // // // // // //                 onClick={handleToggleImportant}
// // // // // // //                 className={`px-4 py-2 rounded-lg text-white transition duration-200 shadow-md ${
// // // // // // //                   showImportant
// // // // // // //                     ? "bg-red-600 hover:bg-red-700"
// // // // // // //                     : "bg-green-600 hover:bg-green-700"
// // // // // // //                 }`}
// // // // // // //               >
// // // // // // //                 {showImportant ? "Hide" : "Show"}
// // // // // // //               </button>
// // // // // // //             </div>
// // // // // // //             {showImportant ? (
// // // // // // //               <ul className="space-y-3">
// // // // // // //                 {importantEvents.length === 0 ? (
// // // // // // //                   <p className="text-gray-300">No urgent/important meetings today.</p>
// // // // // // //                 ) : (
// // // // // // //                   importantEvents.map((event, index) => (
// // // // // // //                     <li key={index} className="border-b border-gray-700 pb-2">
// // // // // // //                       <strong>{event.summary}</strong>
// // // // // // //                       <br />
// // // // // // //                       <span className="text-gray-300 text-sm">
// // // // // // //                         {event.start?.dateTime
// // // // // // //                           ? new Date(event.start.dateTime).toLocaleString()
// // // // // // //                           : "No time info"}
// // // // // // //                       </span>
// // // // // // //                     </li>
// // // // // // //                   ))
// // // // // // //                 )}
// // // // // // //               </ul>
// // // // // // //             ) : (
// // // // // // //               <p className="text-gray-400">Click the button to view important meetings.</p>
// // // // // // //             )}
// // // // // // //           </div>
// // // // // // //         )}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default App;








// // // // // // import { useEffect, useState } from "react";
// // // // // // import axios from "axios";

// // // // // // function App() {
// // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // //   const [showImportant, setShowImportant] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     const checkAuth = async () => {
// // // // // //       try {
// // // // // //         const res = await axios.get("http://localhost:5000/api/user", {
// // // // // //           withCredentials: true,
// // // // // //         });
// // // // // //         if (res.data.authenticated) {
// // // // // //           setAuthenticated(true);
// // // // // //           fetchAllEvents();
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error("Auth check failed:", err);
// // // // // //       }
// // // // // //     };
// // // // // //     checkAuth();
// // // // // //   }, []);

// // // // // //   const handleSignIn = () => {
// // // // // //     window.location.href = "http://localhost:5000/api/auth";
// // // // // //   };

// // // // // //   const fetchAllEvents = async () => {
// // // // // //     try {
// // // // // //       const res = await axios.get("http://localhost:5000/api/all-events", {
// // // // // //         withCredentials: true,
// // // // // //       });
// // // // // //       setAllEvents(res.data.allEvents || []);
// // // // // //     } catch (err) {
// // // // // //       console.error("Error fetching events:", err);
// // // // // //     }
// // // // // //   };

// // // // // //   const fetchImportantEvents = async () => {
// // // // // //     try {
// // // // // //       const res = await axios.get("http://localhost:5000/api/important-events", {
// // // // // //         withCredentials: true,
// // // // // //       });
// // // // // //       setImportantEvents(res.data || []);
// // // // // //     } catch (err) {
// // // // // //       console.error("Error fetching important events:", err);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleToggleImportant = () => {
// // // // // //     if (!showImportant) {
// // // // // //       fetchImportantEvents();
// // // // // //     }
// // // // // //     setShowImportant(!showImportant);
// // // // // //   };

// // // // // //   return (
// // // // // //     <div
// // // // // //       className={`min-h-screen flex font-sans ${
// // // // // //         authenticated
// // // // // //           ? "bg-gradient-to-r from-purple-950 via-black to-gray-900"
// // // // // //           : "bg-purple-900"
// // // // // //       }`}
// // // // // //     >
// // // // // //       {/* Left side */}
// // // // // //       <div className="w-1/2 bg-purple-900 text-white p-6">
// // // // // //         {!authenticated ? (
// // // // // //           <div className="flex justify-center items-center h-full">
// // // // // //             <button
// // // // // //               onClick={handleSignIn}
// // // // // //               className="px-8 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-white text-lg shadow-md transition duration-200"
// // // // // //             >
// // // // // //               Sign in with Google
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         ) : (
// // // // // //           <div className="bg-purple-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // // // // //             <h2 className="text-2xl font-semibold mb-4 border-b border-purple-700 pb-2">
// // // // // //               All Today's Meetings
// // // // // //             </h2>
// // // // // //             <ul className="space-y-3">
// // // // // //               {allEvents.map((event, index) => (
// // // // // //                 <li key={index} className="border-b border-purple-700 pb-2">
// // // // // //                   <strong>{event.summary || "No Title"}</strong>
// // // // // //                   <br />
// // // // // //                   <span className="text-gray-300 text-sm">
// // // // // //                     {event.start?.dateTime
// // // // // //                       ? new Date(event.start.dateTime).toLocaleString()
// // // // // //                       : "No time info"}
// // // // // //                   </span>
// // // // // //                 </li>
// // // // // //               ))}
// // // // // //             </ul>
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>

// // // // // //       {/* Right side */}
// // // // // //       <div className="w-1/2 bg-black text-white p-6">
// // // // // //         {authenticated && (
// // // // // //           <div className="bg-gray-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // // // // //             <div className="flex justify-between items-center mb-4">
// // // // // //               <h2 className="text-2xl font-semibold text-red-400 border-b border-gray-700 pb-2">
// // // // // //                 Urgent/Important Meetings
// // // // // //               </h2>
// // // // // //               <button
// // // // // //                 onClick={handleToggleImportant}
// // // // // //                 className={`px-4 py-2 rounded-lg text-white transition duration-200 shadow-md ${
// // // // // //                   showImportant
// // // // // //                     ? "bg-red-600 hover:bg-red-700"
// // // // // //                     : "bg-green-600 hover:bg-green-700"
// // // // // //                 }`}
// // // // // //               >
// // // // // //                 {showImportant ? "Hide" : "Show"}
// // // // // //               </button>
// // // // // //             </div>
// // // // // //             {showImportant ? (
// // // // // //               <ul className="space-y-3">
// // // // // //                 {importantEvents.length === 0 ? (
// // // // // //                   <p className="text-gray-300">No urgent/important meetings today.</p>
// // // // // //                 ) : (
// // // // // //                   importantEvents.map((event, index) => (
// // // // // //                     <li key={index} className="border-b border-gray-700 pb-2">
// // // // // //                       <strong>{event.summary}</strong>
// // // // // //                       <br />
// // // // // //                       <span className="text-gray-300 text-sm">
// // // // // //                         {event.start?.dateTime
// // // // // //                           ? new Date(event.start.dateTime).toLocaleString()
// // // // // //                           : "No time info"}
// // // // // //                       </span>
// // // // // //                     </li>
// // // // // //                   ))
// // // // // //                 )}
// // // // // //               </ul>
// // // // // //             ) : (
// // // // // //               <p className="text-gray-400">Click the button to view important meetings.</p>
// // // // // //             )}
// // // // // //           </div>
// // // // // //         )}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default App;





// // // import { useEffect, useState } from "react";
// // // import axios from "axios";

// // // function App() {
// // //   const [authenticated, setAuthenticated] = useState(false);
// // //   const [allEvents, setAllEvents] = useState([]);
// // //   const [importantEvents, setImportantEvents] = useState([]);
// // //   const [showImportant, setShowImportant] = useState(false);

// // //   useEffect(() => {
// // //     const checkAuth = async () => {
// // //       try {
// // //         const res = await axios.get("http://localhost:5000/api/user", {
// // //           withCredentials: true,
// // //         });
// // //         if (res.data.authenticated) {
// // //           setAuthenticated(true);
// // //           fetchAllEvents();
// // //         }
// // //       } catch (err) {
// // //         console.error("Auth check failed:", err);
// // //       }
// // //     };
// // //     checkAuth();
// // //   }, []);

// // //   const handleSignIn = () => {
// // //     window.location.href = "http://localhost:5000/api/auth";
// // //   };

// // //   const fetchAllEvents = async () => {
// // //     try {
// // //       const res = await axios.get("http://localhost:5000/api/all-events", {
// // //         withCredentials: true,
// // //       });
// // //       setAllEvents(res.data.allEvents || []);
// // //     } catch (err) {
// // //       console.error("Error fetching all events:", err);
// // //     }
// // //   };

// // //   const fetchImportantEvents = async () => {
// // //     try {
// // //       const res = await axios.get("http://localhost:5000/api/important-events", {
// // //         withCredentials: true,
// // //       });
// // //       setImportantEvents(res.data || []);
// // //     } catch (err) {
// // //       console.error("Error fetching important events:", err);
// // //     }
// // //   };

// // //   const handleToggleImportant = () => {
// // //     if (!showImportant) {
// // //       fetchImportantEvents();
// // //     }
// // //     setShowImportant(!showImportant);
// // //   };

// // //   return (
// // //     <div
// // //       className={`min-h-screen flex font-sans transition-all duration-500 ${
// // //         authenticated
// // //           ? "bg-gradient-to-r from-purple-950 via-black to-gray-900"
// // //           : "bg-purple-900"
// // //       }`}
// // //     >
// // //       {/* Left Panel */}
// // //       <div className="w-1/2 text-white p-6">
// // //         {!authenticated ? (
// // //           <div className="flex justify-center items-center h-full">
// // //             <button
// // //               onClick={handleSignIn}
// // //               className="px-8 py-3 bg-purple-700 hover:bg-purple-600 rounded-lg text-white text-lg shadow-md transition duration-200"
// // //             >
// // //               Sign in with Google
// // //             </button>
// // //           </div>
// // //         ) : (
// // //           <div className="bg-purple-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // //             <h2 className="text-2xl font-semibold mb-4 border-b border-purple-700 pb-2">
// // //               All Today's Meetings
// // //             </h2>
// // //             <ul className="space-y-3">
// // //               {allEvents.map((event, index) => (
// // //                 <li key={index} className="border-b border-purple-700 pb-2">
// // //                   <strong>{event.summary || "No Title"}</strong>
// // //                   <br />
// // //                   <span className="text-gray-300 text-sm">
// // //                     {event.start?.dateTime
// // //                       ? new Date(event.start.dateTime).toLocaleString()
// // //                       : "No time info"}
// // //                   </span>
// // //                 </li>
// // //               ))}
// // //             </ul>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Right Panel */}
// // //       <div className="w-1/2 text-white p-6">
// // //         {authenticated && (
// // //           <div className="bg-gray-900 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
// // //             <div className="flex justify-between items-center mb-4">
// // //               <h2 className="text-2xl font-semibold text-red-400 border-b border-gray-700 pb-2">
// // //                 Urgent/Important Meetings
// // //               </h2>
// // //               <button
// // //                 onClick={handleToggleImportant}
// // //                 className={`px-4 py-2 rounded-lg text-white transition duration-200 shadow-md ${
// // //                   showImportant
// // //                     ? "bg-red-600 hover:bg-red-700"
// // //                     : "bg-green-600 hover:bg-green-700"
// // //                 }`}
// // //               >
// // //                 {showImportant ? "Hide" : "Show"}
// // //               </button>
// // //             </div>
// // //             {showImportant ? (
// // //               <ul className="space-y-3">
// // //                 {importantEvents.length === 0 ? (
// // //                   <p className="text-gray-300">No urgent/important meetings today.</p>
// // //                 ) : (
// // //                   importantEvents.map((event, index) => (
// // //                     <li key={index} className="border-b border-gray-700 pb-2">
// // //                       <strong>{event.summary}</strong>
// // //                       <br />
// // //                       <span className="text-gray-300 text-sm">
// // //                         {event.start?.dateTime
// // //                           ? new Date(event.start.dateTime).toLocaleString()
// // //                           : "No time info"}
// // //                       </span>
// // //                     </li>
// // //                   ))
// // //                 )}
// // //               </ul>
// // //             ) : (
// // //               <p className="text-gray-400">Click the button to view important meetings.</p>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default App;







// // import { useEffect, useState } from "react";
// // import axios from "axios";

// // function App() {
// //   const [authenticated, setAuthenticated] = useState(false);
// //   const [allEvents, setAllEvents] = useState([]);
// //   const [importantEvents, setImportantEvents] = useState([]);
// //   const [showImportant, setShowImportant] = useState(false);

// //   useEffect(() => {
// //     axios.get("http://localhost:5000/api/user", { withCredentials: true })
// //       .then(res => setAuthenticated(res.data.authenticated))
// //       .catch(err => console.log(err));
// //   }, []);

// //   const fetchEvents = () => {
// //     axios.get("http://localhost:5000/api/all-events", { withCredentials: true })
// //       .then(res => {
// //         setAllEvents(res.data.allEvents || []);
// //         setShowImportant(false);
// //       })
// //       .catch(err => console.log(err));
// //   };

// //   const fetchImportantEvents = () => {
// //     axios.get("http://localhost:5000/api/important-events", { withCredentials: true })
// //       .then(res => {
// //         setImportantEvents(res.data || []);
// //         setShowImportant(true);
// //       })
// //       .catch(err => console.log(err));
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1a001a] to-black text-white font-sans">
// //       <header className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-[#100010] shadow-md">
// //         <h1 className="text-2xl font-semibold tracking-wide">🌙 Wake Me When</h1>
// //         {!authenticated && (
// //           <a href="http://localhost:5000/api/auth" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">
// //             Sign in with Google
// //           </a>
// //         )}
// //       </header>

// //       {authenticated && (
// //         <main className="flex flex-1">
// //           {/* All Events */}
// //           <section className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-xl font-bold">All Meetings</h2>
// //               <button
// //                 onClick={fetchEvents}
// //                 className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-1 rounded"
// //               >
// //                 Refresh
// //               </button>
// //             </div>
// //             {allEvents.length === 0 && <p className="text-gray-400">No events loaded yet.</p>}
// //             {allEvents.map((event, index) => (
// //               <div key={index} className="mb-4 p-4 bg-gray-900 rounded shadow-sm">
// //                 <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
// //                 <p className="text-sm text-gray-400">
// //                   {event.start?.dateTime?.slice(0, 16)} - {event.end?.dateTime?.slice(0, 16)}
// //                 </p>
// //               </div>
// //             ))}
// //           </section>

// //           {/* Important Events */}
// //           <section className="w-1/2 p-6 overflow-y-auto">
// //             <div className="flex items-center justify-between mb-4">
// //               <h2 className="text-xl font-bold">Urgent / Important</h2>
// //               <button
// //                 onClick={fetchImportantEvents}
// //                 className="bg-purple-700 hover:bg-purple-800 text-sm px-4 py-1 rounded"
// //               >
// //                 Load Urgent
// //               </button>
// //             </div>
// //             {showImportant && importantEvents.length === 0 && (
// //               <p className="text-gray-400">No urgent meetings found outside working hours.</p>
// //             )}
// //             {importantEvents.map((event, index) => (
// //               <div key={index} className="mb-4 p-4 bg-purple-950 rounded shadow-md">
// //                 <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
// //                 <p className="text-sm text-gray-300">
// //                   {event.start?.dateTime?.slice(0, 16)} - {event.end?.dateTime?.slice(0, 16)}
// //                 </p>
// //               </div>
// //             ))}
// //           </section>
// //         </main>
// //       )}

// //       <footer className="text-center py-3 text-gray-600 text-sm border-t border-gray-700 bg-[#100010]">
// //         © {new Date().getFullYear()} Wake Me When
// //       </footer>
// //     </div>
// //   );
// // }

// // export default App;








// import { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [allEvents, setAllEvents] = useState([]);
//   const [importantEvents, setImportantEvents] = useState([]);
//   const [showImportant, setShowImportant] = useState(false);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/user", { withCredentials: true })
//       .then(res => setAuthenticated(res.data.authenticated))
//       .catch(err => console.log(err));
//   }, []);

//   const fetchEvents = () => {
//     axios.get("http://localhost:5000/api/all-events", { withCredentials: true })
//       .then(res => {
//         setAllEvents(res.data.allEvents || []);
//         setShowImportant(false);
//       })
//       .catch(err => console.log(err));
//   };

//   const fetchImportantEvents = () => {
//     axios.get("http://localhost:5000/api/important-events", { withCredentials: true })
//       .then(res => {
//         setImportantEvents(res.data || []);
//         setShowImportant(true);
//       })
//       .catch(err => console.log(err));
//   };

//   const formatDateTime = (dateTimeStr) => {
//     if (!dateTimeStr) return "No time";
//     return new Date(dateTimeStr).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "numeric",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1a001a] to-black text-white font-sans">
//       <header className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-[#100010] shadow-md">
//         <h1 className="text-2xl font-semibold tracking-wide">🌙 Wake Me When</h1>
//         {!authenticated && (
//           <a href="http://localhost:5000/api/auth" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">
//             Sign in with Google
//           </a>
//         )}
//       </header>

//       {authenticated && (
//         <main className="flex flex-1">
//           {/* All Events */}
//           <section className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold">All Meetings</h2>
//               <button
//                 onClick={fetchEvents}
//                 className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-1 rounded"
//               >
//                 Refresh
//               </button>
//             </div>
//             {allEvents.length === 0 && <p className="text-gray-400">No events loaded yet.</p>}
//             {allEvents.map((event, index) => (
//               <div key={index} className="mb-4 p-4 bg-gray-900 rounded shadow-sm">
//                 <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
//                 <p className="text-sm text-gray-400">
//                   {formatDateTime(event.start?.dateTime)} - {formatDateTime(event.end?.dateTime)}
//                 </p>
//               </div>
//             ))}
//           </section>

//           {/* Important Events */}
//           <section className="w-1/2 p-6 overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold">Urgent / Important</h2>
//               <button
//                 onClick={fetchImportantEvents}
//                 className="bg-purple-700 hover:bg-purple-800 text-sm px-4 py-1 rounded"
//               >
//                 Load Urgent
//               </button>
//             </div>
//             {showImportant && importantEvents.length === 0 && (
//               <p className="text-gray-400">No urgent meetings found outside working hours.</p>
//             )}
//             {importantEvents.map((event, index) => (
//               <div key={index} className="mb-4 p-4 bg-purple-950 rounded shadow-md">
//                 <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
//                 <p className="text-sm text-gray-300">
//                   {formatDateTime(event.start?.dateTime)} - {formatDateTime(event.end?.dateTime)}
//                 </p>
//               </div>
//             ))}
//           </section>
//         </main>
//       )}

//       <footer className="text-center py-3 text-gray-600 text-sm border-t border-gray-700 bg-[#100010]">
//         © {new Date().getFullYear()} Wake Me When
//       </footer>
//     </div>
//   );
// }

// export default App;







import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [importantEvents, setImportantEvents] = useState([]);
  const [showImportant, setShowImportant] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user", { withCredentials: true })
      .then(res => setAuthenticated(res.data.authenticated))
      .catch(err => console.log(err));
  }, []);

  const fetchEvents = () => {
    axios.get("http://localhost:5000/api/all-events", { withCredentials: true })
      .then(res => {
        setAllEvents(res.data.allEvents || []);
        setShowImportant(false);
      })
      .catch(err => console.log(err));
  };

  const fetchImportantEvents = () => {
    axios.get("http://localhost:5000/api/important-events", { withCredentials: true })
      .then(res => {
        setImportantEvents(res.data || []);
        setShowImportant(true);
      })
      .catch(err => console.log(err));
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "No time";
    return new Date(dateTimeStr).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1a001a] to-black text-white font-sans">
      <header className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-[#100010] shadow-md">
        <h1 className="text-2xl font-semibold tracking-wide">🌙 Wake Me When</h1>
        {!authenticated && (
          <a href="http://localhost:5000/api/auth" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-md transition">
            Sign in with Google
          </a>
        )}
      </header>

      {authenticated && (
        <main className="flex flex-1">
          {/* All Events */}
          <section className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">All Meetings</h2>
              <button
                onClick={fetchEvents}
                className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-1 rounded"
              >
                Refresh
              </button>
            </div>
            {allEvents.length === 0 && <p className="text-gray-400">No events loaded yet.</p>}
            {allEvents.map((event, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-900 rounded shadow-sm">
                <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
                <p className="text-sm text-gray-400">
                  {formatDateTime(event.start?.dateTime)} - {formatDateTime(event.end?.dateTime)}
                </p>
              </div>
            ))}
          </section>

          {/* Important Events */}
          <section className="w-1/2 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Urgent / Important</h2>
              <button
                onClick={fetchImportantEvents}
                className="bg-purple-700 hover:bg-purple-800 text-sm px-4 py-1 rounded"
              >
                Load Urgent
              </button>
            </div>
            {showImportant && importantEvents.length === 0 && (
              <p className="text-gray-400">No urgent meetings found outside working hours.</p>
            )}
            {importantEvents.map((event, index) => (
              <div key={index} className="mb-4 p-4 bg-purple-950 rounded shadow-md">
                <h3 className="text-lg font-semibold">{event.summary || "No title"}</h3>
                <p className="text-sm text-gray-300">
                  {formatDateTime(event.start?.dateTime)} - {formatDateTime(event.end?.dateTime)}
                </p>
              </div>
            ))}
          </section>
        </main>
      )}

      <footer className="text-center py-3 text-gray-600 text-sm border-t border-gray-700 bg-[#100010]">
        © {new Date().getFullYear()} Wake Me When
      </footer>
    </div>
  );
}

export default App;
