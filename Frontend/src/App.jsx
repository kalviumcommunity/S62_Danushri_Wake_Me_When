import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing          from "./Landing";
import Dashboard        from "./";
import ImportantPage    from "./pages/ImportantPage";
import AfterHoursPage   from "./pages/AfterHoursPage";
import Config           from "./Config";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import ConnectCalendar  from "./pages/ConnectCalendar";
import Profile          from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"                  element={<Landing />} />
        <Route path="/home"              element={<Dashboard />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/signup"            element={<Signup />} />
        <Route path="/connect-calendar"  element={<ConnectCalendar />} />
        <Route path="/important"         element={<ImportantPage />} />
        <Route path="/afterhours"        element={<AfterHoursPage />} />
        <Route path="/config"            element={<Config />} />
        <Route path="/profile"           element={<Profile />} />
      </Routes>
    </Router>
  );
}
