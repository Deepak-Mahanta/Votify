import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Signup from './pages/Signup';
import Login from './pages/Login';
import VoterDashboard from './pages/VoterDashboard';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';

import PrivateRoute from './routes/PrivateRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Protected voter route */}
        <Route
          path="/voterdasbord"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRole="voter">
                <VoterDashboard />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />

        {/* Protected admin route */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <RoleProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </RoleProtectedRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
