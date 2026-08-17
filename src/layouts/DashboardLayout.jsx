import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Top Horizontal Glassmorphic Navbar */}
      <Navbar />

      {/* Main Page Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 48px' }}>
        <Outlet />
      </main>
    </div>
  );
}
