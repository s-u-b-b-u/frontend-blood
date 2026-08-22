import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Top Horizontal Glassmorphic Navbar */}
      <Navbar />

      {/* Main Page Content Area - 100% FULL WIDTH ACROSS ALL PORTALS */}
      <main style={{ width: '100%', padding: '24px 40px 48px', boxSizing: 'border-box' }}>
        <Outlet />
      </main>
    </div>
  );
}
