


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
