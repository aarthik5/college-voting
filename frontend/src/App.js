import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import VotingPage from './pages/VotingPage';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin'; // if it's in ./pages. Adjust path if it's in ./components

function App() {
  return (
    <Router>
      <Routes>
        {/* Student Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Student Voting Page */}
        <Route path="/vote" element={<VotingPage />} />
        
        {/* Admin Panel – Protected */}
        <Route
          path="/admin"
          element={
            localStorage.getItem('adminToken')
              ? <AdminPage />
              : <Navigate to="/admin-login" />
          }
        />

        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;