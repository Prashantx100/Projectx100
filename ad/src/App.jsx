import React from "react";
//import { Routes, Route } from 'react-router-dom';
import Home from "./components/home";
import Demo from "./components/demo";
import AdminPortal from "./components/admin";
import CustomerPortal from "./components/customer";
import AuthPage from "./components/login";
import { Routes, Route, Navigate } from "react-router-dom";
function App() {
  return (
    <Routes>
      {/* Default route goes to Home */}
      <Route path="/" element={<Home />} />

      {/* Login / Sign Up Page */}
      <Route path="/login" element={<AuthPage />} />

      {/* Demo Page */}
      <Route path="/demo" element={<Demo />} />

      {/* Protected Portals */}
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="/customer" element={<CustomerPortal />} />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

/*
<Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/admin" element={<AdminPortal />} />
      <Route path="/customer" element={<CustomerPortal />} />
    </Routes>
    */
