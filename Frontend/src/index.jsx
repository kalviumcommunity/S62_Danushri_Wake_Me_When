
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// // Adjust path to your actual logo if needed
// import logo from "./assets/logo.jpg";

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
//       .then((res) => setAuthenticated(res.data.authenticated))
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
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#000",
//         padding: "2rem",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: "800px",
//           textAlign: "center",
//           fontFamily: "Arial, sans-serif",
//           backgroundColor: "#000",
//           padding: "2rem",
//           borderRadius: "10px",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         }}
//       >
//         {/* Logo + Tagline */}
//         <div style={{ marginBottom: "1.5rem" }}>
//           <img
//             src={logo}
//             alt="Wake Me When Logo"
//             style={{ height: "150px", marginBottom: "0.5rem" }}
//           />
//           <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
//             Alert. Aware. Always on time.
//           </div>
//         </div>

//         {!authenticated ? (
//           <a href="http://localhost:5000/api/auth">
//             <button>Sign in with Google</button>
//           </a>
//         ) : (
//           <>
//             <div style={{ marginBottom: "1.5rem" }}>
//               <button onClick={fetchImportantEvents} disabled={loading}>
//                 After Working Hours Events
//               </button>
//               <button
//                 onClick={fetchEvents}
//                 style={{ marginLeft: "1rem" }}
//                 disabled={loading}
//               >
//                 All Events
//               </button>
//               <Link to="/config">
//                 <button style={{ marginLeft: "1rem" }}>⚙️ Preferences</button>
//               </Link>
//             </div>

//             {loading && <div>Loading...</div>}
//             {error && (
//               <p style={{ color: "red", fontWeight: "bold" }}>
//                 {error} Please try again later.
//               </p>
//             )}

//             {showImportant ? (
//               <div>
//                 <h2>After Working Hours Meetings</h2>
//                 {importantEvents.length === 0 ? (
//                   <p>No important meetings found.</p>
//                 ) : (
//                   importantEvents.map((meeting) => (
//                     <div
//                       key={meeting._id}
//                       style={{
//                         border: "1px solid #ccc",
//                         margin: "1rem 0",
//                         padding: "1rem",
//                         borderRadius: "6px",
//                       }}
//                     >
//                       <strong>{meeting.summary}</strong>
//                       <br />
//                       <small>
//                         {new Date(meeting.start?.dateTime).toLocaleString()}
//                       </small>
//                       <br />
//                       <button
//                         onClick={() => declineMeeting(meeting._id)}
//                         style={{
//                           marginTop: "1rem",
//                           color: "#CC5500",
//                           background: "transparent",
//                           border: "2px solid #CC5500",
//                           padding: "0.5rem 1rem",
//                           cursor: "pointer",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         Decline
//                       </button>
//                       <button
//                         onClick={() => markCompleted(meeting._id)}
//                         style={{
//                           marginLeft: "0.5rem",
//                           color: "#1E90FF",
//                           background: "transparent",
//                           border: "2px solid #1E90FF",
//                           padding: "0.5rem 1rem",
//                           cursor: "pointer",
//                           borderRadius: "4px",
//                         }}
//                       >
//                         Mark Completed
//                       </button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <h2>All Events (Today)</h2>
//                 {allEvents.length === 0 ? (
//                   <p>No events found.</p>
//                 ) : (
//                   allEvents.map((event) => (
//                     <div
//                       key={event.id}
//                       style={{
//                         borderBottom: "1px solid #ccc",
//                         padding: "1rem 0",
//                       }}
//                     >
//                       <strong>{event.summary}</strong>
//                       <br />
//                       <small>
//                         {new Date(event.start?.dateTime).toLocaleString()}
//                       </small>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Home;



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
// // //       .then((res) => setAuthenticated(res.data.authenticated))
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
// // //         backgroundColor: "#000",
// // //         color: "#fff",
// // //         minHeight: "100vh",
// // //         padding: "1rem",
// // //         fontFamily: "Arial, sans-serif",
// // //         display: "flex",
// // //         flexDirection: "column",
// // //         alignItems: "center",
// // //       }}
// // //     >
// // //       {/* Logo and Tagline */}
// // //       <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
// // //         <img
// // //           src={logo}
// // //           alt="Wake Me When Logo"
// // //           style={{ height: "120px", marginBottom: "0.5rem" }}
// // //         />
// // //         <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
// // //           Alert. Aware. Always on time.
// // //         </div>
// // //       </div>

// // //       {!authenticated ? (
// // //         <a href="http://localhost:5000/api/auth" style={{ width: "100%" }}>
// // //           <button
// // //             style={{
// // //               width: "100%",
// // //               padding: "1rem",
// // //               backgroundColor: "#1E90FF",
// // //               color: "#fff",
// // //               border: "none",
// // //               borderRadius: "5px",
// // //               fontSize: "1rem",
// // //               cursor: "pointer",
// // //             }}
// // //           >
// // //             Sign in with Google
// // //           </button>
// // //         </a>
// // //       ) : (
// // //         <>
// // //           <div style={{ width: "100%", textAlign: "center", marginBottom: "1rem" }}>
// // //             <button
// // //               onClick={fetchImportantEvents}
// // //               disabled={loading}
// // //               style={{
// // //                 width: "100%",
// // //                 padding: "1rem",
// // //                 marginBottom: "0.5rem",
// // //                 backgroundColor: "#444",
// // //                 color: "#fff",
// // //                 border: "none",
// // //                 borderRadius: "5px",
// // //                 fontSize: "1rem",
// // //               }}
// // //             >
// // //               After Working Hours Events
// // //             </button>
// // //             <button
// // //               onClick={fetchEvents}
// // //               disabled={loading}
// // //               style={{
// // //                 width: "100%",
// // //                 padding: "1rem",
// // //                 marginBottom: "0.5rem",
// // //                 backgroundColor: "#666",
// // //                 color: "#fff",
// // //                 border: "none",
// // //                 borderRadius: "5px",
// // //                 fontSize: "1rem",
// // //               }}
// // //             >
// // //               All Events
// // //             </button>
// // //             <Link to="/config">
// // //               <button
// // //                 style={{
// // //                   width: "100%",
// // //                   padding: "1rem",
// // //                   backgroundColor: "#888",
// // //                   color: "#fff",
// // //                   border: "none",
// // //                   borderRadius: "5px",
// // //                   fontSize: "1rem",
// // //                 }}
// // //               >
// // //                 ⚙️
// // //               </button>
// // //             </Link>
// // //           </div>

// // //           {loading && <div style={{ textAlign: "center" }}>Loading...</div>}
// // //           {error && (
// // //             <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
// // //               {error} Please try again later.
// // //             </p>
// // //           )}

// // //           {showImportant ? (
// // //             <div style={{ width: "100%" }}>
// // //               <h2 style={{ textAlign: "center" }}>After Working Hours Meetings</h2>
// // //               {importantEvents.length === 0 ? (
// // //                 <p style={{ textAlign: "center" }}>No important meetings found.</p>
// // //               ) : (
// // //                 importantEvents.map((meeting) => (
// // //                   <div
// // //                     key={meeting._id}
// // //                     style={{
// // //                       backgroundColor: "#111",
// // //                       padding: "1rem",
// // //                       borderRadius: "8px",
// // //                       marginBottom: "1rem",
// // //                       border: "1px solid #333",
// // //                     }}
// // //                   >
// // //                     <strong>{meeting.summary}</strong>
// // //                     <br />
// // //                     <small>
// // //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// // //                     </small>
// // //                     <br />
// // //                     <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
// // //                       <button
// // //                         onClick={() => declineMeeting(meeting._id)}
// // //                         style={{
// // //                           flex: 1,
// // //                           backgroundColor: "#CC5500",
// // //                           color: "#fff",
// // //                           border: "none",
// // //                           padding: "0.5rem",
// // //                           borderRadius: "4px",
// // //                           cursor: "pointer",
// // //                         }}
// // //                       >
// // //                         Decline
// // //                       </button>
// // //                       <button
// // //                         onClick={() => markCompleted(meeting._id)}
// // //                         style={{
// // //                           flex: 1,
// // //                           backgroundColor: "#1E90FF",
// // //                           color: "#fff",
// // //                           border: "none",
// // //                           padding: "0.5rem",
// // //                           borderRadius: "4px",
// // //                           cursor: "pointer",
// // //                         }}
// // //                       >
// // //                         Mark Completed
// // //                       </button>
// // //                     </div>
// // //                   </div>
// // //                 ))
// // //               )}
// // //             </div>
// // //           ) : (
// // //             <div style={{ width: "100%" }}>
// // //               <h2 style={{ textAlign: "center" }}>All Events (Today)</h2>
// // //               {allEvents.length === 0 ? (
// // //                 <p style={{ textAlign: "center" }}>No events found.</p>
// // //               ) : (
// // //                 allEvents.map((event) => (
// // //                   <div
// // //                     key={event.id}
// // //                     style={{
// // //                       padding: "1rem 0",
// // //                       borderBottom: "1px solid #444",
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
// //       .then((res) => setAuthenticated(res.data.authenticated))
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
// //         backgroundColor: "#000",
// //         color: "#fff",
// //         minHeight: "100vh",
// //         padding: "1rem",
// //         fontFamily: "Arial, sans-serif",
// //       }}
// //     >
// //       {/* Logo and Tagline */}
// //       <div style={{ marginBottom: "1.5rem" }}>
// //         <img
// //           src={logo}
// //           alt="Wake Me When Logo"
// //           style={{ height: "100px", display: "block", marginBottom: "0.5rem" }}
// //         />
// //         <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
// //           Alert. Aware. Always on time.
// //         </div>
// //       </div>

// //       {!authenticated ? (
// //         <a href="http://localhost:5000/api/auth" style={{ textDecoration: "none" }}>
// //           <button
// //             style={{
// //               width: "100%",
// //               padding: "2rem 4rem",
// //               backgroundColor: "#1E90FF",
// //               color: "#fff",
// //               border: "none",
// //               borderRadius: "5px",
// //               fontSize: "1rem",
// //               cursor: "pointer",
// //               marginBottom: "1rem",
// //             }}
// //           >
// //             Sign in with Google
// //           </button>
// //         </a>
// //       ) : (
// //         <>
// //           <div style={{ marginBottom: "1rem" }}>
// //             <button
// //               onClick={fetchImportantEvents}
// //               disabled={loading}
// //               style={{
// //                 width: "100%",
// //                 padding: "1rem",
// //                 marginBottom: "0.5rem",
// //                 backgroundColor: "#444",
// //                 color: "#fff",
// //                 border: "none",
// //                 borderRadius: "5px",
// //                 fontSize: "1rem",
// //               }}
// //             >
// //               After Working Hours Events
// //             </button>
// //             <button
// //               onClick={fetchEvents}
// //               disabled={loading}
// //               style={{
// //                 width: "100%",
// //                 padding: "1rem",
// //                 marginBottom: "0.5rem",
// //                 backgroundColor: "#666",
// //                 color: "#fff",
// //                 border: "none",
// //                 borderRadius: "5px",
// //                 fontSize: "1rem",
// //               }}
// //             >
// //               All Events
// //             </button>
// //             <Link to="/config">
// //               <button
// //                 style={{
// //                   width: "100%",
// //                   padding: "1rem",
// //                   backgroundColor: "#888",
// //                   color: "#fff",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   fontSize: "1rem",
// //                 }}
// //               >
// //                 ⚙️
// //               </button>
// //             </Link>
// //           </div>

// //           {loading && <div>Loading...</div>}
// //           {error && (
// //             <p style={{ color: "red", fontWeight: "bold" }}>
// //               {error} Please try again later.
// //             </p>
// //           )}

// //           {showImportant ? (
// //             <div>
// //               <h2>After Working Hours Meetings</h2>
// //               {importantEvents.length === 0 ? (
// //                 <p>No important meetings found.</p>
// //               ) : (
// //                 importantEvents.map((meeting) => (
// //                   <div
// //                     key={meeting._id}
// //                     style={{
// //                       backgroundColor: "#111",
// //                       padding: "1rem",
// //                       borderRadius: "8px",
// //                       marginBottom: "1rem",
// //                       border: "1px solid #333",
// //                     }}
// //                   >
// //                     <strong>{meeting.summary}</strong>
// //                     <br />
// //                     <small>
// //                       {new Date(meeting.start?.dateTime).toLocaleString()}
// //                     </small>
// //                     <br />
// //                     <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
// //                       <button
// //                         onClick={() => declineMeeting(meeting._id)}
// //                         style={{
// //                           flex: 1,
// //                           backgroundColor: "#CC5500",
// //                           color: "#fff",
// //                           border: "none",
// //                           padding: "0.5rem",
// //                           borderRadius: "4px",
// //                           cursor: "pointer",
// //                         }}
// //                       >
// //                         Decline
// //                       </button>
// //                       <button
// //                         onClick={() => markCompleted(meeting._id)}
// //                         style={{
// //                           flex: 1,
// //                           backgroundColor: "#1E90FF",
// //                           color: "#fff",
// //                           border: "none",
// //                           padding: "0.5rem",
// //                           borderRadius: "4px",
// //                           cursor: "pointer",
// //                         }}
// //                       >
// //                         Mark Completed
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ))
// //               )}
// //             </div>
// //           ) : (
// //             <div>
// //               <h2>All Events (Today)</h2>
// //               {allEvents.length === 0 ? (
// //                 <p>No events found.</p>
// //               ) : (
// //                 allEvents.map((event) => (
// //                   <div
// //                     key={event.id}
// //                     style={{
// //                       padding: "1rem 0",
// //                       borderBottom: "1px solid #444",
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



// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Link } from "react-router-dom";
// // import logo from "./assets/logo.jpg";

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
// //       .then((res) => setAuthenticated(res.data.authenticated))
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
// //         backgroundColor: "#000",
// //         color: "#fff",
// //         minHeight: "100vh",
// //         padding: "2rem 4rem",
// //         fontFamily: "Arial, sans-serif",
// //         display: "flex",
// //         flexDirection: "row",
// //         gap: "2rem",
// //         flexWrap: "wrap",
// //       }}
// //     >
// //       {/* Sidebar */}
// //       <div style={{ width: "250px", minWidth: "220px" }}>
// //         <div style={{ marginBottom: "2rem" }}>
// //           <img
// //             src={logo}
// //             alt="Wake Me When Logo"
// //             style={{ height: "100px", display: "block", marginBottom: "0.5rem" }}
// //           />
// //           <div style={{ fontSize: "1rem", fontWeight: "bold" }}>
// //             Alert. Aware. Always on time.
// //           </div>
// //         </div>

// //         {!authenticated ? (
// //           <a href="http://localhost:5000/api/auth" style={{ textDecoration: "none" }}>
// //             <button
// //               style={{
// //                 width: "100%",
// //                 padding: "1rem",
// //                 backgroundColor: "#1E90FF",
// //                 color: "#fff",
// //                 border: "none",
// //                 borderRadius: "5px",
// //                 fontSize: "1rem",
// //                 cursor: "pointer",
// //                 marginBottom: "1rem",
// //               }}
// //             >
// //               Sign in with Google
// //             </button>
// //           </a>
// //         ) : (
// //           <>
// //             <button
// //               onClick={fetchImportantEvents}
// //               disabled={loading}
// //               style={{
// //                 width: "100%",
// //                 padding: "1rem",
// //                 marginBottom: "0.5rem",
// //                 backgroundColor: "#444",
// //                 color: "#fff",
// //                 border: "none",
// //                 borderRadius: "5px",
// //                 fontSize: "1rem",
// //               }}
// //             >
// //               After Working Hours Events
// //             </button>
// //             <button
// //               onClick={fetchEvents}
// //               disabled={loading}
// //               style={{
// //                 width: "100%",
// //                 padding: "1rem",
// //                 marginBottom: "0.5rem",
// //                 backgroundColor: "#666",
// //                 color: "#fff",
// //                 border: "none",
// //                 borderRadius: "5px",
// //                 fontSize: "1rem",
// //               }}
// //             >
// //               All Events
// //             </button>
// //             <Link to="/config">
// //               <button
// //                 style={{
// //                   width: "100%",
// //                   padding: "1rem",
// //                   backgroundColor: "#888",
// //                   color: "#fff",
// //                   border: "none",
// //                   borderRadius: "5px",
// //                   fontSize: "1rem",
// //                 }}
// //               >
// //                 ⚙️ Config
// //               </button>
// //             </Link>
// //           </>
// //         )}
// //       </div>

// //       {/* Main Content */}
// //       <div style={{ flex: 1, maxWidth: "1000px" }}>
// //         {loading && <div>Loading...</div>}
// //         {error && (
// //           <p style={{ color: "red", fontWeight: "bold" }}>
// //             {error} Please try again later.
// //           </p>
// //         )}

// //         {authenticated && (
// //           <>
// //             {showImportant ? (
// //               <div>
// //                 <h2>After Working Hours Meetings</h2>
// //                 {importantEvents.length === 0 ? (
// //                   <p>No important meetings found.</p>
// //                 ) : (
// //                   importantEvents.map((meeting) => (
// //                     <div
// //                       key={meeting._id}
// //                       style={{
// //                         backgroundColor: "#111",
// //                         padding: "1rem",
// //                         borderRadius: "8px",
// //                         marginBottom: "1rem",
// //                         border: "1px solid #333",
// //                       }}
// //                     >
// //                       <strong>{meeting.summary}</strong>
// //                       <br />
// //                       <small>
// //                         {new Date(meeting.start?.dateTime).toLocaleString()}
// //                       </small>
// //                       <br />
// //                       <div
// //                         style={{
// //                           marginTop: "1rem",
// //                           display: "flex",
// //                           gap: "0.5rem",
// //                         }}
// //                       >
// //                         <button
// //                           onClick={() => declineMeeting(meeting._id)}
// //                           style={{
// //                             flex: 1,
// //                             backgroundColor: "#CC5500",
// //                             color: "#fff",
// //                             border: "none",
// //                             padding: "0.5rem",
// //                             borderRadius: "4px",
// //                             cursor: "pointer",
// //                           }}
// //                         >
// //                           Decline
// //                         </button>
// //                         <button
// //                           onClick={() => markCompleted(meeting._id)}
// //                           style={{
// //                             flex: 1,
// //                             backgroundColor: "#1E90FF",
// //                             color: "#fff",
// //                             border: "none",
// //                             padding: "0.5rem",
// //                             borderRadius: "4px",
// //                             cursor: "pointer",
// //                           }}
// //                         >
// //                           Mark Completed
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             ) : (
// //               <div>
// //                 <h2>All Events (Today)</h2>
// //                 {allEvents.length === 0 ? (
// //                   <p>No events found.</p>
// //                 ) : (
// //                   allEvents.map((event) => (
// //                     <div
// //                       key={event.id}
// //                       style={{
// //                         padding: "1rem 0",
// //                         borderBottom: "1px solid #444",
// //                       }}
// //                     >
// //                       <strong>{event.summary}</strong>
// //                       <br />
// //                       <small>
// //                         {new Date(event.start?.dateTime).toLocaleString()}
// //                       </small>
// //                     </div>
// //                   ))
// //                 )}
// //               </div>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Home;
