import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Organizations from './pages/Organizations';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';
import DonorProfile from './pages/DonorProfile';
import DonorNotifications from './pages/DonorNotifications';
import HospitalRequests from './pages/HospitalRequests';
import Inventory from './pages/Inventory';
import Donations from './pages/Donations';
import Transfers from './pages/Transfers';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, token, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/" replace />;
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized Access</div>;
  }

  return children;
}

import Landing from './pages/Landing';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        
        {/* Admin Routes */}
        <Route path="users" element={<ProtectedRoute allowedRoles={['ADMIN']}><Users /></ProtectedRoute>} />
        <Route path="organizations" element={<ProtectedRoute allowedRoles={['ADMIN']}><Organizations /></ProtectedRoute>} />
        <Route path="audit-logs" element={<ProtectedRoute allowedRoles={['ADMIN']}><AuditLogs /></ProtectedRoute>} />
        
        {/* Profile Route (Accessible by all roles) */}
        <Route path="profile" element={<ProtectedRoute><DonorProfile /></ProtectedRoute>} />
        <Route path="donations" element={<ProtectedRoute allowedRoles={['DONOR', 'BLOOD_BANK']}><Donations /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute allowedRoles={['DONOR']}><DonorNotifications /></ProtectedRoute>} />

        {/* Hospital & Blood Bank Routes */}
        <Route path="inventory" element={<ProtectedRoute allowedRoles={['HOSPITAL', 'BLOOD_BANK']}><Inventory /></ProtectedRoute>} />
        <Route path="requests" element={<ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalRequests /></ProtectedRoute>} />
        <Route path="transfers" element={<ProtectedRoute allowedRoles={['HOSPITAL', 'BLOOD_BANK']}><Transfers /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
