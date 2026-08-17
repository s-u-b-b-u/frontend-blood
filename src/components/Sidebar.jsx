import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const role = user.role;

  return (
    <div style={{ width: '250px', background: '#1a1a1a', padding: '20px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ marginBottom: '30px' }}>BloodLink</h2>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? '#ef4444' : 'white' }}>Overview</Link>

        {role === 'ADMIN' && (
          <>
            <Link to="/dashboard/users" style={{ color: location.pathname.includes('/users') ? '#ef4444' : 'white' }}>Users</Link>
            <Link to="/dashboard/organizations" style={{ color: location.pathname.includes('/organizations') ? '#ef4444' : 'white' }}>Organizations</Link>
            <Link to="/dashboard/audit-logs" style={{ color: location.pathname.includes('/audit-logs') ? '#ef4444' : 'white' }}>Audit Logs</Link>
          </>
        )}

        {role === 'DONOR' && (
          <>
            <Link to="/dashboard/profile" style={{ color: location.pathname.includes('/profile') ? '#ef4444' : 'white' }}>My Profile</Link>
            <Link to="/dashboard/donations" style={{ color: location.pathname.includes('/donations') ? '#ef4444' : 'white' }}>My Donations</Link>
            <Link to="/dashboard/notifications" style={{ color: location.pathname.includes('/notifications') ? '#ef4444' : 'white' }}>Notifications</Link>
          </>
        )}

        {role === 'HOSPITAL' && (
          <>
            <Link to="/dashboard/inventory" style={{ color: location.pathname.includes('/inventory') ? '#ef4444' : 'white' }}>Inventory</Link>
            <Link to="/dashboard/requests" style={{ color: location.pathname.includes('/requests') ? '#ef4444' : 'white' }}>Blood Requests</Link>
            <Link to="/dashboard/transfers" style={{ color: location.pathname.includes('/transfers') ? '#ef4444' : 'white' }}>Transfers</Link>
          </>
        )}

        {role === 'BLOOD_BANK' && (
          <>
            <Link to="/dashboard/inventory" style={{ color: location.pathname.includes('/inventory') ? '#ef4444' : 'white' }}>Inventory</Link>
            <Link to="/dashboard/donations" style={{ color: location.pathname.includes('/donations') ? '#ef4444' : 'white' }}>Manage Donations</Link>
            <Link to="/dashboard/transfers" style={{ color: location.pathname.includes('/transfers') ? '#ef4444' : 'white' }}>Transfers</Link>
          </>
        )}
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '20px' }}>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>Logged in as: {user.email}</p>
        <p style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '10px' }}>Role: {role}</p>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', cursor: 'pointer' }}>Logout</button>
      </div>
    </div>
  );
}
