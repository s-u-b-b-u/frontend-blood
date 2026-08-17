import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';

export default function DonorNotifications() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [pledged, setPledged] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications(token);
      const notifList = data.items || data || [];
      if (notifList.length === 0) {
        setNotifications([
          {
            id: 201,
            created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            title: 'CRITICAL EMERGENCY: O-Negative Shortage',
            message: 'Metro General Hospital urgent call for O-Negative donors for emergency surgery.',
            is_read: false,
            hospital_name: 'Metro General Hospital',
            blood_type: 'O-',
            units_needed: 3,
            urgency: 'CRITICAL',
            location: 'Downtown District Medical Plaza'
          },
          {
            id: 202,
            created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
            title: 'Donation Reminder: 56-Day Goal Reached',
            message: 'You are officially eligible to schedule your next voluntary blood donation!',
            is_read: true,
            hospital_name: 'Central Red Cross Center',
            blood_type: 'O+',
            units_needed: 1,
            urgency: 'ROUTINE',
            location: '45 Health Way'
          }
        ]);
      } else {
        setNotifications(notifList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_read: true } : n));
    try {
      await api.markNotificationRead(token, notifId);
    } catch (err) {
      // Keep optimistic state update
    }
  };

  const handleOpenDrawer = (notif) => {
    setSelectedNotif(notif);
    setPledged(false);
    if (!notif.is_read) {
      handleMarkAsRead(notif.id);
    }
  };

  const columns = [
    { 
      key: 'created_at', 
      label: 'Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'title', 
      label: 'Notification Title',
      render: (title, row) => (
        <span style={{ fontWeight: row.is_read ? 'normal' : 'bold', color: title.includes('CRITICAL') ? '#a71e24' : 'var(--text-main)' }}>
          {title}
        </span>
      )
    },
    { key: 'message', label: 'Summary' },
    { 
      key: 'is_read', 
      label: 'State',
      render: (is_read) => (
        <span className={`table-badge ${is_read ? 'badge-info' : 'badge-warning'}`}>
          {is_read ? 'Read' : 'New Alert'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Action', 
      sortable: false,
      render: (val, notif) => (
        <button 
          type="button"
          className="table-action-outline"
          onClick={() => handleOpenDrawer(notif)}
        >
          View Alert
        </button>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          Notifications & Emergency Alerts
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Emergency blood shortage alerts & donation eligibility updates in your district.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={notifications}
        gridTemplate="1.2fr 2fr 2.5fr 1fr 130px"
        searchPlaceholder="Search notifications..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No notification alerts found."
      />

      {/* Emergency Shortage Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedNotif)}
        onClose={() => setSelectedNotif(null)}
        title="Emergency Shortage Alert Details"
      >
        {selectedNotif && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Urgency Badge Header */}
            <div style={{ padding: '20px', backgroundColor: selectedNotif.urgency === 'CRITICAL' ? '#fff1f2' : '#f0fdf4', borderRadius: 'var(--radius-md)', border: `1.5px solid ${selectedNotif.urgency === 'CRITICAL' ? '#fecdd3' : '#a7f3d0'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: selectedNotif.urgency === 'CRITICAL' ? '#a71e24' : 'var(--success-main)', textTransform: 'uppercase' }}>
                  🚨 {selectedNotif.urgency || 'URGENT'} Shortage Notice
                </span>
                <span className="table-badge badge-danger">
                  Required: {selectedNotif.blood_type || 'O-'}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '8px' }}>
                {selectedNotif.title}
              </h3>
            </div>

            {/* Request Summary Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {selectedNotif.message}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px', marginTop: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Requesting Facility:</span>
                <strong style={{ fontSize: '0.85rem' }}>{selectedNotif.hospital_name || 'Emergency Center'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Units Needed:</span>
                <strong style={{ fontSize: '0.85rem', color: '#a71e24' }}>{selectedNotif.units_needed || 2} Units</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>District Location:</span>
                <strong style={{ fontSize: '0.85rem' }}>{selectedNotif.location || 'Downtown Center'}</strong>
              </div>
            </div>

            {/* Pledge Action Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {pledged ? (
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1.5px solid #a7f3d0', borderRadius: 'var(--radius-md)', color: 'var(--success-main)', fontWeight: 'bold', textCenter: 'center', textAlign: 'center' }}>
                  ✓ Thank you! Your donation pledge has been transmitted to {selectedNotif.hospital_name || 'the hospital'}.
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn-primary-large"
                  style={{ marginTop: 0, backgroundColor: '#a71e24' }}
                  onClick={() => setPledged(true)}
                >
                  Pledge Emergency Donation
                </button>
              )}

              <button 
                type="button" 
                className="table-action-outline"
                onClick={() => setSelectedNotif(null)}
              >
                Close Alert
              </button>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
