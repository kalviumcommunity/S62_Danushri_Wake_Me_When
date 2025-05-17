// // // // // // // // // // // // // // // // // Home.jsx
// // // // // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // // // // // import { Link } from "react-router-dom";

// // // // // // // // // // // // // // // // function Home() {
// // // // // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // // // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // // // // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // // // // // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // // // // //   const [error, setError] = useState("");

// // // // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // // // // // // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // // // // // // // // // // //       .catch((err) => console.error("Error checking authentication:", err));
// // // // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // // // //   const fetchEvents = () => {
// // // // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // // // //         console.log("Fetched all events:", res.data);
// // // // // // // // // // // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // // // // // // // // // // //         setShowImportant(false);
// // // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // // //       })
// // // // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // // //         setError("Error fetching all events. Please try again later.");
// // // // // // // // // // // // // // // //         console.error("Error fetching all events:", err);
// // // // // // // // // // // // // // // //       });
// // // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // // //   const fetchImportantEvents = () => {
// // // // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // // //       .get("http://localhost:5000/api/important-events", { withCredentials: true })
// // // // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // // // //         console.log("Fetched important events:", res.data);
// // // // // // // // // // // // // // // //         setImportantEvents(res.data || []);
// // // // // // // // // // // // // // // //         setShowImportant(true);
// // // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // // //       })
// // // // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // // //         setError("Error fetching important events. Please try again later.");
// // // // // // // // // // // // // // // //         console.error("Error fetching important events:", err);
// // // // // // // // // // // // // // // //         if (err.response) {
// // // // // // // // // // // // // // // //           console.error("Error response:", err.response);
// // // // // // // // // // // // // // // //         } else if (err.request) {
// // // // // // // // // // // // // // // //           console.error("Error request:", err.request);
// // // // // // // // // // // // // // // //         } else {
// // // // // // // // // // // // // // // //           console.error("Error message:", err.message);
// // // // // // // // // // // // // // // //         }
// // // // // // // // // // // // // // // //       });
// // // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // // //   const declineMeeting = (id) => {
// // // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // // //       .delete(`http://localhost:5000/api/meetings/${id}`, { withCredentials: true })
// // // // // // // // // // // // // // // //       .then(() => fetchImportantEvents())
// // // // // // // // // // // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // // //   const markCompleted = (id) => {
// // // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // // //       .put(`http://localhost:5000/api/meetings/${id}`, { status: "Completed" }, { withCredentials: true })
// // // // // // // // // // // // // // // //       .then(() => fetchImportantEvents())
// // // // // // // // // // // // // // // //       .catch((err) => console.error("Error marking meeting completed:", err));
// // // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // //     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
// // // // // // // // // // // // // // // //       <h1>📅 Wake Me When</h1>

// // // // // // // // // // // // // // // //       {!authenticated ? (
// // // // // // // // // // // // // // // //         <a href="http://localhost:5000/api/auth">
// // // // // // // // // // // // // // // //           <button>Sign in with Google</button>
// // // // // // // // // // // // // // // //         </a>
// // // // // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // // // // //         <>
// // // // // // // // // // // // // // // //           <div>
// // // // // // // // // // // // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // // // // // // // // // // // //               Fetch All Events
// // // // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // // // //               onClick={fetchImportantEvents}
// // // // // // // // // // // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // // // // // //             >
// // // // // // // // // // // // // // // //               Show Important Meetings
// // // // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // // // //             <Link to="/config">
// // // // // // // // // // // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // // // // // // // // // // //             </Link>
// // // // // // // // // // // // // // // //           </div>

// // // // // // // // // // // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // // // // // // // // // // //           {error && (
// // // // // // // // // // // // // // // //             <p style={{ color: "red", fontWeight: "bold" }}>
// // // // // // // // // // // // // // // //               {error} Please try again later.
// // // // // // // // // // // // // // // //             </p>
// // // // // // // // // // // // // // // //           )}

// // // // // // // // // // // // // // // //           {showImportant ? (
// // // // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // // // //               <h2>Important Meetings</h2>
// // // // // // // // // // // // // // // //               {importantEvents.length === 0 ? (
// // // // // // // // // // // // // // // //                 <p>No important meetings found.</p>
// // // // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // // // //                 importantEvents.map((meeting) => (
// // // // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // // // //                     key={meeting._id}
// // // // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // // // //                       border: "1px solid #ccc",
// // // // // // // // // // // // // // // //                       margin: "1rem 0",
// // // // // // // // // // // // // // // //                       padding: "1rem",
// // // // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // // //                     <small>{new Date(meeting.start?.dateTime).toLocaleString()}</small>
// // // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // // // //                         marginTop: "1rem",
// // // // // // // // // // // // // // // //                         color: "red",
// // // // // // // // // // // // // // // //                         background: "none",
// // // // // // // // // // // // // // // //                         border: "1px solid red",
// // // // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // // // //                       Decline
// // // // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // // // //                         marginLeft: "0.5rem",
// // // // // // // // // // // // // // // //                         color: "green",
// // // // // // // // // // // // // // // //                         background: "none",
// // // // // // // // // // // // // // // //                         border: "1px solid green",
// // // // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // // // //                       Mark Completed
// // // // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // // // //           ) : (
// // // // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // // // // // // // // // // // //               {allEvents.length === 0 ? (
// // // // // // // // // // // // // // // //                 <p>No events found.</p>
// // // // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // // // //                 allEvents.map((event) => (
// // // // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // // // //                     key={event.id}
// // // // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // // // // // // // // // // //                       padding: "1rem 0",
// // // // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // // // //                     <strong>{event.summary}</strong>
// // // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // // //                     <small>{new Date(event.start?.dateTime).toLocaleString()}</small>
// // // // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // // // //           )}
// // // // // // // // // // // // // // // //         </>
// // // // // // // // // // // // // // // //       )}
// // // // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // // export default Home;




// // // // // // // // // // // // // // // // Home.jsx
// // // // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // // // // import { Link } from "react-router-dom";

// // // // // // // // // // // // // // // function Home() {
// // // // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // // // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // // // // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // // // //   const [error, setError] = useState("");

// // // // // // // // // // // // // // //   // Check if user is authenticated
// // // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // // // // // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // // //         console.error("Error checking authentication:", err);
// // // // // // // // // // // // // // //         setAuthenticated(false);
// // // // // // // // // // // // // // //       });
// // // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // // //   // Fetch all calendar events
// // // // // // // // // // // // // // //   const fetchEvents = () => {
// // // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // // // // // // // // // //         setShowImportant(false);
// // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // //       })
// // // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // //         setError("Error fetching all events.");
// // // // // // // // // // // // // // //         console.error("Fetch all events error:", err);
// // // // // // // // // // // // // // //       });
// // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // //   // Fetch only urgent/important events from MongoDB
// // // // // // // // // // // // // // //   const fetchImportantEvents = () => {
// // // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // //       .get("http://localhost:5000/api/important-events", { withCredentials: true })
// // // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // // //         setImportantEvents(res.data || []);
// // // // // // // // // // // // // // //         setShowImportant(true);
// // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // //       })
// // // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // // //         setError("Error fetching important events.");
// // // // // // // // // // // // // // //         console.error("Fetch important events error:", err);
// // // // // // // // // // // // // // //       });
// // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // //   // Mark meeting as "Completed"
// // // // // // // // // // // // // // //   const markCompleted = (id) => {
// // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // //       .patch(`http://localhost:5000/api/${id}`, { status: "Completed" }, { withCredentials: true })
// // // // // // // // // // // // // // //       .then(() => fetchImportantEvents())
// // // // // // // // // // // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // //   // Decline/Delete meeting
// // // // // // // // // // // // // // //   const declineMeeting = (id) => {
// // // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // // // // // // // // // // //       .then(() => fetchImportantEvents())
// // // // // // // // // // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // // // // // // // // // //   };

// // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // //     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
// // // // // // // // // // // // // // //       <h1>📅 Wake Me When</h1>

// // // // // // // // // // // // // // //       {!authenticated ? (
// // // // // // // // // // // // // // //         <a href="http://localhost:5000/api/auth">
// // // // // // // // // // // // // // //           <button>Sign in with Google</button>
// // // // // // // // // // // // // // //         </a>
// // // // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // // // //         <>
// // // // // // // // // // // // // // //           <div>
// // // // // // // // // // // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // // // // // // // // // // //               Fetch All Events
// // // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // // //               onClick={fetchImportantEvents}
// // // // // // // // // // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // // // // //             >
// // // // // // // // // // // // // // //               Show Important Meetings
// // // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // // //             <Link to="/config">
// // // // // // // // // // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // // // // // // // // // //             </Link>
// // // // // // // // // // // // // // //           </div>

// // // // // // // // // // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // // // // // // // // // //           {error && (
// // // // // // // // // // // // // // //             <p style={{ color: "red", fontWeight: "bold" }}>
// // // // // // // // // // // // // // //               {error} Please try again later.
// // // // // // // // // // // // // // //             </p>
// // // // // // // // // // // // // // //           )}

// // // // // // // // // // // // // // //           {showImportant ? (
// // // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // // //               <h2>Important Meetings</h2>
// // // // // // // // // // // // // // //               {importantEvents.length === 0 ? (
// // // // // // // // // // // // // // //                 <p>No important meetings found.</p>
// // // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // // //                 importantEvents.map((meeting) => (
// // // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // // //                     key={meeting._id}
// // // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // // //                       border: "1px solid #ccc",
// // // // // // // // // // // // // // //                       margin: "1rem 0",
// // // // // // // // // // // // // // //                       padding: "1rem",
// // // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // // //                         marginTop: "1rem",
// // // // // // // // // // // // // // //                         color: "red",
// // // // // // // // // // // // // // //                         background: "none",
// // // // // // // // // // // // // // //                         border: "1px solid red",
// // // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // // //                       Decline
// // // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // // //                         marginLeft: "0.5rem",
// // // // // // // // // // // // // // //                         color: "green",
// // // // // // // // // // // // // // //                         background: "none",
// // // // // // // // // // // // // // //                         border: "1px solid green",
// // // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // // //                       Mark Completed
// // // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // // //           ) : (
// // // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // // // // // // // // // // //               {allEvents.length === 0 ? (
// // // // // // // // // // // // // // //                 <p>No events found.</p>
// // // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // // //                 allEvents.map((event) => (
// // // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // // //                     key={event.id}
// // // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // // // // // // // // // //                       padding: "1rem 0",
// // // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // // //                     <strong>{event.summary}</strong>
// // // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // // //           )}
// // // // // // // // // // // // // // //         </>
// // // // // // // // // // // // // // //       )}
// // // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // }

// // // // // // // // // // // // // // // export default Home;



// // // // // // // // // // // // // // // Home.jsx
// // // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // // // import { Link } from "react-router-dom";

// // // // // // // // // // // // // // function Home() {
// // // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // // // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // // //   const [error, setError] = useState("");

// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // // // // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // //         console.error("Error checking authentication:", err);
// // // // // // // // // // // // // //         setAuthenticated(false);
// // // // // // // // // // // // // //       });
// // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // //   const fetchEvents = () => {
// // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // // // // // // // // //         setShowImportant(false);
// // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // //       })
// // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // //         setError("Error fetching all events.");
// // // // // // // // // // // // // //         console.error("Fetch all events error:", err);
// // // // // // // // // // // // // //       });
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const fetchImportantEvents = () => {
// // // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // //       .get("http://localhost:5000/api/important-events", {
// // // // // // // // // // // // // //         withCredentials: true,
// // // // // // // // // // // // // //       })
// // // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // // //         setImportantEvents(res.data || []);
// // // // // // // // // // // // // //         setShowImportant(true);
// // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // //       })
// // // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // // //         setError("Error fetching important events.");
// // // // // // // // // // // // // //         console.error("Fetch important events error:", err);
// // // // // // // // // // // // // //       });
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const markCompleted = (id) => {
// // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // //       .patch(`http://localhost:5000/api/${id}`, { status: "Completed" }, { withCredentials: true })
// // // // // // // // // // // // // //       .then(() => {
// // // // // // // // // // // // // //         // Remove completed event locally
// // // // // // // // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // // // // // // // //       })
// // // // // // // // // // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   const declineMeeting = (id) => {
// // // // // // // // // // // // // //     axios
// // // // // // // // // // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // // // // // // // // // //       .then(() => {
// // // // // // // // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // // // // // // // //       })
// // // // // // // // // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // // // // // // // // //   };

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
// // // // // // // // // // // // // //       <h1>📅 Wake Me When</h1>

// // // // // // // // // // // // // //       {!authenticated ? (
// // // // // // // // // // // // // //         <a href="http://localhost:5000/api/auth">
// // // // // // // // // // // // // //           <button>Sign in with Google</button>
// // // // // // // // // // // // // //         </a>
// // // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // // //         <>
// // // // // // // // // // // // // //           <div>
// // // // // // // // // // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // // // // // // // // // //               Fetch All Events
// // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // //             <button
// // // // // // // // // // // // // //               onClick={fetchImportantEvents}
// // // // // // // // // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // // // //             >
// // // // // // // // // // // // // //               Show Important Meetings
// // // // // // // // // // // // // //             </button>
// // // // // // // // // // // // // //             <Link to="/config">
// // // // // // // // // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // // // // // // // // //             </Link>
// // // // // // // // // // // // // //           </div>

// // // // // // // // // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // // // // // // // // //           {error && (
// // // // // // // // // // // // // //             <p style={{ color: "red", fontWeight: "bold" }}>
// // // // // // // // // // // // // //               {error} Please try again later.
// // // // // // // // // // // // // //             </p>
// // // // // // // // // // // // // //           )}

// // // // // // // // // // // // // //           {showImportant ? (
// // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // //               <h2>Important Meetings</h2>
// // // // // // // // // // // // // //               {importantEvents.length === 0 ? (
// // // // // // // // // // // // // //                 <p>No important meetings found.</p>
// // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // //                 importantEvents.map((meeting) => (
// // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // //                     key={meeting._id}
// // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // //                       border: "1px solid #ccc",
// // // // // // // // // // // // // //                       margin: "1rem 0",
// // // // // // // // // // // // // //                       padding: "1rem",
// // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // //                         marginTop: "1rem",
// // // // // // // // // // // // // //                         color: "#fff",
// // // // // // // // // // // // // //                         background: "orange",
// // // // // // // // // // // // // //                         border: "none",
// // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // //                       Decline
// // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // //                     <button
// // // // // // // // // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // // //                         marginLeft: "0.5rem",
// // // // // // // // // // // // // //                         color: "#fff",
// // // // // // // // // // // // // //                         background: "blue",
// // // // // // // // // // // // // //                         border: "none",
// // // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // // //                       }}
// // // // // // // // // // // // // //                     >
// // // // // // // // // // // // // //                       Mark Completed
// // // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // //           ) : (
// // // // // // // // // // // // // //             <div>
// // // // // // // // // // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // // // // // // // // // //               {allEvents.length === 0 ? (
// // // // // // // // // // // // // //                 <p>No events found.</p>
// // // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // // //                 allEvents.map((event) => (
// // // // // // // // // // // // // //                   <div
// // // // // // // // // // // // // //                     key={event.id}
// // // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // // // // // // // // //                       padding: "1rem 0",
// // // // // // // // // // // // // //                     }}
// // // // // // // // // // // // // //                   >
// // // // // // // // // // // // // //                     <strong>{event.summary}</strong>
// // // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // // //                 ))
// // // // // // // // // // // // // //               )}
// // // // // // // // // // // // // //             </div>
// // // // // // // // // // // // // //           )}
// // // // // // // // // // // // // //         </>
// // // // // // // // // // // // // //       )}
// // // // // // // // // // // // // //     </div>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }

// // // // // // // // // // // // // // export default Home;



// // // // // // // // // // // // // // Home.jsx
// // // // // // // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // // // // // // import axios from "axios";
// // // // // // // // // // // // // import { Link } from "react-router-dom";

// // // // // // // // // // // // // // Import your logo image here; adjust path accordingly:
// // // // // // // // // // // // // import logo from "./assets/logo.png";

// // // // // // // // // // // // // function Home() {
// // // // // // // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // //   const [error, setError] = useState("");

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     axios
// // // // // // // // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // // // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // //         console.error("Error checking authentication:", err);
// // // // // // // // // // // // //         setAuthenticated(false);
// // // // // // // // // // // // //       });
// // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // //   const fetchEvents = () => {
// // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // //     axios
// // // // // // // // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // // // // // // // //         setShowImportant(false);
// // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // //         setError("Error fetching all events.");
// // // // // // // // // // // // //         console.error("Fetch all events error:", err);
// // // // // // // // // // // // //       });
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const fetchImportantEvents = () => {
// // // // // // // // // // // // //     setLoading(true);
// // // // // // // // // // // // //     setError("");
// // // // // // // // // // // // //     axios
// // // // // // // // // // // // //       .get("http://localhost:5000/api/important-events", {
// // // // // // // // // // // // //         withCredentials: true,
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .then((res) => {
// // // // // // // // // // // // //         setImportantEvents(res.data || []);
// // // // // // // // // // // // //         setShowImportant(true);
// // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch((err) => {
// // // // // // // // // // // // //         setLoading(false);
// // // // // // // // // // // // //         setError("Error fetching important events.");
// // // // // // // // // // // // //         console.error("Fetch important events error:", err);
// // // // // // // // // // // // //       });
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const markCompleted = (id) => {
// // // // // // // // // // // // //     axios
// // // // // // // // // // // // //       .patch(
// // // // // // // // // // // // //         `http://localhost:5000/api/${id}`,
// // // // // // // // // // // // //         { status: "Completed" },
// // // // // // // // // // // // //         { withCredentials: true }
// // // // // // // // // // // // //       )
// // // // // // // // // // // // //       .then(() => {
// // // // // // // // // // // // //         // Remove completed event locally
// // // // // // // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const declineMeeting = (id) => {
// // // // // // // // // // // // //     axios
// // // // // // // // // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // // // // // // // // //       .then(() => {
// // // // // // // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // // // // // // //       })
// // // // // // // // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div
// // // // // // // // // // // // //       style={{
// // // // // // // // // // // // //         padding: "2rem",
// // // // // // // // // // // // //         fontFamily: "Arial, sans-serif",
// // // // // // // // // // // // //         maxWidth: "700px",
// // // // // // // // // // // // //         margin: "0 auto",
// // // // // // // // // // // // //       }}
// // // // // // // // // // // // //     >
// // // // // // // // // // // // //       {/* Logo + tagline container */}
// // // // // // // // // // // // //       <div
// // // // // // // // // // // // //         style={{
// // // // // // // // // // // // //           display: "flex",
// // // // // // // // // // // // //           flexDirection: "column",
// // // // // // // // // // // // //           alignItems: "center",
// // // // // // // // // // // // //           marginBottom: "1.5rem",
// // // // // // // // // // // // //         }}
// // // // // // // // // // // // //       >
// // // // // // // // // // // // //         <img
// // // // // // // // // // // // //           src={logo}
// // // // // // // // // // // // //           alt="Wake Me When Logo"
// // // // // // // // // // // // //           style={{ height: "70px", marginBottom: "0.5rem" }}
// // // // // // // // // // // // //         />
// // // // // // // // // // // // //         <div
// // // // // // // // // // // // //           style={{
// // // // // // // // // // // // //             backgroundColor: "#fffae6",
// // // // // // // // // // // // //             color: "#856404",
// // // // // // // // // // // // //             padding: "0.5rem 1rem",
// // // // // // // // // // // // //             borderRadius: "5px",
// // // // // // // // // // // // //             border: "1px solid #ffeeba",
// // // // // // // // // // // // //             fontWeight: "600",
// // // // // // // // // // // // //             fontSize: "1rem",
// // // // // // // // // // // // //             textAlign: "center",
// // // // // // // // // // // // //             width: "100%",
// // // // // // // // // // // // //             maxWidth: "400px",
// // // // // // // // // // // // //           }}
// // // // // // // // // // // // //           role="alert"
// // // // // // // // // // // // //         >
// // // // // // // // // // // // //           Alert. Aware. Always on time.
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //       </div>

// // // // // // // // // // // // //       <h1 style={{ textAlign: "center" }}>📅 Wake Me When</h1>

// // // // // // // // // // // // //       {!authenticated ? (
// // // // // // // // // // // // //         <a href="http://localhost:5000/api/auth" style={{ display: "flex", justifyContent: "center" }}>
// // // // // // // // // // // // //           <button>Sign in with Google</button>
// // // // // // // // // // // // //         </a>
// // // // // // // // // // // // //       ) : (
// // // // // // // // // // // // //         <>
// // // // // // // // // // // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // // // // // // // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // // // // // // // // //               Fetch All Events
// // // // // // // // // // // // //             </button>
// // // // // // // // // // // // //             <button
// // // // // // // // // // // // //               onClick={fetchImportantEvents}
// // // // // // // // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               Show Important Meetings
// // // // // // // // // // // // //             </button>
// // // // // // // // // // // // //             <Link to="/config">
// // // // // // // // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // // // // // // // //             </Link>
// // // // // // // // // // // // //           </div>

// // // // // // // // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // // // // // // // //           {error && (
// // // // // // // // // // // // //             <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
// // // // // // // // // // // // //               {error} Please try again later.
// // // // // // // // // // // // //             </p>
// // // // // // // // // // // // //           )}

// // // // // // // // // // // // //           {showImportant ? (
// // // // // // // // // // // // //             <div>
// // // // // // // // // // // // //               <h2>Important Meetings</h2>
// // // // // // // // // // // // //               {importantEvents.length === 0 ? (
// // // // // // // // // // // // //                 <p>No important meetings found.</p>
// // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // //                 importantEvents.map((meeting) => (
// // // // // // // // // // // // //                   <div
// // // // // // // // // // // // //                     key={meeting._id}
// // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // //                       border: "1px solid #ccc",
// // // // // // // // // // // // //                       margin: "1rem 0",
// // // // // // // // // // // // //                       padding: "1rem",
// // // // // // // // // // // // //                     }}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // //                     <button
// // // // // // // // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // //                         marginTop: "1rem",
// // // // // // // // // // // // //                         color: "#fff",
// // // // // // // // // // // // //                         background: "orange",
// // // // // // // // // // // // //                         border: "none",
// // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // //                       }}
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       Decline
// // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // //                     <button
// // // // // // // // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // // // // // // // //                       style={{
// // // // // // // // // // // // //                         marginLeft: "0.5rem",
// // // // // // // // // // // // //                         color: "#fff",
// // // // // // // // // // // // //                         background: "blue",
// // // // // // // // // // // // //                         border: "none",
// // // // // // // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // // // // // // //                         cursor: "pointer",
// // // // // // // // // // // // //                       }}
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       Mark Completed
// // // // // // // // // // // // //                     </button>
// // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // //                 ))
// // // // // // // // // // // // //               )}
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //           ) : (
// // // // // // // // // // // // //             <div>
// // // // // // // // // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // // // // // // // // //               {allEvents.length === 0 ? (
// // // // // // // // // // // // //                 <p>No events found.</p>
// // // // // // // // // // // // //               ) : (
// // // // // // // // // // // // //                 allEvents.map((event) => (
// // // // // // // // // // // // //                   <div
// // // // // // // // // // // // //                     key={event.id}
// // // // // // // // // // // // //                     style={{
// // // // // // // // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // // // // // // // //                       padding: "1rem 0",
// // // // // // // // // // // // //                     }}
// // // // // // // // // // // // //                   >
// // // // // // // // // // // // //                     <strong>{event.summary}</strong>
// // // // // // // // // // // // //                     <br />
// // // // // // // // // // // // //                     <small>
// // // // // // // // // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // // // // // // // // //                     </small>
// // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // //                 ))
// // // // // // // // // // // // //               )}
// // // // // // // // // // // // //             </div>
// // // // // // // // // // // // //           )}
// // // // // // // // // // // // //         </>
// // // // // // // // // // // // //       )}
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export default Home;



// // // // // // // // import { useEffect, useState } from "react";
// // // // // // // // import axios from "axios";
// // // // // // // // import { Link } from "react-router-dom";

// // // // // // // // // Make sure the path to logo is correct
// // // // // // // // import logo from "./assets/logo.jpg";

// // // // // // // // function Home() {
// // // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [error, setError] = useState("");

// // // // // // // //   useEffect(() => {
// // // // // // // //     axios
// // // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // // //       .catch((err) => {
// // // // // // // //         console.error("Error checking authentication:", err);
// // // // // // // //         setAuthenticated(false);
// // // // // // // //       });
// // // // // // // //   }, []);

// // // // // // // //   const fetchEvents = () => {
// // // // // // // //     setLoading(true);
// // // // // // // //     setError("");
// // // // // // // //     axios
// // // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // // //       .then((res) => {
// // // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // // //         setShowImportant(false);
// // // // // // // //         setLoading(false);
// // // // // // // //       })
// // // // // // // //       .catch((err) => {
// // // // // // // //         setLoading(false);
// // // // // // // //         setError("Error fetching all events.");
// // // // // // // //         console.error("Fetch all events error:", err);
// // // // // // // //       });
// // // // // // // //   };

// // // // // // // //   const fetchImportantEvents = () => {
// // // // // // // //     setLoading(true);
// // // // // // // //     setError("");
// // // // // // // //     axios
// // // // // // // //       .get("http://localhost:5000/api/important-events", {
// // // // // // // //         withCredentials: true,
// // // // // // // //       })
// // // // // // // //       .then((res) => {
// // // // // // // //         setImportantEvents(res.data || []);
// // // // // // // //         setShowImportant(true);
// // // // // // // //         setLoading(false);
// // // // // // // //       })
// // // // // // // //       .catch((err) => {
// // // // // // // //         setLoading(false);
// // // // // // // //         setError("Error fetching important events.");
// // // // // // // //         console.error("Fetch important events error:", err);
// // // // // // // //       });
// // // // // // // //   };

// // // // // // // //   const markCompleted = (id) => {
// // // // // // // //     axios
// // // // // // // //       .patch(
// // // // // // // //         `http://localhost:5000/api/${id}`,
// // // // // // // //         { status: "Completed" },
// // // // // // // //         { withCredentials: true }
// // // // // // // //       )
// // // // // // // //       .then(() => {
// // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // //       })
// // // // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // // // //   };

// // // // // // // //   const declineMeeting = (id) => {
// // // // // // // //     axios
// // // // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // // // //       .then(() => {
// // // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // // //       })
// // // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <div
// // // // // // // //       style={{
// // // // // // // //         padding: "2rem",
// // // // // // // //         fontFamily: "Arial, sans-serif",
// // // // // // // //         maxWidth: "700px",
// // // // // // // //         margin: "0 auto",
// // // // // // // //       }}
// // // // // // // //     >
// // // // // // // //       {/* Logo + Tagline */}
// // // // // // // //       <div
// // // // // // // //         style={{
// // // // // // // //           display: "flex",
// // // // // // // //           flexDirection: "column",
// // // // // // // //           alignItems: "center",
// // // // // // // //           marginBottom: "1.5rem",
// // // // // // // //         }}
// // // // // // // //       >
// // // // // // // //         <img
// // // // // // // //           src={logo}
// // // // // // // //           alt="Wake Me When Logo"
// // // // // // // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // // // // // // //         />
// // // // // // // //         <div
// // // // // // // //           style={{
// // // // // // // //             fontWeight: "bold",
// // // // // // // //             fontSize: "1.2rem",
// // // // // // // //             textAlign: "center",
// // // // // // // //           }}
// // // // // // // //         >
// // // // // // // //           Alert. Aware. Always on time.
// // // // // // // //         </div>
// // // // // // // //       </div>

// // // // // // // //       {!authenticated ? (
// // // // // // // //         <a
// // // // // // // //           href="http://localhost:5000/api/auth"
// // // // // // // //           style={{ display: "flex", justifyContent: "center" }}
// // // // // // // //         >
// // // // // // // //           <button>Sign in with Google</button>
// // // // // // // //         </a>
// // // // // // // //       ) : (
// // // // // // // //         <>
// // // // // // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // // // //               All Events
// // // // // // // //             </button>
// // // // // // // //             <button
// // // // // // // //               onClick={fetchImportantEvents}
// // // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // // //               disabled={loading}
// // // // // // // //             >
// // // // // // // //               After Working Hours Events
// // // // // // // //             </button>
// // // // // // // //             <Link to="/config">
// // // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // // //             </Link>
// // // // // // // //           </div>

// // // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // // //           {error && (
// // // // // // // //             <p
// // // // // // // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // // // // // // //             >
// // // // // // // //               {error} Please try again later.
// // // // // // // //             </p>
// // // // // // // //           )}

// // // // // // // //           {showImportant ? (
// // // // // // // //             <div>
// // // // // // // //               <h2>Important Meetings</h2>
// // // // // // // //               {importantEvents.length === 0 ? (
// // // // // // // //                 <p>No important meetings found.</p>
// // // // // // // //               ) : (
// // // // // // // //                 importantEvents.map((meeting) => (
// // // // // // // //                   <div
// // // // // // // //                     key={meeting._id}
// // // // // // // //                     style={{
// // // // // // // //                       border: "1px solid #ccc",
// // // // // // // //                       margin: "1rem 0",
// // // // // // // //                       padding: "1rem",
// // // // // // // //                     }}
// // // // // // // //                   >
// // // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // // //                     <br />
// // // // // // // //                     <small>
// // // // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // // // //                     </small>
// // // // // // // //                     <br />
// // // // // // // //                     <button
// // // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // // //                       style={{
// // // // // // // //                         marginTop: "1rem",
// // // // // // // //                         color: "#CC5500",
// // // // // // // //                         background: "transparent",
// // // // // // // //                         border: "2px solid #CC5500",
// // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // //                         cursor: "pointer",
// // // // // // // //                       }}
// // // // // // // //                     >
// // // // // // // //                       Decline
// // // // // // // //                     </button>
// // // // // // // //                     <button
// // // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // // //                       style={{
// // // // // // // //                         marginLeft: "0.5rem",
// // // // // // // //                         color: "#1E90FF",
// // // // // // // //                         background: "transparent",
// // // // // // // //                         border: "2px solid #1E90FF",
// // // // // // // //                         padding: "0.5rem 1rem",
// // // // // // // //                         cursor: "pointer",
// // // // // // // //                       }}
// // // // // // // //                     >
// // // // // // // //                       Mark Completed
// // // // // // // //                     </button>
// // // // // // // //                   </div>
// // // // // // // //                 ))
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           ) : (
// // // // // // // //             <div>
// // // // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // // // //               {allEvents.length === 0 ? (
// // // // // // // //                 <p>No events found.</p>
// // // // // // // //               ) : (
// // // // // // // //                 allEvents.map((event) => (
// // // // // // // //                   <div
// // // // // // // //                     key={event.id}
// // // // // // // //                     style={{
// // // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // // //                       padding: "1rem 0",
// // // // // // // //                     }}
// // // // // // // //                   >
// // // // // // // //                     <strong>{event.summary}</strong>
// // // // // // // //                     <br />
// // // // // // // //                     <small>
// // // // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // // // //                     </small>
// // // // // // // //                   </div>
// // // // // // // //                 ))
// // // // // // // //               )}
// // // // // // // //             </div>
// // // // // // // //           )}
// // // // // // // //         </>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default Home;



// // // // // // // import { useEffect, useState } from "react";
// // // // // // // import axios from "axios";
// // // // // // // import { Link } from "react-router-dom";

// // // // // // // // Make sure the path to logo is correct
// // // // // // // import logo from "./assets/logo.jpg";

// // // // // // // function Home() {
// // // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [error, setError] = useState("");

// // // // // // //   useEffect(() => {
// // // // // // //     axios
// // // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // // //       .then((res) => setAuthenticated(res.data.authenticated))
// // // // // // //       .catch((err) => {
// // // // // // //         console.error("Error checking authentication:", err);
// // // // // // //         setAuthenticated(false);
// // // // // // //       });
// // // // // // //   }, []);

// // // // // // //   const fetchEvents = () => {
// // // // // // //     setLoading(true);
// // // // // // //     setError("");
// // // // // // //     axios
// // // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // // //       .then((res) => {
// // // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // // //         setShowImportant(false);
// // // // // // //         setLoading(false);
// // // // // // //       })
// // // // // // //       .catch((err) => {
// // // // // // //         setLoading(false);
// // // // // // //         setError("Error fetching all events.");
// // // // // // //         console.error("Fetch all events error:", err);
// // // // // // //       });
// // // // // // //   };

// // // // // // //   const fetchImportantEvents = () => {
// // // // // // //     setLoading(true);
// // // // // // //     setError("");
// // // // // // //     axios
// // // // // // //       .get("http://localhost:5000/api/important-events", {
// // // // // // //         withCredentials: true,
// // // // // // //       })
// // // // // // //       .then((res) => {
// // // // // // //         setImportantEvents(res.data || []);
// // // // // // //         setShowImportant(true);
// // // // // // //         setLoading(false);
// // // // // // //       })
// // // // // // //       .catch((err) => {
// // // // // // //         setLoading(false);
// // // // // // //         setError("Error fetching important events.");
// // // // // // //         console.error("Fetch important events error:", err);
// // // // // // //       });
// // // // // // //   };

// // // // // // //   const markCompleted = (id) => {
// // // // // // //     axios
// // // // // // //       .patch(
// // // // // // //         `http://localhost:5000/api/${id}`,
// // // // // // //         { status: "Completed" },
// // // // // // //         { withCredentials: true }
// // // // // // //       )
// // // // // // //       .then(() => {
// // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // //       })
// // // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // // //   };

// // // // // // //   const declineMeeting = (id) => {
// // // // // // //     axios
// // // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // // //       .then(() => {
// // // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // // //       })
// // // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div
// // // // // // //       style={{
// // // // // // //         padding: "2rem",
// // // // // // //         fontFamily: "Arial, sans-serif",
// // // // // // //         maxWidth: "700px",
// // // // // // //         margin: "0 auto",
// // // // // // //       }}
// // // // // // //     >
// // // // // // //       {/* Logo + Tagline */}
// // // // // // //       <div
// // // // // // //         style={{
// // // // // // //           display: "flex",
// // // // // // //           flexDirection: "column",
// // // // // // //           alignItems: "center",
// // // // // // //           marginBottom: "1.5rem",
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         <img
// // // // // // //           src={logo}
// // // // // // //           alt="Wake Me When Logo"
// // // // // // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // // // // // //         />
// // // // // // //         <div
// // // // // // //           style={{
// // // // // // //             fontWeight: "bold",
// // // // // // //             fontSize: "1.2rem",
// // // // // // //             textAlign: "center",
// // // // // // //           }}
// // // // // // //         >
// // // // // // //           Alert. Aware. Always on time.
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {!authenticated ? (
// // // // // // //         <a
// // // // // // //           href="http://localhost:5000/api/auth"
// // // // // // //           style={{ display: "flex", justifyContent: "center" }}
// // // // // // //         >
// // // // // // //           <button>Sign in with Google</button>
// // // // // // //         </a>
// // // // // // //       ) : (
// // // // // // //         <>
// // // // // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // // // // //             <button onClick={fetchImportantEvents} disabled={loading}>
// // // // // // //               After Working Hours Events
// // // // // // //             </button>
// // // // // // //             <button
// // // // // // //               onClick={fetchEvents}
// // // // // // //               style={{ marginLeft: "1rem" }}
// // // // // // //               disabled={loading}
// // // // // // //             >
// // // // // // //               All Events
// // // // // // //             </button>
// // // // // // //             <Link to="/config">
// // // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // // //             </Link>
// // // // // // //           </div>

// // // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // // //           {error && (
// // // // // // //             <p
// // // // // // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // // // // // //             >
// // // // // // //               {error} Please try again later.
// // // // // // //             </p>
// // // // // // //           )}

// // // // // // //           {showImportant ? (
// // // // // // //             <div>
// // // // // // //               <h2>After Working Hours Meetings</h2>
// // // // // // //               {importantEvents.length === 0 ? (
// // // // // // //                 <p>No important meetings found.</p>
// // // // // // //               ) : (
// // // // // // //                 importantEvents.map((meeting) => (
// // // // // // //                   <div
// // // // // // //                     key={meeting._id}
// // // // // // //                     style={{
// // // // // // //                       border: "1px solid #ccc",
// // // // // // //                       margin: "1rem 0",
// // // // // // //                       padding: "1rem",
// // // // // // //                     }}
// // // // // // //                   >
// // // // // // //                     <strong>{meeting.summary}</strong>
// // // // // // //                     <br />
// // // // // // //                     <small>
// // // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // // //                     </small>
// // // // // // //                     <br />
// // // // // // //                     <button
// // // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // // //                       style={{
// // // // // // //                         marginTop: "1rem",
// // // // // // //                         color: "#CC5500",
// // // // // // //                         background: "transparent",
// // // // // // //                         border: "2px solid #CC5500",
// // // // // // //                         padding: "0.5rem 1rem",
// // // // // // //                         cursor: "pointer",
// // // // // // //                       }}
// // // // // // //                     >
// // // // // // //                       Decline
// // // // // // //                     </button>
// // // // // // //                     <button
// // // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // // //                       style={{
// // // // // // //                         marginLeft: "0.5rem",
// // // // // // //                         color: "#1E90FF",
// // // // // // //                         background: "transparent",
// // // // // // //                         border: "2px solid #1E90FF",
// // // // // // //                         padding: "0.5rem 1rem",
// // // // // // //                         cursor: "pointer",
// // // // // // //                       }}
// // // // // // //                     >
// // // // // // //                       Mark Completed
// // // // // // //                     </button>
// // // // // // //                   </div>
// // // // // // //                 ))
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           ) : (
// // // // // // //             <div>
// // // // // // //               <h2>All Events (Today)</h2>
// // // // // // //               {allEvents.length === 0 ? (
// // // // // // //                 <p>No events found.</p>
// // // // // // //               ) : (
// // // // // // //                 allEvents.map((event) => (
// // // // // // //                   <div
// // // // // // //                     key={event.id}
// // // // // // //                     style={{
// // // // // // //                       borderBottom: "1px solid #ccc",
// // // // // // //                       padding: "1rem 0",
// // // // // // //                     }}
// // // // // // //                   >
// // // // // // //                     <strong>{event.summary}</strong>
// // // // // // //                     <br />
// // // // // // //                     <small>
// // // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // // //                     </small>
// // // // // // //                   </div>
// // // // // // //                 ))
// // // // // // //               )}
// // // // // // //             </div>
// // // // // // //           )}
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // //   export default Home;





// // // // // // import { useEffect, useState } from "react";
// // // // // // import axios from "axios";
// // // // // // import { Link } from "react-router-dom";

// // // // // // // Make sure the path to logo is correct
// // // // // // import logo from "./assets/logo.jpg";

// // // // // // function Home() {
// // // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [error, setError] = useState("");

// // // // // //   useEffect(() => {
// // // // // //     axios
// // // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // // //       .then((res) => {
// // // // // //         setAuthenticated(res.data.authenticated);
// // // // // //         if (res.data.authenticated) {
// // // // // //           fetchImportantEvents(); // Automatically fetch important events
// // // // // //         }
// // // // // //       })
// // // // // //       .catch((err) => {
// // // // // //         console.error("Error checking authentication:", err);
// // // // // //         setAuthenticated(false);
// // // // // //       });
// // // // // //   }, []);

// // // // // //   const fetchEvents = () => {
// // // // // //     setLoading(true);
// // // // // //     setError("");
// // // // // //     axios
// // // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // // //       .then((res) => {
// // // // // //         setAllEvents(res.data.allEvents || []);
// // // // // //         setShowImportant(false);
// // // // // //         setLoading(false);
// // // // // //       })
// // // // // //       .catch((err) => {
// // // // // //         setLoading(false);
// // // // // //         setError("Error fetching all events.");
// // // // // //         console.error("Fetch all events error:", err);
// // // // // //       });
// // // // // //   };

// // // // // //   const fetchImportantEvents = () => {
// // // // // //     setLoading(true);
// // // // // //     setError("");
// // // // // //     axios
// // // // // //       .get("http://localhost:5000/api/important-events", {
// // // // // //         withCredentials: true,
// // // // // //       })
// // // // // //       .then((res) => {
// // // // // //         setImportantEvents(res.data || []);
// // // // // //         setShowImportant(true);
// // // // // //         setLoading(false);
// // // // // //       })
// // // // // //       .catch((err) => {
// // // // // //         setLoading(false);
// // // // // //         setError("Error fetching important events.");
// // // // // //         console.error("Fetch important events error:", err);
// // // // // //       });
// // // // // //   };

// // // // // //   const markCompleted = (id) => {
// // // // // //     axios
// // // // // //       .patch(
// // // // // //         `http://localhost:5000/api/${id}`,
// // // // // //         { status: "Completed" },
// // // // // //         { withCredentials: true }
// // // // // //       )
// // // // // //       .then(() => {
// // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // //       })
// // // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // // //   };

// // // // // //   const declineMeeting = (id) => {
// // // // // //     axios
// // // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // // //       .then(() => {
// // // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // // //       })
// // // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // // //   };

// // // // // //   return (
// // // // // //     <div
// // // // // //       style={{
// // // // // //         padding: "2rem",
// // // // // //         fontFamily: "Arial, sans-serif",
// // // // // //         maxWidth: "700px",
// // // // // //         margin: "0 auto",
// // // // // //       }}
// // // // // //     >
// // // // // //       {/* Logo + Tagline */}
// // // // // //       <div
// // // // // //         style={{
// // // // // //           display: "flex",
// // // // // //           flexDirection: "column",
// // // // // //           alignItems: "center",
// // // // // //           marginBottom: "1.5rem",
// // // // // //         }}
// // // // // //       >
// // // // // //         <img
// // // // // //           src={logo}
// // // // // //           alt="Wake Me When Logo"
// // // // // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // // // // //         />
// // // // // //         <div
// // // // // //           style={{
// // // // // //             fontWeight: "bold",
// // // // // //             fontSize: "1.2rem",
// // // // // //             textAlign: "center",
// // // // // //           }}
// // // // // //         >
// // // // // //           Wake Me When

// // // // // //           Alert. Aware. Always on time.
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {!authenticated ? (
// // // // // //         <a
// // // // // //           href="http://localhost:5000/api/auth"
// // // // // //           style={{ display: "flex", justifyContent: "center" }}
// // // // // //         >
// // // // // //           <button>Sign in with Google</button>
// // // // // //         </a>
// // // // // //       ) : (
// // // // // //         <>
// // // // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // // //               All Events
// // // // // //             </button>
// // // // // //             <button
// // // // // //               onClick={fetchImportantEvents}
// // // // // //               style={{ marginLeft: "1rem" }}
// // // // // //               disabled={loading}
// // // // // //             >
// // // // // //               After Working Hours Events
// // // // // //             </button>
// // // // // //             <Link to="/config">
// // // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // // //             </Link>
// // // // // //           </div>

// // // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // // //           {error && (
// // // // // //             <p
// // // // // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // // // // //             >
// // // // // //               {error} Please try again later.
// // // // // //             </p>
// // // // // //           )}

// // // // // //           {showImportant ? (
// // // // // //             <div>
// // // // // //               <h2>Important Meetings</h2>
// // // // // //               {importantEvents.length === 0 ? (
// // // // // //                 <p>No important meetings found.</p>
// // // // // //               ) : (
// // // // // //                 importantEvents.map((meeting) => (
// // // // // //                   <div
// // // // // //                     key={meeting._id}
// // // // // //                     style={{
// // // // // //                       border: "1px solid #ccc",
// // // // // //                       margin: "1rem 0",
// // // // // //                       padding: "1rem",
// // // // // //                     }}
// // // // // //                   >
// // // // // //                     <strong>{meeting.summary}</strong>
// // // // // //                     <br />
// // // // // //                     <small>
// // // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // // //                     </small>
// // // // // //                     <br />
// // // // // //                     <button
// // // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // // //                       style={{
// // // // // //                         marginTop: "1rem",
// // // // // //                         color: "#CC5500",
// // // // // //                         background: "transparent",
// // // // // //                         border: "2px solid #CC5500",
// // // // // //                         padding: "0.5rem 1rem",
// // // // // //                         cursor: "pointer",
// // // // // //                       }}
// // // // // //                     >
// // // // // //                       Decline
// // // // // //                     </button>
// // // // // //                     <button
// // // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // // //                       style={{
// // // // // //                         marginLeft: "0.5rem",
// // // // // //                         color: "#1E90FF",
// // // // // //                         background: "transparent",
// // // // // //                         border: "2px solid #1E90FF",
// // // // // //                         padding: "0.5rem 1rem",
// // // // // //                         cursor: "pointer",
// // // // // //                       }}
// // // // // //                     >
// // // // // //                       Mark Completed
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                 ))
// // // // // //               )}
// // // // // //             </div>
// // // // // //           ) : (
// // // // // //             <div>
// // // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // // //               {allEvents.length === 0 ? (
// // // // // //                 <p>No events found.</p>
// // // // // //               ) : (
// // // // // //                 allEvents.map((event) => (
// // // // // //                   <div
// // // // // //                     key={event.id}
// // // // // //                     style={{
// // // // // //                       borderBottom: "1px solid #ccc",
// // // // // //                       padding: "1rem 0",
// // // // // //                     }}
// // // // // //                   >
// // // // // //                     <strong>{event.summary}</strong>
// // // // // //                     <br />
// // // // // //                     <small>
// // // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // // //                     </small>
// // // // // //                   </div>
// // // // // //                 ))
// // // // // //               )}
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default Home;




// // // // // import { useEffect, useState } from "react";
// // // // // import axios from "axios";
// // // // // import { Link } from "react-router-dom";

// // // // // // Make sure the path to logo is correct
// // // // // import logo from "./assets/logo.jpg";

// // // // // function Home() {
// // // // //   const [authenticated, setAuthenticated] = useState(false);
// // // // //   const [allEvents, setAllEvents] = useState([]);
// // // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // // //   const [showImportant, setShowImportant] = useState(false);
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [error, setError] = useState("");

// // // // //   useEffect(() => {
// // // // //     axios
// // // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // // //       .then((res) => {
// // // // //         setAuthenticated(res.data.authenticated);
// // // // //         if (res.data.authenticated) {
// // // // //           fetchImportantEvents(); // Automatically fetch important events
// // // // //         }
// // // // //       })
// // // // //       .catch((err) => {
// // // // //         console.error("Error checking authentication:", err);
// // // // //         setAuthenticated(false);
// // // // //       });
// // // // //   }, []);

// // // // //   const fetchEvents = () => {
// // // // //     setLoading(true);
// // // // //     setError("");
// // // // //     axios
// // // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // // //       .then((res) => {
// // // // //         setAllEvents(res.data.allEvents || []);
// // // // //         setShowImportant(false);
// // // // //         setLoading(false);
// // // // //       })
// // // // //       .catch((err) => {
// // // // //         setLoading(false);
// // // // //         setError("Error fetching all events.");
// // // // //         console.error("Fetch all events error:", err);
// // // // //       });
// // // // //   };

// // // // //   const fetchImportantEvents = () => {
// // // // //     setLoading(true);
// // // // //     setError("");
// // // // //     axios
// // // // //       .get("http://localhost:5000/api/important-events", {
// // // // //         withCredentials: true,
// // // // //       })
// // // // //       .then((res) => {
// // // // //         setImportantEvents(res.data || []);
// // // // //         setShowImportant(true);
// // // // //         setLoading(false);
// // // // //       })
// // // // //       .catch((err) => {
// // // // //         setLoading(false);
// // // // //         setError("Error fetching important events.");
// // // // //         console.error("Fetch important events error:", err);
// // // // //       });
// // // // //   };

// // // // //   const markCompleted = (id) => {
// // // // //     axios
// // // // //       .patch(
// // // // //         `http://localhost:5000/api/${id}`,
// // // // //         { status: "Completed" },
// // // // //         { withCredentials: true }
// // // // //       )
// // // // //       .then(() => {
// // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // //       })
// // // // //       .catch((err) => console.error("Error marking completed:", err));
// // // // //   };

// // // // //   const declineMeeting = (id) => {
// // // // //     axios
// // // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // // //       .then(() => {
// // // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // // //       })
// // // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // // //   };

// // // // //   return (
// // // // //     <div
// // // // //       style={{
// // // // //         padding: "2rem",
// // // // //         fontFamily: "Arial, sans-serif",
// // // // //         maxWidth: "700px",
// // // // //         margin: "0 auto",
// // // // //       }}
// // // // //     >
// // // // //       {/* Logo + Tagline */}
// // // // //       <div
// // // // //         style={{
// // // // //           display: "flex",
// // // // //           flexDirection: "column",
// // // // //           alignItems: "center",
// // // // //           marginBottom: "1.5rem",
// // // // //         }}
// // // // //       >
// // // // //         <img
// // // // //           src={logo}
// // // // //           alt="Wake Me When Logo"
// // // // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // // // //         />
// // // // //         <div
// // // // //           style={{
// // // // //             fontWeight: "bold",
// // // // //             fontSize: "2.5rem", // bigger font size for Wake Me When
// // // // //             textAlign: "center",
// // // // //           }}
// // // // //         >
// // // // //           Wake Me When
// // // // //         </div>
// // // // //         <div
// // // // //           style={{
// // // // //             fontSize: "1rem", // smaller font size for tagline
// // // // //             textAlign: "center",
// // // // //             marginTop: "0.3rem",
// // // // //           }}
// // // // //         >
// // // // //           Alert. Aware. Always on time.
// // // // //         </div>
// // // // //       </div>

// // // // //       {!authenticated ? (
// // // // //         <a
// // // // //           href="http://localhost:5000/api/auth"
// // // // //           style={{ display: "flex", justifyContent: "center" }}
// // // // //         >
// // // // //           <button>Sign in with Google</button>
// // // // //         </a>
// // // // //       ) : (
// // // // //         <>
// // // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // // //             <button onClick={fetchEvents} disabled={loading}>
// // // // //               All Events
// // // // //             </button>
// // // // //             <button
// // // // //               onClick={fetchImportantEvents}
// // // // //               style={{ marginLeft: "1rem" }}
// // // // //               disabled={loading}
// // // // //             >
// // // // //               After Working Hours Events
// // // // //             </button>
// // // // //             <Link to="/config">
// // // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // // //             </Link>
// // // // //           </div>

// // // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // // //           {error && (
// // // // //             <p
// // // // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // // // //             >
// // // // //               {error} Please try again later.
// // // // //             </p>
// // // // //           )}

// // // // //           {showImportant ? (
// // // // //             <div>
// // // // //               <h2>Important Meetings</h2>
// // // // //               {importantEvents.length === 0 ? (
// // // // //                 <p>No important meetings found.</p>
// // // // //               ) : (
// // // // //                 importantEvents.map((meeting) => (
// // // // //                   <div
// // // // //                     key={meeting._id}
// // // // //                     style={{
// // // // //                       border: "1px solid #ccc",
// // // // //                       margin: "1rem 0",
// // // // //                       padding: "1rem",
// // // // //                     }}
// // // // //                   >
// // // // //                     <strong>{meeting.summary}</strong>
// // // // //                     <br />
// // // // //                     <small>
// // // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // // //                     </small>
// // // // //                     <br />
// // // // //                     <button
// // // // //                       onClick={() => declineMeeting(meeting._id)}
// // // // //                       style={{
// // // // //                         marginTop: "1rem",
// // // // //                         color: "#CC5500",
// // // // //                         background: "transparent",
// // // // //                         border: "2px solid #CC5500",
// // // // //                         padding: "0.5rem 1rem",
// // // // //                         cursor: "pointer",
// // // // //                       }}
// // // // //                     >
// // // // //                       Decline
// // // // //                     </button>
// // // // //                     <button
// // // // //                       onClick={() => markCompleted(meeting._id)}
// // // // //                       style={{
// // // // //                         marginLeft: "0.5rem",
// // // // //                         color: "#1E90FF",
// // // // //                         background: "transparent",
// // // // //                         border: "2px solid #1E90FF",
// // // // //                         padding: "0.5rem 1rem",
// // // // //                         cursor: "pointer",
// // // // //                       }}
// // // // //                     >
// // // // //                       Mark Completed
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 ))
// // // // //               )}
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div>
// // // // //               <h2>All Events (Today + 1 Day)</h2>
// // // // //               {allEvents.length === 0 ? (
// // // // //                 <p>No events found.</p>
// // // // //               ) : (
// // // // //                 allEvents.map((event) => (
// // // // //                   <div
// // // // //                     key={event.id}
// // // // //                     style={{
// // // // //                       borderBottom: "1px solid #ccc",
// // // // //                       padding: "1rem 0",
// // // // //                     }}
// // // // //                   >
// // // // //                     <strong>{event.summary}</strong>
// // // // //                     <br />
// // // // //                     <small>
// // // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // // //                     </small>
// // // // //                   </div>
// // // // //                 ))
// // // // //               )}
// // // // //             </div>
// // // // //           )}
// // // // //         </>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default Home;



// // // // import { useEffect, useState } from "react";
// // // // import axios from "axios";
// // // // import { Link } from "react-router-dom";
// // // // import logo from "./assets/logo.jpg";

// // // // function Home() {
// // // //   const [authenticated, setAuthenticated] = useState(false);
// // // //   const [allEvents, setAllEvents] = useState([]);
// // // //   const [importantEvents, setImportantEvents] = useState([]);
// // // //   const [showImportant, setShowImportant] = useState(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [error, setError] = useState("");

// // // //   useEffect(() => {
// // // //     axios
// // // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // // //       .then((res) => {
// // // //         setAuthenticated(res.data.authenticated);
// // // //         if (res.data.authenticated) {
// // // //           fetchImportantEvents();
// // // //         }
// // // //       })
// // // //       .catch((err) => {
// // // //         console.error("Error checking authentication:", err);
// // // //         setAuthenticated(false);
// // // //       });
// // // //   }, []);

// // // //   const fetchEvents = () => {
// // // //     setLoading(true);
// // // //     setError("");
// // // //     axios
// // // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // // //       .then((res) => {
// // // //         setAllEvents(res.data.allEvents || []);
// // // //         setShowImportant(false);
// // // //         setLoading(false);
// // // //       })
// // // //       .catch((err) => {
// // // //         setLoading(false);
// // // //         setError("Error fetching all events.");
// // // //         console.error("Fetch all events error:", err);
// // // //       });
// // // //   };

// // // //   const fetchImportantEvents = () => {
// // // //     setLoading(true);
// // // //     setError("");
// // // //     axios
// // // //       .get("http://localhost:5000/api/important-events", {
// // // //         withCredentials: true,
// // // //       })
// // // //       .then((res) => {
// // // //         setImportantEvents(res.data || []);
// // // //         setShowImportant(true);
// // // //         setLoading(false);
// // // //       })
// // // //       .catch((err) => {
// // // //         setLoading(false);
// // // //         setError("Error fetching important events.");
// // // //         console.error("Fetch important events error:", err);
// // // //       });
// // // //   };

// // // //   const markCompleted = (id) => {
// // // //     axios
// // // //       .patch(
// // // //         `http://localhost:5000/api/${id}`,
// // // //         { status: "Completed" },
// // // //         { withCredentials: true }
// // // //       )
// // // //       .then(() => {
// // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // //       })
// // // //       .catch((err) => console.error("Error marking completed:", err));
// // // //   };

// // // //   const declineMeeting = (id) => {
// // // //     axios
// // // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // // //       .then(() => {
// // // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // // //       })
// // // //       .catch((err) => console.error("Error declining meeting:", err));
// // // //   };

// // // //   return (
// // // //     <div
// // // //       style={{
// // // //         padding: "2rem",
// // // //         fontFamily: "Arial, sans-serif",
// // // //         maxWidth: "700px",
// // // //         margin: "0 auto",
// // // //       }}
// // // //     >
// // // //       {/* Logo + Tagline */}
// // // //       <div
// // // //         style={{
// // // //           display: "flex",
// // // //           flexDirection: "column",
// // // //           alignItems: "center",
// // // //           marginBottom: "1.5rem",
// // // //         }}
// // // //       >
// // // //         <img
// // // //           src={logo}
// // // //           alt="Wake Me When Logo"
// // // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // // //         />
// // // //         <div
// // // //           style={{
// // // //             fontWeight: "bold",
// // // //             fontSize: "2.5rem",
// // // //             textAlign: "center",
// // // //             fontFamily: "cursive",
// // // //             background: "linear-gradient(to right, #CC5500, #1E90FF)",
// // // //             WebkitBackgroundClip: "text",
// // // //             WebkitTextFillColor: "transparent",
// // // //           }}
// // // //         >
// // // //           Wake Me When
// // // //         </div>
// // // //         <div
// // // //           style={{
// // // //             fontSize: "1rem",
// // // //             textAlign: "center",
// // // //             marginTop: "0.3rem",
// // // //             fontFamily: "cursive",
// // // //             background: "linear-gradient(to right, #CC5500, #1E90FF)",
// // // //             WebkitBackgroundClip: "text",
// // // //             WebkitTextFillColor: "transparent",
// // // //           }}
// // // //         >
// // // //           Alert. Aware. Always on time.
// // // //         </div>
// // // //       </div>

// // // //       {!authenticated ? (
// // // //         <a
// // // //           href="http://localhost:5000/api/auth"
// // // //           style={{ display: "flex", justifyContent: "center" }}
// // // //         >
// // // //           <button>Sign in with Google</button>
// // // //         </a>
// // // //       ) : (
// // // //         <>
// // // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // // //             <button onClick={fetchEvents} disabled={loading}>
// // // //               All Events
// // // //             </button>
// // // //             <button
// // // //               onClick={fetchImportantEvents}
// // // //               style={{ marginLeft: "1rem" }}
// // // //               disabled={loading}
// // // //             >
// // // //               After Working Hours Events
// // // //             </button>
// // // //             <Link to="/config">
// // // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // // //             </Link>
// // // //           </div>

// // // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // // //           {error && (
// // // //             <p
// // // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // // //             >
// // // //               {error} Please try again later.
// // // //             </p>
// // // //           )}

// // // //           {showImportant ? (
// // // //             <div>
// // // //               <h2>Important Meetings</h2>
// // // //               {importantEvents.length === 0 ? (
// // // //                 <p>No important meetings found.</p>
// // // //               ) : (
// // // //                 importantEvents.map((meeting) => (
// // // //                   <div
// // // //                     key={meeting._id}
// // // //                     style={{
// // // //                       border: "1px solid #ccc",
// // // //                       margin: "1rem 0",
// // // //                       padding: "1rem",
// // // //                     }}
// // // //                   >
// // // //                     <strong>{meeting.summary}</strong>
// // // //                     <br />
// // // //                     <small>
// // // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // // //                     </small>
// // // //                     <br />
// // // //                     <button
// // // //                       onClick={() => declineMeeting(meeting._id)}
// // // //                       style={{
// // // //                         marginTop: "1rem",
// // // //                         color: "#CC5500",
// // // //                         background: "transparent",
// // // //                         border: "2px solid #CC5500",
// // // //                         padding: "0.5rem 1rem",
// // // //                         cursor: "pointer",
// // // //                       }}
// // // //                     >
// // // //                       Decline
// // // //                     </button>
// // // //                     <button
// // // //                       onClick={() => markCompleted(meeting._id)}
// // // //                       style={{
// // // //                         marginLeft: "0.5rem",
// // // //                         color: "#1E90FF",
// // // //                         background: "transparent",
// // // //                         border: "2px solid #1E90FF",
// // // //                         padding: "0.5rem 1rem",
// // // //                         cursor: "pointer",
// // // //                       }}
// // // //                     >
// // // //                       Mark Completed
// // // //                     </button>
// // // //                   </div>
// // // //                 ))
// // // //               )}
// // // //             </div>
// // // //           ) : (
// // // //             <div>
// // // //               <h2>All Events (Today + 1 Day)</h2>
// // // //               {allEvents.length === 0 ? (
// // // //                 <p>No events found.</p>
// // // //               ) : (
// // // //                 allEvents.map((event) => (
// // // //                   <div
// // // //                     key={event.id}
// // // //                     style={{
// // // //                       borderBottom: "1px solid #ccc",
// // // //                       padding: "1rem 0",
// // // //                     }}
// // // //                   >
// // // //                     <strong>{event.summary}</strong>
// // // //                     <br />
// // // //                     <small>
// // // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // // //                     </small>
// // // //                   </div>
// // // //                 ))
// // // //               )}
// // // //             </div>
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default Home;



// // // import { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import { Link } from "react-router-dom";
// // // import logo from "./assets/logo.jpg";

// // // function Home() {
// // //   const [authenticated, setAuthenticated] = useState(false);
// // //   const [allEvents, setAllEvents] = useState([]);
// // //   const [importantEvents, setImportantEvents] = useState([]);
// // //   const [showImportant, setShowImportant] = useState(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");

// // //   useEffect(() => {
// // //     axios
// // //       .get("http://localhost:5000/api/user", { withCredentials: true })
// // //       .then((res) => {
// // //         setAuthenticated(res.data.authenticated);
// // //         if (res.data.authenticated) {
// // //           fetchImportantEvents();
// // //         }
// // //       })
// // //       .catch((err) => {
// // //         console.error("Error checking authentication:", err);
// // //         setAuthenticated(false);
// // //       });
// // //   }, []);

// // //   const fetchEvents = () => {
// // //     setLoading(true);
// // //     setError("");
// // //     axios
// // //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// // //       .then((res) => {
// // //         setAllEvents(res.data.allEvents || []);
// // //         setShowImportant(false);
// // //         setLoading(false);
// // //       })
// // //       .catch((err) => {
// // //         setLoading(false);
// // //         setError("Error fetching all events.");
// // //         console.error("Fetch all events error:", err);
// // //       });
// // //   };

// // //   const fetchImportantEvents = () => {
// // //     setLoading(true);
// // //     setError("");
// // //     axios
// // //       .get("http://localhost:5000/api/important-events", {
// // //         withCredentials: true,
// // //       })
// // //       .then((res) => {
// // //         setImportantEvents(res.data || []);
// // //         setShowImportant(true);
// // //         setLoading(false);
// // //       })
// // //       .catch((err) => {
// // //         setLoading(false);
// // //         setError("Error fetching important events.");
// // //         console.error("Fetch important events error:", err);
// // //       });
// // //   };

// // //   const markCompleted = (id) => {
// // //     axios
// // //       .patch(
// // //         `http://localhost:5000/api/${id}`,
// // //         { status: "Completed" },
// // //         { withCredentials: true }
// // //       )
// // //       .then(() => {
// // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // //       })
// // //       .catch((err) => console.error("Error marking completed:", err));
// // //   };

// // //   const declineMeeting = (id) => {
// // //     axios
// // //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// // //       .then(() => {
// // //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// // //       })
// // //       .catch((err) => console.error("Error declining meeting:", err));
// // //   };

// // //   return (
// // //     <div
// // //       style={{
// // //         padding: "2rem",
// // //         fontFamily: "Arial, sans-serif",
// // //         maxWidth: "700px",
// // //         margin: "0 auto",
// // //       }}
// // //     >
// // //       {/* Logo + Tagline */}
// // //       <div
// // //         style={{
// // //           display: "flex",
// // //           flexDirection: "column",
// // //           alignItems: "center",
// // //           marginBottom: "1.5rem",
// // //         }}
// // //       >
// // //         <img
// // //           src={logo}
// // //           alt="Wake Me When Logo"
// // //           style={{ height: "150px", marginBottom: "0.5rem" }}
// // //         />
// // //         <div
// // //           style={{
// // //             fontWeight: "bold",
// // //             fontSize: "2.5rem",
// // //             textAlign: "center",
// // //             fontFamily: '"Brush Script MT", cursive',
// // //           }}
// // //         >
// // //           Wake Me When
// // //         </div>
// // //         <div
// // //           style={{
// // //             fontSize: "1rem",
// // //             textAlign: "center",
// // //             marginTop: "0.3rem",
// // //             fontFamily: '"Brush Script MT", cursive',
// // //           }}
// // //         >
// // //           Alert. Aware. Always on time.
// // //         </div>
// // //       </div>

// // //       {!authenticated ? (
// // //         <a
// // //           href="http://localhost:5000/api/auth"
// // //           style={{ display: "flex", justifyContent: "center" }}
// // //         >
// // //           <button>Sign in with Google</button>
// // //         </a>
// // //       ) : (
// // //         <>
// // //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// // //             <button onClick={fetchEvents} disabled={loading}>
// // //               All Events
// // //             </button>
// // //             <button
// // //               onClick={fetchImportantEvents}
// // //               style={{ marginLeft: "1rem" }}
// // //               disabled={loading}
// // //             >
// // //               After Working Hours Events
// // //             </button>
// // //             <Link to="/config">
// // //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// // //             </Link>
// // //           </div>

// // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // //           {error && (
// // //             <p
// // //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// // //             >
// // //               {error} Please try again later.
// // //             </p>
// // //           )}

// // //           {showImportant ? (
// // //             <div>
// // //               <h2>Important Meetings</h2>
// // //               {importantEvents.length === 0 ? (
// // //                 <p>No important meetings found.</p>
// // //               ) : (
// // //                 importantEvents.map((meeting) => (
// // //                   <div
// // //                     key={meeting._id}
// // //                     style={{
// // //                       border: "1px solid #ccc",
// // //                       margin: "1rem 0",
// // //                       padding: "1rem",
// // //                     }}
// // //                   >
// // //                     <strong>{meeting.summary}</strong>
// // //                     <br />
// // //                     <small>
// // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // //                     </small>
// // //                     <br />
// // //                     <button
// // //                       onClick={() => declineMeeting(meeting._id)}
// // //                       style={{
// // //                         marginTop: "1rem",
// // //                         color: "#CC5500",
// // //                         background: "transparent",
// // //                         border: "2px solid #CC5500",
// // //                         padding: "0.5rem 1rem",
// // //                         cursor: "pointer",
// // //                       }}
// // //                     >
// // //                       Decline
// // //                     </button>
// // //                     <button
// // //                       onClick={() => markCompleted(meeting._id)}
// // //                       style={{
// // //                         marginLeft: "0.5rem",
// // //                         color: "#1E90FF",
// // //                         background: "transparent",
// // //                         border: "2px solid #1E90FF",
// // //                         padding: "0.5rem 1rem",
// // //                         cursor: "pointer",
// // //                       }}
// // //                     >
// // //                       Mark Completed
// // //                     </button>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>
// // //           ) : (
// // //             <div>
// // //               <h2>All Events (Today + 1 Day)</h2>
// // //               {allEvents.length === 0 ? (
// // //                 <p>No events found.</p>
// // //               ) : (
// // //                 allEvents.map((event) => (
// // //                   <div
// // //                     key={event.id}
// // //                     style={{
// // //                       borderBottom: "1px solid #ccc",
// // //                       padding: "1rem 0",
// // //                     }}
// // //                   >
// // //                     <strong>{event.summary}</strong>
// // //                     <br />
// // //                     <small>
// // //                       {new Date(event.start?.dateTime).toLocaleString()}
// // //                     </small>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>
// // //           )}
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default Home;




// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import logo from "./assets/logo.jpg";

// // // Add Dancing Script font (clearer cursive)
// // const fontLink = document.createElement("link");
// // fontLink.href = "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap";
// // fontLink.rel = "stylesheet";
// // document.head.appendChild(fontLink);

// // function Home() {
// //   const [authenticated, setAuthenticated] = useState(false);
// //   const [allEvents, setAllEvents] = useState([]);
// //   const [importantEvents, setImportantEvents] = useState([]);
// //   const [showImportant, setShowImportant] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     axios
// //       .get("http://localhost:5000/api/user", { withCredentials: true })
// //       .then((res) => {
// //         setAuthenticated(res.data.authenticated);
// //         if (res.data.authenticated) {
// //           fetchImportantEvents();
// //         }
// //       })
// //       .catch((err) => {
// //         console.error("Error checking authentication:", err);
// //         setAuthenticated(false);
// //       });
// //   }, []);

// //   const fetchEvents = () => {
// //     setLoading(true);
// //     setError("");
// //     axios
// //       .get("http://localhost:5000/api/all-events", { withCredentials: true })
// //       .then((res) => {
// //         setAllEvents(res.data.allEvents || []);
// //         setShowImportant(false);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         setLoading(false);
// //         setError("Error fetching all events.");
// //         console.error("Fetch all events error:", err);
// //       });
// //   };

// //   const fetchImportantEvents = () => {
// //     setLoading(true);
// //     setError("");
// //     axios
// //       .get("http://localhost:5000/api/important-events", {
// //         withCredentials: true,
// //       })
// //       .then((res) => {
// //         setImportantEvents(res.data || []);
// //         setShowImportant(true);
// //         setLoading(false);
// //       })
// //       .catch((err) => {
// //         setLoading(false);
// //         setError("Error fetching important events.");
// //         console.error("Fetch important events error:", err);
// //       });
// //   };

// //   const markCompleted = (id) => {
// //     axios
// //       .patch(
// //         `http://localhost:5000/api/${id}`,
// //         { status: "Completed" },
// //         { withCredentials: true }
// //       )
// //       .then(() => {
// //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// //       })
// //       .catch((err) => console.error("Error marking completed:", err));
// //   };

// //   const declineMeeting = (id) => {
// //     axios
// //       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
// //       .then(() => {
// //         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
// //       })
// //       .catch((err) => console.error("Error declining meeting:", err));
// //   };

// //   return (
// //     <div
// //       style={{
// //         padding: "2rem",
// //         fontFamily: "Arial, sans-serif",
// //         maxWidth: "700px",
// //         margin: "0 auto",
// //       }}
// //     >
// //       {/* Logo + Tagline */}
// //       <div
// //         style={{
// //           display: "flex",
// //           flexDirection: "column",
// //           alignItems: "center",
// //           marginBottom: "1.5rem",
// //         }}
// //       >
// //         <img
// //           src={logo}
// //           alt="Wake Me When Logo"
// //           style={{ height: "150px", marginBottom: "0.5rem" }}
// //         />
// //         <div
// //           style={{
// //             fontWeight: "bold",
// //             fontSize: "2.5rem",
// //             textAlign: "center",
// //             fontFamily: "'Dancing Script', cursive",
// //           }}
// //         >
// //           Wake Me When
// //         </div>
// //         <div
// //           style={{
// //             fontSize: "1rem",
// //             textAlign: "right",
// //             alignSelf: "flex-end",
// //             fontFamily: "'Dancing Script', cursive",
// //           }}
// //         >
// //           Alert. Aware. Always on time.
// //         </div>
// //       </div>

// //       {!authenticated ? (
// //         <a
// //           href="http://localhost:5000/api/auth"
// //           style={{ display: "flex", justifyContent: "center" }}
// //         >
// //           <button>Sign in with Google</button>
// //         </a>
// //       ) : (
// //         <>
// //           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
// //             <button onClick={fetchEvents} disabled={loading}>
// //               All Events
// //             </button>
// //             <button
// //               onClick={fetchImportantEvents}
// //               style={{ marginLeft: "1rem" }}
// //               disabled={loading}
// //             >
// //               After Working Hours Events
// //             </button>
// //             <Link to="/config">
// //               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
// //             </Link>
// //           </div>

// //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// //           {error && (
// //             <p
// //               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
// //             >
// //               {error} Please try again later.
// //             </p>
// //           )}

// //           {showImportant ? (
// //             <div>
// //               <h2>Important Meetings</h2>
// //               {importantEvents.length === 0 ? (
// //                 <p>No important meetings found.</p>
// //               ) : (
// //                 importantEvents.map((meeting) => (
// //                   <div
// //                     key={meeting._id}
// //                     style={{
// //                       border: "1px solid #ccc",
// //                       margin: "1rem 0",
// //                       padding: "1rem",
// //                     }}
// //                   >
// //                     <strong>{meeting.summary}</strong>
// //                     <br />
// //                     <small>
// //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// //                     </small>
// //                     <br />
// //                     <button
// //                       onClick={() => declineMeeting(meeting._id)}
// //                       style={{
// //                         marginTop: "1rem",
// //                         color: "#CC5500",
// //                         background: "transparent",
// //                         border: "2px solid #CC5500",
// //                         padding: "0.5rem 1rem",
// //                         cursor: "pointer",
// //                       }}
// //                     >
// //                       Decline
// //                     </button>
// //                     <button
// //                       onClick={() => markCompleted(meeting._id)}
// //                       style={{
// //                         marginLeft: "0.5rem",
// //                         color: "#1E90FF",
// //                         background: "transparent",
// //                         border: "2px solid #1E90FF",
// //                         padding: "0.5rem 1rem",
// //                         cursor: "pointer",
// //                       }}
// //                     >
// //                       Mark Completed
// //                     </button>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           ) : (
// //             <div>
// //               <h2>All Events (Today + 1 Day)</h2>
// //               {allEvents.length === 0 ? (
// //                 <p>No events found.</p>
// //               ) : (
// //                 allEvents.map((event) => (
// //                   <div
// //                     key={event.id}
// //                     style={{
// //                       borderBottom: "1px solid #ccc",
// //                       padding: "1rem 0",
// //                     }}
// //                   >
// //                     <strong>{event.summary}</strong>
// //                     <br />
// //                     <small>
// //                       {new Date(event.start?.dateTime).toLocaleString()}
// //                     </small>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // }

// // export default Home;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import logo from "./assets/logo.jpg";

// // Add Dancing Script font (clearer cursive)
// const fontLink = document.createElement("link");
// fontLink.href = "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap";
// fontLink.rel = "stylesheet";
// document.head.appendChild(fontLink);

// function Home() {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [allEvents, setAllEvents] = useState([]);
//   const [importantEvents, setImportantEvents] = useState([]);
//   const [showImportant, setShowImportant] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/user", { withCredentials: true })
//       .then((res) => {
//         setAuthenticated(res.data.authenticated);
//         if (res.data.authenticated) {
//           fetchImportantEvents();
//         }
//       })
//       .catch((err) => {
//         console.error("Error checking authentication:", err);
//         setAuthenticated(false);
//       });
//   }, []);

//   const fetchEvents = () => {
//     setLoading(true);
//     setError("");
//     axios
//       .get("http://localhost:5000/api/all-events", { withCredentials: true })
//       .then((res) => {
//         setAllEvents(res.data.allEvents || []);
//         setShowImportant(false);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setLoading(false);
//         setError("Error fetching all events.");
//         console.error("Fetch all events error:", err);
//       });
//   };

//   const fetchImportantEvents = () => {
//     setLoading(true);
//     setError("");
//     axios
//       .get("http://localhost:5000/api/important-events", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         setImportantEvents(res.data || []);
//         setShowImportant(true);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setLoading(false);
//         setError("Error fetching important events.");
//         console.error("Fetch important events error:", err);
//       });
//   };

//   const markCompleted = (id) => {
//     axios
//       .patch(
//         `http://localhost:5000/api/${id}`,
//         { status: "Completed" },
//         { withCredentials: true }
//       )
//       .then(() => {
//         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
//       })
//       .catch((err) => console.error("Error marking completed:", err));
//   };

//   const declineMeeting = (id) => {
//     axios
//       .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
//       .then(() => {
//         setImportantEvents((prev) => prev.filter((event) => event._id !== id));
//       })
//       .catch((err) => console.error("Error declining meeting:", err));
//   };

//   return (
//     <div
//       style={{
//         padding: "2rem",
//         fontFamily: "Arial, sans-serif",
//         maxWidth: "700px",
//         margin: "0 auto",
//       }}
//     >
//       {/* Logo + Tagline */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           marginBottom: "1.5rem",
//         }}
//       >
//         <img
//           src={logo}
//           alt="Wake Me When Logo"
//           style={{ height: "150px", marginBottom: "0.5rem" }}
//         />
//         <div
//           style={{
//             fontWeight: "bold",
//             fontSize: "2.5rem",
//             textAlign: "center",
//             fontFamily: "'Dancing Script', cursive",
//             position: "relative",
//           }}
//         >
//          <h> Wake Me When </h>
//           <div
//             style={{
//               fontSize: "1.3rem",
//               fontFamily: "'Dancing Script', cursive",
//               position: "absolute",
//               top: "100%",
//               left: "33%",
//               whiteSpace: "nowrap",
//               marginTop: "0.2rem",
//             }}
//           >
//             <h>
//               Alert. Aware. Always on time.

//             </h>

//           </div>
//         </div>
//       </div>

//       {!authenticated ? (
//         <a
//           href="http://localhost:5000/api/auth"
//           style={{ display: "flex", justifyContent: "center" }}
//         >
//           <button>Sign in with Google</button>
//         </a>
//       ) : (
//         <>
//           <div style={{ textAlign: "center", marginBottom: "1rem" }}>
//             <button onClick={fetchEvents} disabled={loading}>
//               All Events
//             </button>
//             <button
//               onClick={fetchImportantEvents}
//               style={{ marginLeft: "1rem" }}
//               disabled={loading}
//             >
//               After Working Hours Events
//             </button>
//             <Link to="/config">
//               <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
//             </Link>
//           </div>

//           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
//           {error && (
//             <p
//               style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
//             >
//               {error} Please try again later.
//             </p>
//           )}

//           {showImportant ? (
//             <div>
//               <h2>Important Meetings</h2>
//               {importantEvents.length === 0 ? (
//                 <p>No important meetings found.</p>
//               ) : (
//                 importantEvents.map((meeting) => (
//                   <div
//                     key={meeting._id}
//                     style={{
//                       border: "1px solid #ccc",
//                       margin: "1rem 0",
//                       padding: "1rem",
//                     }}
//                   >
//                     <strong>{meeting.summary}</strong>
//                     <br />
//                     <small>
//                       {new Date(meeting.start?.dateTime).toLocaleString()}
//                     </small>
//                     <br />
//                     <button
//                       onClick={() => declineMeeting(meeting._id)}
//                       style={{
//                         marginTop: "1rem",
//                         color: "#CC5500",
//                         background: "transparent",
//                         border: "2px solid #CC5500",
//                         padding: "0.5rem 1rem",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Decline
//                     </button>
//                     <button
//                       onClick={() => markCompleted(meeting._id)}
//                       style={{
//                         marginLeft: "0.5rem",
//                         color: "#1E90FF",
//                         background: "transparent",
//                         border: "2px solid #1E90FF",
//                         padding: "0.5rem 1rem",
//                         cursor: "pointer",
//                       }}
//                     >
//                       Mark Completed
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           ) : (
//             <div>
//               <h2>All Events (Today + 1 Day)</h2>
//               {allEvents.length === 0 ? (
//                 <p>No events found.</p>
//               ) : (
//                 allEvents.map((event) => (
//                   <div
//                     key={event.id}
//                     style={{
//                       borderBottom: "1px solid #ccc",
//                       padding: "1rem 0",
//                     }}
//                   >
//                     <strong>{event.summary}</strong>
//                     <br />
//                     <small>
//                       {new Date(event.start?.dateTime).toLocaleString()}
//                     </small>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Home;




import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from "./assets/logo.jpg";

// Add Dancing Script font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [importantEvents, setImportantEvents] = useState([]);
  const [showImportant, setShowImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user", { withCredentials: true })
      .then((res) => {
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated) {
          fetchImportantEvents();
        }
      })
      .catch((err) => {
        console.error("Error checking authentication:", err);
        setAuthenticated(false);
      });
  }, []);

  const fetchEvents = () => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:5000/api/all-events", { withCredentials: true })
      .then((res) => {
        setAllEvents(res.data.allEvents || []);
        setShowImportant(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Error fetching all events.");
        console.error("Fetch all events error:", err);
      });
  };

  const fetchImportantEvents = () => {
    setLoading(true);
    setError("");
    axios
      .get("http://localhost:5000/api/important-events", {
        withCredentials: true,
      })
      .then((res) => {
        setImportantEvents(res.data || []);
        setShowImportant(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError("Error fetching important events.");
        console.error("Fetch important events error:", err);
      });
  };

  const markCompleted = (id) => {
    axios
      .patch(
        `http://localhost:5000/api/${id}`,
        { status: "Completed" },
        { withCredentials: true }
      )
      .then(() => {
        setImportantEvents((prev) => prev.filter((event) => event._id !== id));
      })
      .catch((err) => console.error("Error marking completed:", err));
  };

  const declineMeeting = (id) => {
    axios
      .delete(`http://localhost:5000/api/${id}`, { withCredentials: true })
      .then(() => {
        setImportantEvents((prev) => prev.filter((event) => event._id !== id));
      })
      .catch((err) => console.error("Error declining meeting:", err));
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        maxWidth: "700px",
        margin: "0 auto",
      }}
    >
      {/* Logo + Tagline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src={logo}
          alt="Wake Me When Logo"
          style={{ height: "150px", marginBottom: "0.5rem" }}
        />
        <div
          style={{
            fontWeight: "bold",
            fontSize: "2.5rem",
            textAlign: "center",
            fontFamily: "'Dancing Script', cursive",
            position: "relative",
          }}
        >
          Wake Me When
          <div
            style={{
              fontSize: "1.3rem",
              fontFamily: "'Dancing Script', cursive",
              position: "absolute",
              top: "100%",
              left: "33%",
              whiteSpace: "nowrap",
              marginTop: "0.2rem",
            }}
          >
            Alert. Aware. Always on time.
          </div>
        </div>
      </div>

      {!authenticated ? (
        <a
          href="http://localhost:5000/api/auth"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <button>Sign in with Google</button>
        </a>
      ) : (
        <>
          {/* Line break added below the logo/title section */}
          <div style={{ height: "2rem" }}></div>

          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button onClick={fetchEvents} disabled={loading}>
              All Events
            </button>
            <button
              onClick={fetchImportantEvents}
              style={{ marginLeft: "1rem" }}
              disabled={loading}
            >
              After Working Hours Events
            </button>
            <Link to="/config">
              <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
            </Link>
          </div>

          {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
          {error && (
            <p
              style={{ color: "red", fontWeight: "bold", textAlign: "center" }}
            >
              {error} Please try again later.
            </p>
          )}

          {showImportant ? (
            <div>
              <h2>Important Meetings</h2>
              {importantEvents.length === 0 ? (
                <p>No important meetings found.</p>
              ) : (
                importantEvents.map((meeting) => (
                  <div
                    key={meeting._id}
                    style={{
                      border: "1px solid #ccc",
                      margin: "1rem 0",
                      padding: "1rem",
                    }}
                  >
                    <strong>{meeting.summary}</strong>
                    <br />
                    <small>
                      {new Date(meeting.start?.dateTime).toLocaleString()}
                    </small>
                    <br />
                    <button
                      onClick={() => declineMeeting(meeting._id)}
                      style={{
                        marginTop: "1rem",
                        color: "#CC5500",
                        background: "transparent",
                        border: "2px solid #CC5500",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => markCompleted(meeting._id)}
                      style={{
                        marginLeft: "0.5rem",
                        color: "#1E90FF",
                        background: "transparent",
                        border: "2px solid #1E90FF",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Mark Completed
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div>
              <h2>All Events (Today + 1 Day)</h2>
              {allEvents.length === 0 ? (
                <p>No events found.</p>
              ) : (
                allEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      borderBottom: "1px solid #ccc",
                      padding: "1rem 0",
                    }}
                  >
                    <strong>{event.summary}</strong>
                    <br />
                    <small>
                      {new Date(event.start?.dateTime).toLocaleString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
