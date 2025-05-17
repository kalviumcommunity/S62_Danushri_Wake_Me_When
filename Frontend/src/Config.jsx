// // // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //   Switch,
// // // // // // // // // // //   FormControlLabel,
// // // // // // // // // // //   Slider,
// // // // // // // // // // //   Typography,
// // // // // // // // // // //   Box
// // // // // // // // // // // } from '@mui/material';

// // // // // // // // // // // const Config = () => {
// // // // // // // // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // // // // // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // // // // // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // // // // // // // //   // Load saved settings from localStorage when component mounts
// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const savedIncludeWeekends = JSON.parse(localStorage.getItem('includeWeekends'));
// // // // // // // // // // //     const savedOnlyIfInToList = JSON.parse(localStorage.getItem('onlyIfInToList'));
// // // // // // // // // // //     const savedAlertRange = JSON.parse(localStorage.getItem('alertRange'));

// // // // // // // // // // //     if (savedIncludeWeekends !== null) setIncludeWeekends(savedIncludeWeekends);
// // // // // // // // // // //     if (savedOnlyIfInToList !== null) setOnlyIfInToList(savedOnlyIfInToList);
// // // // // // // // // // //     if (savedAlertRange !== null) setAlertRange(savedAlertRange);
// // // // // // // // // // //   }, []);

// // // // // // // // // // //   // Save settings to localStorage whenever they change
// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     localStorage.setItem('includeWeekends', JSON.stringify(includeWeekends));
// // // // // // // // // // //   }, [includeWeekends]);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     localStorage.setItem('onlyIfInToList', JSON.stringify(onlyIfInToList));
// // // // // // // // // // //   }, [onlyIfInToList]);

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     localStorage.setItem('alertRange', JSON.stringify(alertRange));
// // // // // // // // // // //   }, [alertRange]);

// // // // // // // // // // //   const handleIncludeWeekendsChange = (event) => {
// // // // // // // // // // //     setIncludeWeekends(event.target.checked);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleOnlyIfInToListChange = (event) => {
// // // // // // // // // // //     setOnlyIfInToList(event.target.checked);
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleAlertRangeChange = (event, newValue) => {
// // // // // // // // // // //     setAlertRange(newValue);
// // // // // // // // // // //   };

// // // // // // // // // // //   return (
// // // // // // // // // // //     <Box sx={{ padding: 4 }}>
// // // // // // // // // // //       <Typography variant="h4" gutterBottom>
// // // // // // // // // // //         Configure Settings
// // // // // // // // // // //       </Typography>

// // // // // // // // // // //       <FormControlLabel
// // // // // // // // // // //         control={
// // // // // // // // // // //           <Switch
// // // // // // // // // // //             checked={includeWeekends}
// // // // // // // // // // //             onChange={handleIncludeWeekendsChange}
// // // // // // // // // // //             color="primary"
// // // // // // // // // // //           />
// // // // // // // // // // //         }
// // // // // // // // // // //         label="Include Weekends"
// // // // // // // // // // //       />
// // // // // // // // // // //       <br />

// // // // // // // // // // //       <FormControlLabel
// // // // // // // // // // //         control={
// // // // // // // // // // //           <Switch
// // // // // // // // // // //             checked={onlyIfInToList}
// // // // // // // // // // //             onChange={handleOnlyIfInToListChange}
// // // // // // // // // // //             color="primary"
// // // // // // // // // // //           />
// // // // // // // // // // //         }
// // // // // // // // // // //         label="Only If I'm in To List"
// // // // // // // // // // //       />
// // // // // // // // // // //       <br />

// // // // // // // // // // //       <Box sx={{ width: 300, mt: 4 }}>
// // // // // // // // // // //         <Typography gutterBottom>
// // // // // // // // // // //           Alert me between +/- {alertRange} hrs
// // // // // // // // // // //         </Typography>
// // // // // // // // // // //         <Slider
// // // // // // // // // // //           value={alertRange}
// // // // // // // // // // //           onChange={handleAlertRangeChange}
// // // // // // // // // // //           aria-labelledby="alert-range-slider"
// // // // // // // // // // //           valueLabelDisplay="auto"
// // // // // // // // // // //           step={1}
// // // // // // // // // // //           marks
// // // // // // // // // // //           min={1}
// // // // // // // // // // //           max={8}
// // // // // // // // // // //         />
// // // // // // // // // // //       </Box>
// // // // // // // // // // //     </Box>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default Config;



// // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // import {
// // // // // // // // // //   Switch,
// // // // // // // // // //   FormControlLabel,
// // // // // // // // // //   Slider,
// // // // // // // // // //   Typography,
// // // // // // // // // //   Box,
// // // // // // // // // //   Button,
// // // // // // // // // //   Snackbar,
// // // // // // // // // //   Alert,
// // // // // // // // // // } from "@mui/material";
// // // // // // // // // // import axios from "axios";

// // // // // // // // // // const Config = () => {
// // // // // // // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // // // // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // // // // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // // // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // // // // // // // // //   const [saveError, setSaveError] = useState("");

// // // // // // // // // //   // Load settings from backend on mount
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     axios
// // // // // // // // // //       .get("http://localhost:5000/api/user-settings", { withCredentials: true })
// // // // // // // // // //       .then((res) => {
// // // // // // // // // //         if (res.data) {
// // // // // // // // // //           setIncludeWeekends(res.data.includeWeekends || false);
// // // // // // // // // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // // // // // // // // //           setAlertRange(res.data.alertRange || 1);
// // // // // // // // // //         }
// // // // // // // // // //       })
// // // // // // // // // //       .catch((err) => {
// // // // // // // // // //         console.error("Failed to load settings:", err);
// // // // // // // // // //       });
// // // // // // // // // //   }, []);

// // // // // // // // // //   const handleSave = async () => {
// // // // // // // // // //     setSaving(true);
// // // // // // // // // //     setSaveError("");
// // // // // // // // // //     try {
// // // // // // // // // //       await axios.post(
// // // // // // // // // //         "http://localhost:5000/api/user-settings",
// // // // // // // // // //         { includeWeekends, onlyIfInToList, alertRange },
// // // // // // // // // //         { withCredentials: true }
// // // // // // // // // //       );
// // // // // // // // // //       setSaveSuccess(true);
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       setSaveError("Failed to save settings. Please try again.");
// // // // // // // // // //       console.error(error);
// // // // // // // // // //     } finally {
// // // // // // // // // //       setSaving(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <Box sx={{ padding: 4 }}>
// // // // // // // // // //       <Typography variant="h4" gutterBottom>
// // // // // // // // // //         Configure Settings
// // // // // // // // // //       </Typography>

// // // // // // // // // //       <FormControlLabel
// // // // // // // // // //         control={
// // // // // // // // // //           <Switch
// // // // // // // // // //             checked={includeWeekends}
// // // // // // // // // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // // // // // // // // //             color="primary"
// // // // // // // // // //           />
// // // // // // // // // //         }
// // // // // // // // // //         label="Include Weekends"
// // // // // // // // // //       />
// // // // // // // // // //       <br />

// // // // // // // // // //       <FormControlLabel
// // // // // // // // // //         control={
// // // // // // // // // //           <Switch
// // // // // // // // // //             checked={onlyIfInToList}
// // // // // // // // // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // // // // // // // // //             color="primary"
// // // // // // // // // //           />
// // // // // // // // // //         }
// // // // // // // // // //         label="Only If I'm in To List"
// // // // // // // // // //       />
// // // // // // // // // //       <br />

// // // // // // // // // //       <Box sx={{ width: 300, mt: 4 }}>
// // // // // // // // // //         <Typography gutterBottom>Alert me between +/- {alertRange} hrs</Typography>
// // // // // // // // // //         <Slider
// // // // // // // // // //           value={alertRange}
// // // // // // // // // //           onChange={(e, val) => setAlertRange(val)}
// // // // // // // // // //           aria-labelledby="alert-range-slider"
// // // // // // // // // //           valueLabelDisplay="auto"
// // // // // // // // // //           step={1}
// // // // // // // // // //           marks
// // // // // // // // // //           min={1}
// // // // // // // // // //           max={8}
// // // // // // // // // //         />
// // // // // // // // // //       </Box>

// // // // // // // // // //       <Button
// // // // // // // // // //         variant="contained"
// // // // // // // // // //         color="primary"
// // // // // // // // // //         sx={{ mt: 4 }}
// // // // // // // // // //         onClick={handleSave}
// // // // // // // // // //         disabled={saving}
// // // // // // // // // //       >
// // // // // // // // // //         {saving ? "Saving..." : "Save Settings"}
// // // // // // // // // //       </Button>

// // // // // // // // // //       <Snackbar
// // // // // // // // // //         open={saveSuccess}
// // // // // // // // // //         autoHideDuration={3000}
// // // // // // // // // //         onClose={() => setSaveSuccess(false)}
// // // // // // // // // //       >
// // // // // // // // // //         <Alert severity="success" sx={{ width: "100%" }}>
// // // // // // // // // //           Settings saved successfully!
// // // // // // // // // //         </Alert>
// // // // // // // // // //       </Snackbar>

// // // // // // // // // //       <Snackbar
// // // // // // // // // //         open={!!saveError}
// // // // // // // // // //         autoHideDuration={4000}
// // // // // // // // // //         onClose={() => setSaveError("")}
// // // // // // // // // //       >
// // // // // // // // // //         <Alert severity="error" sx={{ width: "100%" }}>
// // // // // // // // // //           {saveError}
// // // // // // // // // //         </Alert>
// // // // // // // // // //       </Snackbar>
// // // // // // // // // //     </Box>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default Config;




// // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // import {
// // // // // // // // //   Switch,
// // // // // // // // //   FormControlLabel,
// // // // // // // // //   Slider,
// // // // // // // // //   Typography,
// // // // // // // // //   Box,
// // // // // // // // //   Button,
// // // // // // // // //   Snackbar,
// // // // // // // // //   Alert,
// // // // // // // // // } from "@mui/material";
// // // // // // // // // import axios from "axios";

// // // // // // // // // const Config = () => {
// // // // // // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // // // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // // // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // // // // // //   const [saving, setSaving] = useState(false);
// // // // // // // // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // // // // // // // //   const [saveError, setSaveError] = useState("");

// // // // // // // // //   // Load settings from backend on mount
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     axios
// // // // // // // // //       .get("http://localhost:5000/api/user-settings", { withCredentials: true })
// // // // // // // // //       .then((res) => {
// // // // // // // // //         if (res.data) {
// // // // // // // // //           setIncludeWeekends(res.data.includeWeekends || false);
// // // // // // // // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // // // // // // // //           setAlertRange(res.data.alertRange || 1);
// // // // // // // // //         }
// // // // // // // // //       })
// // // // // // // // //       .catch((err) => {
// // // // // // // // //         console.error("Failed to load settings:", err);
// // // // // // // // //         setSaveError("Failed to load settings.");
// // // // // // // // //       });
// // // // // // // // //   }, []);

// // // // // // // // //   const handleSave = async () => {
// // // // // // // // //     setSaving(true);
// // // // // // // // //     setSaveError("");
// // // // // // // // //     try {
// // // // // // // // //       await axios.post(
// // // // // // // // //         "http://localhost:5000/api/user-settings",
// // // // // // // // //         { includeWeekends, onlyIfInToList, alertRange },
// // // // // // // // //         { withCredentials: true }
// // // // // // // // //       );
// // // // // // // // //       setSaveSuccess(true);
// // // // // // // // //     } catch (error) {
// // // // // // // // //       setSaveError("Failed to save settings. Please try again.");
// // // // // // // // //       console.error(error);
// // // // // // // // //     } finally {
// // // // // // // // //       setSaving(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <Box sx={{ padding: 4 }}>
// // // // // // // // //       <Typography variant="h4" gutterBottom>
// // // // // // // // //         Configure Settings
// // // // // // // // //       </Typography>

// // // // // // // // //       <FormControlLabel
// // // // // // // // //         control={
// // // // // // // // //           <Switch
// // // // // // // // //             checked={includeWeekends}
// // // // // // // // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // // // // // // // //             color="primary"
// // // // // // // // //           />
// // // // // // // // //         }
// // // // // // // // //         label="Include Weekends"
// // // // // // // // //       />
// // // // // // // // //       <br />

// // // // // // // // //       <FormControlLabel
// // // // // // // // //         control={
// // // // // // // // //           <Switch
// // // // // // // // //             checked={onlyIfInToList}
// // // // // // // // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // // // // // // // //             color="primary"
// // // // // // // // //           />
// // // // // // // // //         }
// // // // // // // // //         label="Only If I'm in To List"
// // // // // // // // //       />
// // // // // // // // //       <br />

// // // // // // // // //       <Box sx={{ width: 300, mt: 4 }}>
// // // // // // // // //         <Typography gutterBottom>Alert me between +/- {alertRange} hrs</Typography>
// // // // // // // // //         <Slider
// // // // // // // // //           value={alertRange}
// // // // // // // // //           onChange={(e, val) => setAlertRange(val)}
// // // // // // // // //           aria-labelledby="alert-range-slider"
// // // // // // // // //           valueLabelDisplay="auto"
// // // // // // // // //           step={1}
// // // // // // // // //           marks
// // // // // // // // //           min={1}
// // // // // // // // //           max={8}
// // // // // // // // //         />
// // // // // // // // //       </Box>

// // // // // // // // //       <Button
// // // // // // // // //         variant="contained"
// // // // // // // // //         color="primary"
// // // // // // // // //         sx={{ mt: 4 }}
// // // // // // // // //         onClick={handleSave}
// // // // // // // // //         disabled={saving}
// // // // // // // // //       >
// // // // // // // // //         {saving ? "Saving..." : "Save Settings"}
// // // // // // // // //       </Button>

// // // // // // // // //       <Snackbar
// // // // // // // // //         open={saveSuccess}
// // // // // // // // //         autoHideDuration={3000}
// // // // // // // // //         onClose={() => setSaveSuccess(false)}
// // // // // // // // //       >
// // // // // // // // //         <Alert severity="success" sx={{ width: "100%" }}>
// // // // // // // // //           Settings saved successfully!
// // // // // // // // //         </Alert>
// // // // // // // // //       </Snackbar>

// // // // // // // // //       <Snackbar
// // // // // // // // //         open={!!saveError}
// // // // // // // // //         autoHideDuration={4000}
// // // // // // // // //         onClose={() => setSaveError("")}
// // // // // // // // //       >
// // // // // // // // //         <Alert severity="error" sx={{ width: "100%" }}>
// // // // // // // // //           {saveError}
// // // // // // // // //         </Alert>
// // // // // // // // //       </Snackbar>
// // // // // // // // //     </Box>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default Config;



// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   Switch,
// // // //   FormControlLabel,
// // // //   Slider,
// // // //   Typography,
// // // //   Box,
// // // //   Button,
// // // //   Snackbar,
// // // //   Alert,
// // // // } from "@mui/material";
// // // // import axios from "axios";

// // // // const Config = () => {
// // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // //   const [alertRange, setAlertRange] = useState(1);

// // // //   const [saving, setSaving] = useState(false);
// // // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // // //   const [errorMsg, setErrorMsg] = useState("");

// // // //   // Fetch user settings on mount
// // // //   useEffect(() => {
// // // //     async function fetchSettings() {
// // // //       try {
// // // //         const res = await axios.get("http://localhost:5000/api/user-settings", {
// // // //           withCredentials: true,
// // // //         });
// // // //         if (res.data) {
// // // //           setIncludeWeekends(res.data.includeWeekends || false);
// // // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // // //           setAlertRange(res.data.alertRange || 1);
// // // //         }
// // // //       } catch (err) {
// // // //         console.error("Failed to fetch user settings", err);
// // // //       }
// // // //     }
// // // //     fetchSettings();
// // // //   }, []);

// // // //   // Handle saving settings
// // // //   const handleSave = async () => {
// // // //     setSaving(true);
// // // //     setErrorMsg("");
// // // //     try {
// // // //       await axios.post(
// // // //         "http://localhost:5000/api/user-settings",
// // // //         { includeWeekends, onlyIfInToList, alertRange },
// // // //         { withCredentials: true }
// // // //       );
// // // //       setSaveSuccess(true);
// // // //     } catch (err) {
// // // //       setErrorMsg("Failed to save settings");
// // // //     } finally {
// // // //       setSaving(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <Box
// // // //       sx={{
// // // //         maxWidth: 400,
// // // //         margin: "auto",
// // // //         mt: 5,
// // // //         p: 3,
// // // //         borderRadius: 2,
// // // //         boxShadow: 3,
// // // //         bgcolor: "#121212",
// // // //         color: "#fff",
// // // //       }}
// // // //     >
// // // //       <Typography variant="h5" gutterBottom>
// // // //         Configuration Settings
// // // //       </Typography>

// // // //       <FormControlLabel
// // // //         control={
// // // //           <Switch
// // // //             checked={includeWeekends}
// // // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // // //             color="primary"
// // // //           />
// // // //         }
// // // //         label="Include Weekends"
// // // //       />

// // // //       <FormControlLabel
// // // //         control={
// // // //           <Switch
// // // //             checked={onlyIfInToList}
// // // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // // //             color="primary"
// // // //           />
// // // //         }
// // // //         label="Only if 'To' list includes me"
// // // //       />

// // // //       <Box sx={{ mt: 3 }}>
// // // //         <Typography gutterBottom>Alert Range (days): {alertRange}</Typography>
// // // //         <Slider
// // // //           value={alertRange}
// // // //           onChange={(e, val) => setAlertRange(val)}
// // // //           min={1}
// // // //           max={7}
// // // //           step={1}
// // // //           valueLabelDisplay="auto"
// // // //           sx={{ color: "#7b1fa2" }}
// // // //         />
// // // //       </Box>

// // // //       <Button
// // // //         variant="contained"
// // // //         color="secondary"
// // // //         fullWidth
// // // //         sx={{ mt: 3 }}
// // // //         onClick={handleSave}
// // // //         disabled={saving}
// // // //       >
// // // //         {saving ? "Saving..." : "Save Settings"}
// // // //       </Button>

// // // //       <Snackbar
// // // //         open={saveSuccess}
// // // //         autoHideDuration={3000}
// // // //         onClose={() => setSaveSuccess(false)}
// // // //       >
// // // //         <Alert severity="success" sx={{ width: "100%" }}>
// // // //           Settings saved successfully!
// // // //         </Alert>
// // // //       </Snackbar>

// // // //       <Snackbar
// // // //         open={!!errorMsg}
// // // //         autoHideDuration={3000}
// // // //         onClose={() => setErrorMsg("")}
// // // //       >
// // // //         <Alert severity="error" sx={{ width: "100%" }}>
// // // //           {errorMsg}
// // // //         </Alert>
// // // //       </Snackbar>
// // // //     </Box>
// // // //   );
// // // // };

// // // // export default Config;



// // // // // import React, { useState, useEffect } from "react";
// // // // // import {
// // // // //   Switch,
// // // // //   FormControlLabel,
// // // // //   Slider,
// // // // //   Typography,
// // // // //   Box,
// // // // //   Button,
// // // // //   Snackbar,
// // // // //   Alert,
// // // // // } from "@mui/material";
// // // // // import axios from "axios";

// // // // // const Config = () => {
// // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // //   const [saving, setSaving] = useState(false);
// // // // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // // // //   const [errorMsg, setErrorMsg] = useState("");

// // // // //   // Fetch user settings on mount
// // // // //   useEffect(() => {
// // // // //     async function fetchSettings() {
// // // // //       try {
// // // // //         // Get token from localStorage (adjust if your token is stored elsewhere)
// // // // //         const token = localStorage.getItem("authToken");
// // // // //         if (!token) {
// // // // //           setErrorMsg("No auth token found. Please login.");
// // // // //           return;
// // // // //         }

// // // // //         const res = await axios.get("http://localhost:5000/api/user-settings", {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`,
// // // // //           },
// // // // //         });
// // // // //         if (res.data) {
// // // // //           setIncludeWeekends(res.data.includeWeekends || false);
// // // // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // // // //           setAlertRange(res.data.alertRange || 1);
// // // // //         }
// // // // //       } catch (err) {
// // // // //         console.error("Failed to fetch user settings", err);
// // // // //         setErrorMsg("Failed to load user settings.");
// // // // //       }
// // // // //     }
// // // // //     fetchSettings();
// // // // //   }, []);

// // // // //   // Handle saving settings
// // // // //   const handleSave = async () => {
// // // // //     setSaving(true);
// // // // //     setErrorMsg("");
// // // // //     try {
// // // // //       const token = localStorage.getItem("authToken");
// // // // //       if (!token) {
// // // // //         setErrorMsg("No auth token found. Please login.");
// // // // //         setSaving(false);
// // // // //         return;
// // // // //       }

// // // // //       await axios.post(
// // // // //         "http://localhost:5000/api/user-settings",
// // // // //         { includeWeekends, onlyIfInToList, alertRange },
// // // // //         {
// // // // //           headers: {
// // // // //             Authorization: `Bearer ${token}`,
// // // // //           },
// // // // //         }
// // // // //       );
// // // // //       setSaveSuccess(true);
// // // // //     } catch (err) {
// // // // //       console.error("Save error:", err);
// // // // //       setErrorMsg("Failed to save settings");
// // // // //     } finally {
// // // // //       setSaving(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <Box
// // // // //       sx={{
// // // // //         maxWidth: 400,
// // // // //         margin: "auto",
// // // // //         mt: 5,
// // // // //         p: 3,
// // // // //         borderRadius: 2,
// // // // //         boxShadow: 3,
// // // // //         bgcolor: "#121212",
// // // // //         color: "#fff",
// // // // //       }}
// // // // //     >
// // // // //       <Typography variant="h5" gutterBottom>
// // // // //         Configuration Settings
// // // // //       </Typography>

// // // // //       <FormControlLabel
// // // // //         control={
// // // // //           <Switch
// // // // //             checked={includeWeekends}
// // // // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // // // //             color="primary"
// // // // //           />
// // // // //         }
// // // // //         label="Include Weekends"
// // // // //       />

// // // // //       <FormControlLabel
// // // // //         control={
// // // // //           <Switch
// // // // //             checked={onlyIfInToList}
// // // // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // // // //             color="primary"
// // // // //           />
// // // // //         }
// // // // //         label="Only if 'To' list includes me"
// // // // //       />

// // // // //       <Box sx={{ mt: 3 }}>
// // // // //         <Typography gutterBottom>Alert Range (days): {alertRange}</Typography>
// // // // //         <Slider
// // // // //           value={alertRange}
// // // // //           onChange={(e, val) => setAlertRange(val)}
// // // // //           min={1}
// // // // //           max={7}
// // // // //           step={1}
// // // // //           valueLabelDisplay="auto"
// // // // //           sx={{ color: "#7b1fa2" }}
// // // // //         />
// // // // //       </Box>

// // // // //       <Button
// // // // //         variant="contained"
// // // // //         color="secondary"
// // // // //         fullWidth
// // // // //         sx={{ mt: 3 }}
// // // // //         onClick={handleSave}
// // // // //         disabled={saving}
// // // // //       >
// // // // //         {saving ? "Saving..." : "Save Settings"}
// // // // //       </Button>

// // // // //       <Snackbar
// // // // //         open={saveSuccess}
// // // // //         autoHideDuration={3000}
// // // // //         onClose={() => setSaveSuccess(false)}
// // // // //       >
// // // // //         <Alert severity="success" sx={{ width: "100%" }}>
// // // // //           Settings saved successfully!
// // // // //         </Alert>
// // // // //       </Snackbar>

// // // // //       <Snackbar
// // // // //         open={!!errorMsg}
// // // // //         autoHideDuration={3000}
// // // // //         onClose={() => setErrorMsg("")}
// // // // //       >
// // // // //         <Alert severity="error" sx={{ width: "100%" }}>
// // // // //           {errorMsg}
// // // // //         </Alert>
// // // // //       </Snackbar>
// // // // //     </Box>
// // // // //   );
// // // // // };

// // // // // export default Config;



// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import {
// // // // // //   Switch,
// // // // // //   FormControlLabel,
// // // // // //   Slider,
// // // // // //   Typography,
// // // // // //   Box,
// // // // // //   Button,
// // // // // //   Snackbar,
// // // // // //   Alert,
// // // // // // } from "@mui/material";
// // // // // // import axios from "axios";

// // // // // // const Config = () => {
// // // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // // //   const [saving, setSaving] = useState(false);
// // // // // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // // // // //   const [errorMsg, setErrorMsg] = useState("");

// // // // // //   const token = localStorage.getItem("authToken");

// // // // // //   // Fetch user settings on mount
// // // // // //   useEffect(() => {
// // // // // //     async function fetchSettings() {
// // // // // //       if (!token) return setErrorMsg("No auth token found. Please login.");

// // // // // //       try {
// // // // // //         const res = await axios.get("http://localhost:5000/api/user-settings", {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //           },
// // // // // //           withCredentials: true,
// // // // // //         });

// // // // // //         if (res.data) {
// // // // // //           setIncludeWeekends(res.data.includeWeekends || false);
// // // // // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // // // // //           setAlertRange(res.data.alertRange || 1);
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         setErrorMsg("Failed to fetch user settings. Please login again.");
// // // // // //       }
// // // // // //     }
// // // // // //     fetchSettings();
// // // // // //   }, [token]);

// // // // // //   // Handle saving settings
// // // // // //   const handleSave = async () => {
// // // // // //     if (!token) return setErrorMsg("No auth token found. Please login.");

// // // // // //     setSaving(true);
// // // // // //     setErrorMsg("");
// // // // // //     try {
// // // // // //       await axios.post(
// // // // // //         "http://localhost:5000/api/user-settings",
// // // // // //         { includeWeekends, onlyIfInToList, alertRange },
// // // // // //         {
// // // // // //           headers: {
// // // // // //             Authorization: `Bearer ${token}`,
// // // // // //           },
// // // // // //           withCredentials: true,
// // // // // //         }
// // // // // //       );
// // // // // //       setSaveSuccess(true);
// // // // // //     } catch (err) {
// // // // // //       setErrorMsg("Failed to save settings");
// // // // // //     } finally {
// // // // // //       setSaving(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <Box
// // // // // //       sx={{
// // // // // //         maxWidth: 400,
// // // // // //         margin: "auto",
// // // // // //         mt: 5,
// // // // // //         p: 3,
// // // // // //         borderRadius: 2,
// // // // // //         boxShadow: 3,
// // // // // //         bgcolor: "#121212",
// // // // // //         color: "#fff",
// // // // // //       }}
// // // // // //     >
// // // // // //       <Typography variant="h5" gutterBottom>
// // // // // //         Configuration Settings
// // // // // //       </Typography>

// // // // // //       <FormControlLabel
// // // // // //         control={
// // // // // //           <Switch
// // // // // //             checked={includeWeekends}
// // // // // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // // // // //             color="primary"
// // // // // //           />
// // // // // //         }
// // // // // //         label="Include Weekends"
// // // // // //       />

// // // // // //       <FormControlLabel
// // // // // //         control={
// // // // // //           <Switch
// // // // // //             checked={onlyIfInToList}
// // // // // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // // // // //             color="primary"
// // // // // //           />
// // // // // //         }
// // // // // //         label="Only if 'To' list includes me"
// // // // // //       />

// // // // // //       <Box sx={{ mt: 3 }}>
// // // // // //         <Typography gutterBottom>Alert Range (days): {alertRange}</Typography>
// // // // // //         <Slider
// // // // // //           value={alertRange}
// // // // // //           onChange={(e, val) => setAlertRange(val)}
// // // // // //           min={1}
// // // // // //           max={7}
// // // // // //           step={1}
// // // // // //           valueLabelDisplay="auto"
// // // // // //           sx={{ color: "#7b1fa2" }}
// // // // // //         />
// // // // // //       </Box>

// // // // // //       <Button
// // // // // //         variant="contained"
// // // // // //         color="secondary"
// // // // // //         fullWidth
// // // // // //         sx={{ mt: 3 }}
// // // // // //         onClick={handleSave}
// // // // // //         disabled={saving}
// // // // // //       >
// // // // // //         {saving ? "Saving..." : "Save Settings"}
// // // // // //       </Button>

// // // // // //       <Snackbar
// // // // // //         open={saveSuccess}
// // // // // //         autoHideDuration={3000}
// // // // // //         onClose={() => setSaveSuccess(false)}
// // // // // //       >
// // // // // //         <Alert severity="success" sx={{ width: "100%" }}>
// // // // // //           Settings saved successfully!
// // // // // //         </Alert>
// // // // // //       </Snackbar>

// // // // // //       <Snackbar
// // // // // //         open={!!errorMsg}
// // // // // //         autoHideDuration={3000}
// // // // // //         onClose={() => setErrorMsg("")}
// // // // // //       >
// // // // // //         <Alert severity="error" sx={{ width: "100%" }}>
// // // // // //           {errorMsg}
// // // // // //         </Alert>
// // // // // //       </Snackbar>
// // // // // //     </Box>
// // // // // //   );
// // // // // // };

// // // // // // export default Config;




// // // // // // // import React, { useState } from 'react';
// // // // // // // import { Switch, FormControlLabel, Slider, Typography, Box } from '@mui/material';

// // // // // // // const Config = () => {
// // // // // // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // // // // // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // // // // // //   const [alertRange, setAlertRange] = useState(1);

// // // // // // //   const handleIncludeWeekendsChange = (event) => {
// // // // // // //     setIncludeWeekends(event.target.checked);
// // // // // // //   };

// // // // // // //   const handleOnlyIfInToListChange = (event) => {
// // // // // // //     setOnlyIfInToList(event.target.checked);
// // // // // // //   };

// // // // // // //   const handleAlertRangeChange = (event, newValue) => {
// // // // // // //     setAlertRange(newValue);
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <Box sx={{ padding: 4 }}>
// // // // // // //       <Typography variant="h4" gutterBottom>
// // // // // // //         Configure Settings
// // // // // // //       </Typography>
// // // // // // //       <FormControlLabel
// // // // // // //         control={
// // // // // // //           <Switch
// // // // // // //             checked={includeWeekends}
// // // // // // //             onChange={handleIncludeWeekendsChange}
// // // // // // //             color="primary"
// // // // // // //           />
// // // // // // //         }
// // // // // // //         label="Include Weekends"
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <FormControlLabel
// // // // // // //         control={
// // // // // // //           <Switch
// // // // // // //             checked={onlyIfInToList}
// // // // // // //             onChange={handleOnlyIfInToListChange}
// // // // // // //             color="primary"
// // // // // // //           />
// // // // // // //         }
// // // // // // //         label="Only If I'm in To List"
// // // // // // //       />
// // // // // // //       <br />
// // // // // // //       <Box sx={{ width: 300, mt: 4 }}>
// // // // // // //         <Typography gutterBottom>
// // // // // // //           Alert me between +/- {alertRange} hrs
// // // // // // //         </Typography>
// // // // // // //         <Slider
// // // // // // //           value={alertRange}
// // // // // // //           onChange={handleAlertRangeChange}
// // // // // // //           aria-labelledby="alert-range-slider"
// // // // // // //           valueLabelDisplay="auto"
// // // // // // //           step={1}
// // // // // // //           marks
// // // // // // //           min={1}
// // // // // // //           max={8}
// // // // // // //         />
// // // // // // //       </Box>
// // // // // // //     </Box>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default Config;


// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   Switch,
// // //   FormControlLabel,
// // //   Slider,
// // //   Typography,
// // //   Box,
// // //   Button,
// // //   Snackbar,
// // //   Alert,
// // // } from "@mui/material";
// // // import axios from "axios";
// // // import { useNavigate } from "react-router-dom"; // ⬅️ Import navigate hook

// // // const Config = () => {
// // //   const [includeWeekends, setIncludeWeekends] = useState(false);
// // //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// // //   const [alertRange, setAlertRange] = useState(1);

// // //   const [saving, setSaving] = useState(false);
// // //   const [saveSuccess, setSaveSuccess] = useState(false);
// // //   const [errorMsg, setErrorMsg] = useState("");

// // //   const navigate = useNavigate(); // ⬅️ Init navigate

// // //   useEffect(() => {
// // //     async function fetchSettings() {
// // //       try {
// // //         const res = await axios.get("http://localhost:5000/api/user-settings", {
// // //           withCredentials: true,
// // //         });
// // //         if (res.data) {
// // //           setIncludeWeekends(res.data.includeWeekends || false);
// // //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// // //           setAlertRange(res.data.alertRange || 1);
// // //         }
// // //       } catch (err) {
// // //         console.error("Failed to fetch user settings", err);
// // //       }
// // //     }
// // //     fetchSettings();
// // //   }, []);

// // //   const handleSave = async () => {
// // //     setSaving(true);
// // //     setErrorMsg("");
// // //     try {
// // //       await axios.post(
// // //         "http://localhost:5000/api/user-settings",
// // //         { includeWeekends, onlyIfInToList, alertRange },
// // //         { withCredentials: true }
// // //       );
// // //       setSaveSuccess(true);
// // //       setTimeout(() => {
// // //         navigate("/home"); // ⬅️ Redirect after success
// // //       }, 1000); // short delay to show the success snackbar
// // //     } catch (err) {
// // //       setErrorMsg("Failed to save settings");
// // //     } finally {
// // //       setSaving(false);
// // //     }
// // //   };

// // //   return (
// // //     <Box
// // //       sx={{
// // //         maxWidth: 400,
// // //         margin: "auto",
// // //         mt: 5,
// // //         p: 3,
// // //         borderRadius: 2,
// // //         boxShadow: 3,
// // //         bgcolor: "#121212",
// // //         color: "#fff",
// // //       }}
// // //     >
// // //       <Typography variant="h5" gutterBottom>
// // //         Configuration Settings
// // //       </Typography>

// // //       <FormControlLabel
// // //         control={
// // //           <Switch
// // //             checked={includeWeekends}
// // //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// // //             color="primary"
// // //           />
// // //         }
// // //         label="Include Weekends"
// // //       />

// // //       <FormControlLabel
// // //         control={
// // //           <Switch
// // //             checked={onlyIfInToList}
// // //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// // //             color="primary"
// // //           />
// // //         }
// // //         label="Only if 'To' list includes me"
// // //       />

// // //       <Box sx={{ mt: 3 }}>
// // //         <Typography gutterBottom>Alert Range (days): {alertRange}</Typography>
// // //         <Slider
// // //           value={alertRange}
// // //           onChange={(e, val) => setAlertRange(val)}
// // //           min={1}
// // //           max={7}
// // //           step={1}
// // //           valueLabelDisplay="auto"
// // //           sx={{ color: "#7b1fa2" }}
// // //         />
// // //       </Box>

// // //       <Button
// // //         variant="contained"
// // //         color="secondary"
// // //         fullWidth
// // //         sx={{ mt: 3 }}
// // //         onClick={handleSave}
// // //         disabled={saving}
// // //       >
// // //         {saving ? "Saving..." : "Save Settings"}
// // //       </Button>

// // //       <Snackbar
// // //         open={saveSuccess}
// // //         autoHideDuration={2000}
// // //         onClose={() => setSaveSuccess(false)}
// // //       >
// // //         <Alert severity="success" sx={{ width: "100%" }}>
// // //           Settings saved successfully!
// // //         </Alert>
// // //       </Snackbar>

// // //       <Snackbar
// // //         open={!!errorMsg}
// // //         autoHideDuration={3000}
// // //         onClose={() => setErrorMsg("")}
// // //       >
// // //         <Alert severity="error" sx={{ width: "100%" }}>
// // //           {errorMsg}
// // //         </Alert>
// // //       </Snackbar>
// // //     </Box>
// // //   );
// // // };

// // // export default Config;



// // import React, { useState, useEffect } from "react";
// // import {
// //   Switch,
// //   FormControlLabel,
// //   Slider,
// //   Typography,
// //   Box,
// //   Button,
// //   Snackbar,
// //   Alert,
// // } from "@mui/material";
// // import axios from "axios";
// // import { useNavigate } from "react-router-dom"; // ⬅️ Import navigate hook

// // const Config = () => {
// //   const [includeWeekends, setIncludeWeekends] = useState(false);
// //   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
// //   const [alertRange, setAlertRange] = useState(1);

// //   const [saving, setSaving] = useState(false);
// //   const [saveSuccess, setSaveSuccess] = useState(false);
// //   const [errorMsg, setErrorMsg] = useState("");

// //   const navigate = useNavigate(); // ⬅️ Init navigate

// //   useEffect(() => {
// //     async function fetchSettings() {
// //       try {
// //         const res = await axios.get("http://localhost:5000/api/user-settings", {
// //           withCredentials: true,
// //         });
// //         if (res.data) {
// //           setIncludeWeekends(res.data.includeWeekends || false);
// //           setOnlyIfInToList(res.data.onlyIfInToList || false);
// //           setAlertRange(res.data.alertRange || 1);
// //         }
// //       } catch (err) {
// //         console.error("Failed to fetch user settings", err);
// //       }
// //     }
// //     fetchSettings();
// //   }, []);

// //   const handleSave = async () => {
// //     setSaving(true);
// //     setErrorMsg("");
// //     try {
// //       await axios.post(
// //         "http://localhost:5000/api/user-settings",
// //         { includeWeekends, onlyIfInToList, alertRange },
// //         { withCredentials: true }
// //       );
// //       setSaveSuccess(true);
// //       setTimeout(() => {
// //         navigate("/home"); // ⬅️ Redirect after success
// //       }, 1000); // short delay to show the success snackbar
// //     } catch (err) {
// //       setErrorMsg("Failed to save settings");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   return (
// //     <Box
// //       sx={{
// //         maxWidth: 400,
// //         margin: "auto",
// //         mt: 5,
// //         p: 3,
// //         borderRadius: 2,
// //         boxShadow: 3,
// //         bgcolor: "#121212",
// //         color: "#fff",
// //       }}
// //     >
// //       <Typography variant="h5" gutterBottom>
// //         Configuration Settings
// //       </Typography>

// //       <FormControlLabel
// //         control={
// //           <Switch
// //             checked={includeWeekends}
// //             onChange={(e) => setIncludeWeekends(e.target.checked)}
// //             color="primary"
// //           />
// //         }
// //         label="Include Weekends"
// //       />

// //       <FormControlLabel
// //         control={
// //           <Switch
// //             checked={onlyIfInToList}
// //             onChange={(e) => setOnlyIfInToList(e.target.checked)}
// //             color="primary"
// //           />
// //         }
// //         label="Only if 'To' list includes me"
// //       />

// //       <Box sx={{ mt: 3 }}>
// //         <Typography gutterBottom>Alert Range (hours): {alertRange}</Typography>
// //         <Slider
// //           value={alertRange}
// //           onChange={(e, val) => setAlertRange(val)}
// //           min={1}
// //           max={7}
// //           step={1}
// //           valueLabelDisplay="auto"
// //           sx={{ color: "#7b1fa2" }}
// //         />
// //       </Box>

// //       <Button
// //         variant="contained"
// //         color="secondary"
// //         fullWidth
// //         sx={{ mt: 3 }}
// //         onClick={handleSave}
// //         disabled={saving}
// //       >
// //         {saving ? "Saving..." : "Save Settings"}
// //       </Button>

// //       <Snackbar
// //         open={saveSuccess}
// //         autoHideDuration={2000}
// //         onClose={() => setSaveSuccess(false)}
// //       >
// //         <Alert severity="success" sx={{ width: "100%" }}>
// //           Settings saved successfully!
// //         </Alert>
// //       </Snackbar>

// //       <Snackbar
// //         open={!!errorMsg}
// //         autoHideDuration={3000}
// //         onClose={() => setErrorMsg("")}
// //       >
// //         <Alert severity="error" sx={{ width: "100%" }}>
// //           {errorMsg}
// //         </Alert>
// //       </Snackbar>
// //     </Box>
// //   );
// // };

// // export default Config;




// import React, { useState, useEffect } from "react";
// import {
//   Switch,
//   FormControlLabel,
//   Slider,
//   Typography,
//   Box,
//   Button,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Config = () => {
//   const [includeWeekends, setIncludeWeekends] = useState(false);
//   const [onlyIfInToList, setOnlyIfInToList] = useState(false);
//   const [alertRange, setAlertRange] = useState(7); // ⬅️ default now starts at 7 hours

//   const [saving, setSaving] = useState(false);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchSettings() {
//       try {
//         const res = await axios.get("http://localhost:5000/api/user-settings", {
//           withCredentials: true,
//         });
//         if (res.data) {
//           // Use max between 7 and returned value to enforce minimum 7
//           setIncludeWeekends(res.data.includeWeekends || false);
//           setOnlyIfInToList(res.data.onlyIfInToList || false);
//           setAlertRange(Math.max(res.data.alertRange || 7, 7));
//         }
//       } catch (err) {
//         console.error("Failed to fetch user settings", err);
//       }
//     }
//     fetchSettings();
//   }, []);

//   const handleSave = async () => {
//     setSaving(true);
//     setErrorMsg("");
//     try {
//       await axios.post(
//         "http://localhost:5000/api/user-settings",
//         { includeWeekends, onlyIfInToList, alertRange },
//         { withCredentials: true }
//       );
//       setSaveSuccess(true);
//       setTimeout(() => {
//         navigate("/home");
//       }, 1000);
//     } catch (err) {
//       setErrorMsg("Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 400,
//         margin: "auto",
//         mt: 5,
//         p: 3,
//         borderRadius: 2,
//         boxShadow: 3,
//         bgcolor: "#121212",
//         color: "#fff",
//       }}
//     >
//       <Typography variant="h5" gutterBottom>
//         Configuration Settings
//       </Typography>

//       <FormControlLabel
//         control={
//           <Switch
//             checked={includeWeekends}
//             onChange={(e) => setIncludeWeekends(e.target.checked)}
//             color="primary"
//           />
//         }
//         label="Include Weekends"
//       />

//       <FormControlLabel
//         control={
//           <Switch
//             checked={onlyIfInToList}
//             onChange={(e) => setOnlyIfInToList(e.target.checked)}
//             color="primary"
//           />
//         }
//         label="Only if 'To' list includes me"
//       />

//       <Box sx={{ mt: 3 }}>
//         <Typography gutterBottom>Alert Range (hours): {alertRange}</Typography>
//         <Slider
//           value={alertRange}
//           onChange={(e, val) => setAlertRange(val)}
//           min={7} // ⬅️ Minimum of 7 hours
//           max={24}
//           step={1}
//           valueLabelDisplay="auto"
//           sx={{ color: "#7b1fa2" }}
//         />
//       </Box>

//       <Button
//         variant="contained"
//         color="secondary"
//         fullWidth
//         sx={{ mt: 3 }}
//         onClick={handleSave}
//         disabled={saving}
//       >
//         {saving ? "Saving..." : "Save Settings"}
//       </Button>

//       <Snackbar
//         open={saveSuccess}
//         autoHideDuration={2000}
//         onClose={() => setSaveSuccess(false)}
//       >
//         <Alert severity="success" sx={{ width: "100%" }}>
//           Settings saved successfully!
//         </Alert>
//       </Snackbar>

//       <Snackbar
//         open={!!errorMsg}
//         autoHideDuration={3000}
//         onClose={() => setErrorMsg("")}
//       >
//         <Alert severity="error" sx={{ width: "100%" }}>
//           {errorMsg}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Config;





import React, { useState, useEffect } from "react";
import {
  Switch,
  FormControlLabel,
  Slider,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Config = () => {
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [onlyIfInToList, setOnlyIfInToList] = useState(false);
  const [alertRange, setAlertRange] = useState(1); // ⬅️ Default is 1 hour

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get("http://localhost:5000/api/user-settings", {
          withCredentials: true,
        });
        if (res.data) {
          // Ensure it stays between 1 and 7
          const range = Math.min(Math.max(res.data.alertRange || 1, 1), 7);
          setIncludeWeekends(res.data.includeWeekends || false);
          setOnlyIfInToList(res.data.onlyIfInToList || false);
          setAlertRange(range);
        }
      } catch (err) {
        console.error("Failed to fetch user settings", err);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");
    try {
      await axios.post(
        "http://localhost:5000/api/user-settings",
        { includeWeekends, onlyIfInToList, alertRange },
        { withCredentials: true }
      );
      setSaveSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setErrorMsg("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 5,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Configuration Settings
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={includeWeekends}
            onChange={(e) => setIncludeWeekends(e.target.checked)}
            color="primary"
          />
        }
        label="Include Weekends"
      />

      <FormControlLabel
        control={
          <Switch
            checked={onlyIfInToList}
            onChange={(e) => setOnlyIfInToList(e.target.checked)}
            color="primary"
          />
        }
        label="Only if 'To' list includes me"
      />

      <Box sx={{ mt: 3 }}>
        <Typography gutterBottom>
          Alert Range (hours): {alertRange}
        </Typography>
        <Slider
          value={alertRange}
          onChange={(e, val) => setAlertRange(val)}
          min={1}
          max={7}
          step={1}
          valueLabelDisplay="auto"
          sx={{ color: "#7b1fa2" }}
        />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Settings"}
      </Button>

      <Snackbar
        open={saveSuccess}
        autoHideDuration={2000}
        onClose={() => setSaveSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Settings saved successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorMsg}
        autoHideDuration={3000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Config;
