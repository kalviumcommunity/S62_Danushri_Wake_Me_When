import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home             from "./Home";
import ImportantPage    from "./pages/ImportantPage";
import AfterHoursPage   from "./pages/AfterHoursPage";
import Config           from "./Config";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import ConnectCalendar  from "./pages/ConnectCalendar";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                  element={<Navigate to="/home" />} />
        <Route path="/home"              element={<Home />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/signup"            element={<Signup />} />
        <Route path="/connect-calendar"  element={<ConnectCalendar />} />
        <Route path="/important"         element={<ImportantPage />} />
        <Route path="/afterhours"        element={<AfterHoursPage />} />
        <Route path="/config"            element={<Config />} />
      </Routes>
    </Router>
  );
}
