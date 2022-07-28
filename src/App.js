import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Layout/>} />
          <Route path="/*" element={<Navigate replace to="/login" />} />

        </Routes>
    </Router>
  );
}