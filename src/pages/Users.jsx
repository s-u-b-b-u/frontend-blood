import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';

export default function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editRole, setEditRole] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers(token);
      const userList = data.items || data || [];
      // Fallback sample data if API returns empty list
      if (userList.length === 0) {
        setUsers([
          { id: 1, email: 'dr.thorne@cityhospital.org', role: 'HOSPITAL', is_active: true, created_at: '2026-01-15' },
          { id: 2, email: 'rahul.verma@donorlink.org', role: 'DONOR', is_active: true, created_at: '2026-02-10' },
          { id: 3, email: 'bloodbank.central@redcross.org', role: 'BLOOD_BANK', is_active: true, created_at: '2025-11-20' },
          { id: 4, email: 'admin@bloodlink.org', role: 'ADMIN', is_active: true, created_at: '2025-09-01' },
          { id: 5, email: 'suspended.user@test.org', role: 'DONOR', is_active: false, created_at: '2026-03-04' }
        ]);
      } else {
        setUsers(userList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (userItem) => {
    setSelectedUser(userItem);
    setEditRole(userItem.role);
    setEditActive(userItem.is_active);
    setIsDrawerOpen(true);
  };

  const handleSaveUser = () => {
    if (!selectedUser) return;
    setIsSaving(true);
    setTimeout(() => {
      setUsers(prev => prev.map(u => {
        if (u.id === selectedUser.id || u.email === selectedUser.email) {
          return { ...u, role: editRole, is_active: editActive };
        }
        return u;
      }));
      setIsSaving(false);
      setIsDrawerOpen(false);
    }, 400);
  };

  const columns = [
    { key: 'email', label: 'User Email' },
    { 
      key: 'role', 
      label: 'Role',
      render: (role) => (
        <span style={{ fontWeight: 'var(--weight-semibold)', color: role === 'ADMIN' ? '#a71e24' : 'var(--text-main)' }}>
          {role}
        </span>
      )
    },
    { 
      key: 'is_active', 
      label: 'Account Status',
      render: (is_active) => (
        <span className={`table-badge ${is_active ? 'badge-success' : 'badge-danger'}`}>
          {is_active ? 'Active' : 'Suspended'}
        </span>
      )
    },
    { 
      key: 'created_at', 
      label: 'Registered Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, userItem) => (
        <button 
          type="button" 
          className="table-action-outline"
          onClick={() => handleOpenEdit(userItem)}
        >
          Edit Account
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          User Directory
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Registered accounts across all portals (Donors, Hospitals, Blood Banks, and Admins).
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        gridTemplate="2fr 1.2fr 1.2fr 1.2fr 1fr"
        searchPlaceholder="Search users by email or role..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No user accounts found."
      />

      {/* Edit User Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Manage User Account"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* User Meta Summary Box */}
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Account Overview
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', marginTop: '4px' }}>
                {selectedUser.email}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Registered on: {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Assigned System Role
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="DONOR">DONOR</option>
                <option value="HOSPITAL">HOSPITAL</option>
                <option value="BLOOD_BANK">BLOOD_BANK</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Account Status Toggle */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Account State
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: editActive ? '2px solid var(--success-main)' : '1px solid var(--border-subtle)',
                    backgroundColor: editActive ? '#f0fdf4' : 'var(--bg-card)',
                    color: editActive ? 'var(--success-main)' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onClick={() => setEditActive(true)}
                >
                  ✓ Active
                </button>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: !editActive ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: !editActive ? '#fff1f2' : 'var(--bg-card)',
                    color: !editActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onClick={() => setEditActive(false)}
                >
                  ✕ Suspended
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button" 
                className="btn-primary-large"
                style={{ flex: 1, marginTop: 0 }}
                onClick={handleSaveUser}
                disabled={isSaving}
              >
                {isSaving ? 'Saving Changes...' : 'Save User Settings'}
              </button>
              <button 
                type="button" 
                className="table-action-outline"
                style={{ padding: '12px 20px' }}
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        )}
      </Drawer>
    </div>
  );
}
