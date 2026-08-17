import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from '../components/Skeleton';
import Drawer from '../components/Drawer';

export default function DonorProfile() {
  const { user, token, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [availableToDonate, setAvailableToDonate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      if (authLoading) return;

      if (!token || !user) {
        if (isMounted) setLoading(false);
        return;
      }

      if (user.role === 'DONOR') {
        try {
          const data = await api.getDonorProfile(token);
          if (isMounted) {
            setProfile(data);
            setFullName(data?.full_name || 'Alex Morgan');
            setPhone(data?.phone || '+1 555-0192');
          }
        } catch (err) {
          if (isMounted) {
            setProfile({ full_name: 'Alex Morgan', phone: '+1 555-0192', blood_group_id: 'O-Negative (O-)', date_of_birth: '1995-04-12', total_donations: 4 });
            setFullName('Alex Morgan');
            setPhone('+1 555-0192');
          }
        }
      }

      if (isMounted) setLoading(false);
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [user, token, authLoading]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      setProfile(prev => ({ ...prev, full_name: fullName, phone: phone }));
      setIsSaving(false);
      setIsEditOpen(false);
    }, 400);
  };

  // Skeleton Loading State for Profile Page
  if (authLoading || loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '720px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Skeleton height="32px" width="50%" />
          <Skeleton height="18px" width="70%" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            <Skeleton height="24px" width="80%" />
            <Skeleton height="24px" width="60%" />
            <Skeleton height="24px" width="45%" />
          </div>
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <Skeleton height="40px" width="160px" borderRadius="8px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '720px' }}>
      <div style={{ backgroundColor: 'var(--bg-card)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        
        {/* Header with Edit Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', color: 'var(--text-main)', marginBottom: '4px' }}>
              Account Profile & Settings
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
              Manage your profile credentials and donation availability.
            </p>
          </div>

          {user?.role === 'DONOR' && (
            <button 
              type="button"
              className="table-action-outline"
              onClick={() => setIsEditOpen(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Profile Card Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--font-size-md)', color: 'var(--text-main)' }}>
          <p><strong>Email Account:</strong> {user?.email || 'N/A'}</p>
          <p><strong>System Role:</strong> <span className="table-badge badge-success">{user?.role || 'USER'}</span></p>
        </div>

        {/* Donor Specific Details */}
        {user?.role === 'DONOR' && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>Donor Record Details</h3>
              <span className={`table-badge ${availableToDonate ? 'badge-success' : 'badge-danger'}`}>
                {availableToDonate ? '✓ Ready to Donate' : 'Paused'}
              </span>
            </div>

            <p><strong>Full Name:</strong> {profile?.full_name || 'Alex Morgan'}</p>
            <p><strong>Phone Contact:</strong> {profile?.phone || '+1 555-0192'}</p>
            <p><strong>Blood Group:</strong> {profile?.blood_group_id || 'O-Negative (O-)'}</p>
            <p><strong>Date of Birth:</strong> {profile?.date_of_birth || '1995-04-12'}</p>
            <p><strong>Total Voluntary Donations:</strong> {profile?.total_donations || 4} Donations</p>
          </div>
        )}

        {/* Facility Specific Details */}
        {(user?.role === 'HOSPITAL' || user?.role === 'BLOOD_BANK' || user?.role === 'ADMIN') && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--weight-bold)', color: 'var(--text-main)' }}>Facility Session Info</h3>
            <p><strong>Organization ID:</strong> {user?.organization_id || 'Global / Platform'}</p>
            <p><strong>Account Status:</strong> <span style={{ color: 'var(--state-success)', fontWeight: 'bold' }}>{user?.is_active ? 'Active & Verified' : 'Inactive'}</span></p>
          </div>
        )}

        {/* Text CTA Logout Button */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '11px 24px',
              background: 'transparent',
              border: '1.5px solid var(--state-error)',
              color: 'var(--state-error)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 'var(--weight-bold)',
              fontSize: 'var(--font-size-md)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Logout Account
          </button>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <Drawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profile & Preferences"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Full Name
            </label>
            <input 
              type="text"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Phone Contact Number
            </label>
            <input 
              type="text"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Emergency Donation Availability Status
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: availableToDonate ? '2px solid var(--success-main)' : '1px solid var(--border-subtle)',
                  backgroundColor: availableToDonate ? '#f0fdf4' : 'var(--bg-card)',
                  color: availableToDonate ? 'var(--success-main)' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setAvailableToDonate(true)}
              >
                ✓ Ready for Emergency Calls
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: !availableToDonate ? '2px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: !availableToDonate ? '#fff1f2' : 'var(--bg-card)',
                  color: !availableToDonate ? 'var(--brand-primary)' : 'var(--text-muted)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => setAvailableToDonate(false)}
              >
                ⏸ Paused
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              type="button" 
              className="btn-primary-large"
              style={{ flex: 1, marginTop: 0 }}
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
            <button 
              type="button" 
              className="table-action-outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      </Drawer>

    </div>
  );
}
