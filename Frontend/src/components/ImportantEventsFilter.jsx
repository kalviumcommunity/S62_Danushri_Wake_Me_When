// import React, { useState, useEffect } from "react";

// export default function ImportantEventsFilter() {
//   // Filter states
//   const [includeWeekends, setIncludeWeekends] = useState(false);
//   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
//   const [alertWindowHours, setAlertWindowHours] = useState(1);
//   const [importantEvents, setImportantEvents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Helper function to fetch filtered important events from backend
//   const fetchImportantEvents = async () => {
//     setLoading(true);
//     try {
//       const query = new URLSearchParams({
//         includeWeekends: includeWeekends.toString(),
//         onlyIfInToList: onlyIfInToList.toString(),
//         alertWindowHours: alertWindowHours.toString(),
//       });

//       const res = await fetch(`/api/important-events?${query.toString()}`, {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch important events");
//       }

//       const events = await res.json();
//       setImportantEvents(events);
//     } catch (error) {
//       console.error(error);
//       setImportantEvents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch events whenever filters change
//   useEffect(() => {
//     fetchImportantEvents();
//   }, [includeWeekends, onlyIfInToList, alertWindowHours]);

//   return (
//     <div className="p-4 max-w-xl mx-auto bg-gray-900 text-white rounded-lg space-y-6">
//       <h2 className="text-2xl font-bold mb-4">Filter Important Events</h2>

//       {/* Include Weekends toggle */}
//       <label className="flex items-center space-x-3">
//         <span>Include Weekends</span>
//         <input
//           type="checkbox"
//           checked={includeWeekends}
//           onChange={(e) => setIncludeWeekends(e.target.checked)}
//           className="toggle-checkbox"
//         />
//       </label>

//       {/* Only if I'm in To List toggle */}
//       <label className="flex items-center space-x-3">
//         <span>Only If I'm in To List</span>
//         <input
//           type="checkbox"
//           checked={onlyIfInToList}
//           onChange={(e) => setOnlyIfInToList(e.target.checked)}
//           className="toggle-checkbox"
//         />
//       </label>

//       {/* Alert window slider */}
//       <label className="flex flex-col space-y-1">
//         <span>Alert me between ± {alertWindowHours} hour(s)</span>
//         <input
//           type="range"
//           min={1}
//           max={8}
//           value={alertWindowHours}
//           onChange={(e) => setAlertWindowHours(Number(e.target.value))}
//           className="w-full"
//         />
//       </label>

//       {/* Display events */}
//       <div>
//         <h3 className="text-xl font-semibold mb-2">Important Events</h3>
//         {loading ? (
//           <p>Loading...</p>
//         ) : importantEvents.length === 0 ? (
//           <p>No events found with current filters.</p>
//         ) : (
//           <ul className="space-y-2 max-h-96 overflow-auto">
//             {importantEvents.map((event) => (
//               <li key={event._id} className="p-3 bg-gray-800 rounded">
//                 <div className="font-semibold">{event.summary}</div>
//                 <div className="text-sm">
//                   Start: {new Date(event.start.dateTime).toLocaleString()}
//                 </div>
//                 <div className="text-sm">
//                   End: {new Date(event.end.dateTime).toLocaleString()}
//                 </div>
//                 <div>Status: {event.status || "Pending"}</div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";

export default function ImportantEventsFilter({ includeWeekends }) {
  // Remove includeWeekends local state
  const [onlyIfInToList, setOnlyIfInToList] = useState(false);
  const [alertWindowHours, setAlertWindowHours] = useState(1);
  const [importantEvents, setImportantEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImportantEvents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        includeWeekends: includeWeekends.toString(),
        onlyIfInToList: onlyIfInToList.toString(),
        alertWindowHours: alertWindowHours.toString(),
      });

      const res = await fetch(`/api/important-events?${query.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch important events");
      }

      const events = await res.json();
      setImportantEvents(events);
    } catch (error) {
      console.error(error);
      setImportantEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImportantEvents();
  }, [includeWeekends, onlyIfInToList, alertWindowHours]);

  return (
    <div className="p-4 max-w-xl mx-auto bg-gray-900 text-white rounded-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4">Filter Important Events</h2>

      {/* Include Weekends toggle (optional here, since in Config) */}
      {/* You can remove this toggle here if you want only Config to control it */}

      <label className="flex items-center space-x-3">
        <span>Only If I'm in To List</span>
        <input
          type="checkbox"
          checked={onlyIfInToList}
          onChange={(e) => setOnlyIfInToList(e.target.checked)}
          className="toggle-checkbox"
        />
      </label>

      <label className="flex flex-col space-y-1">
        <span>Alert me between ± {alertWindowHours} hour(s)</span>
        <input
          type="range"
          min={1}
          max={8}
          value={alertWindowHours}
          onChange={(e) => setAlertWindowHours(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <div>
        <h3 className="text-xl font-semibold mb-2">Important Events</h3>
        {loading ? (
          <p>Loading...</p>
        ) : importantEvents.length === 0 ? (
          <p>No events found with current filters.</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-auto">
            {importantEvents.map((event) => (
              <li key={event._id} className="p-3 bg-gray-800 rounded">
                <div className="font-semibold">{event.summary}</div>
                <div className="text-sm">
                  Start: {new Date(event.start.dateTime).toLocaleString()}
                </div>
                <div className="text-sm">
                  End: {new Date(event.end.dateTime).toLocaleString()}
                </div>
                <div>Status: {event.status || "Pending"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
