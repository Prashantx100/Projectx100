import React from 'react';
//import { Routes, Route } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Demo from './components/demo';
import AdminPortal from './components/admin';
import CustomerPortal from './components/customer';
import AuthPage from './components/login';

function App() {
  return (
    <AdminPortal />
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