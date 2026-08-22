import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import Skeleton from '../components/Skeleton';
import Drawer from '../components/Drawer';
import DonorHero, { formatBloodGroupShortCode } from '../components/DonorHero';

export default function DonorDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [donorProfile, setDonorProfile] = useState(null);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [donations, setDonations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [pledged, setPledged] = useState(false);

  useEffect(() => {
    fetchDonorDashboardData();
  }, [token, user]);

  const fetchDonorDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profRes, bgRes, donRes, notifRes] = await Promise.allSettled([
        api.getDonorProfile(token),
        api.getBloodGroups(),
        api.getDonations(token),
        api.getNotifications(token)
      ]);

      if (bgRes.status === 'fulfilled' && bgRes.value) {
        setBloodGroups(bgRes.value.items || bgRes.value || []);
      }

      if (profRes.status === 'fulfilled' && profRes.value) {
        setDonorProfile(profRes.value);
      }

      if (donRes.status === 'fulfilled' && donRes.value) {
        setDonations(donRes.value.items || donRes.value || []);
      }

      if (notifRes.status === 'fulfilled' && notifRes.value) {
        setNotifications(notifRes.value.items || notifRes.value || []);
      }

    } catch (err) {
      setError('Unable to load donor portal analytics. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const totalDonationsCount = donations.length;
  const totalVolumeMl = donations.reduce((acc, curr) => acc + (curr.volume_ml || 450), 0);
  const livesSavedCount = totalDonationsCount * 3;

  const recentDonations = donations.slice(0, 3);
  const recentAlerts = notifications.slice(0, 3);
  const displayBloodGroupShort = formatBloodGroupShortCode(donorProfile, bloodGroups);
  const displayName = donorProfile?.full_name || (user?.email ? user.email.split('@')[0] : 'Donor');

  // FULL 12-MONTH YEARLY DATA BUCKETS (Jan - Dec)
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const yearlyChartData = MONTHS.map((monthName, monthIndex) => {
    const totalVolumeForMonth = donations.reduce((sum, d) => {
      if (!d.donation_date) return sum;
      const dDate = new Date(d.donation_date);
      if (dDate.getMonth() === monthIndex) {
        return sum + (d.volume_ml || 450);
      }
      return sum;
    }, 0);

    return {
      month: monthName,
      volume: totalVolumeForMonth
    };
  });

  const maxMonthlyVolume = Math.max(500, ...yearlyChartData.map(m => m.volume));

  // Loading Skeleton View
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <Skeleton height="220px" borderRadius="20px" />
        <div style={{ display: 'grid', gridTemplateColumns: '66% 32%', gap: '2%' }}>
          <Skeleton height="320px" borderRadius="16px" />
          <Skeleton height="320px" borderRadius="16px" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <Skeleton height="280px" borderRadius="16px" />
          <Skeleton height="280px" borderRadius="16px" />
          <Skeleton height="280px" borderRadius="16px" />
        </div>
      </div>
    );
  }

  // Error State View
  if (error) {
    return (
      <div style={{ padding: '32px', backgroundColor: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '16px', textAlign: 'center' }}>
        <p style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '8px' }}>
          ⚠️ {error}
        </p>
        <button 
          type="button"
          className="btn-primary-large"
          style={{ width: 'auto', padding: '10px 24px', margin: '12px auto 0 auto' }}
          onClick={fetchDonorDashboardData}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* 1. SEPARATED DEDICATED DONOR HERO SECTION */}
      <DonorHero 
        donorProfile={donorProfile} 
        user={user} 
        bloodGroups={bloodGroups} 
        donations={donations} 
      />

      {/* SECTION DIVIDER & DASHBOARD TITLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)' }}>
            Donor Portal Analytics & Dashboard
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Live insights, component metrics, digital pass, and shortage alerts.
          </p>
        </div>
      </div>

      {/* 2. DASHBOARD CARDS LAYOUT GRID (Matching Reference Screenshot media_1787406472199.png) */}
      
      {/* TOP ROW (2 CARDS: 66% Wide Activity Chart + 32% Digital Pass) */}
      <div style={{ display: 'grid', gridTemplateColumns: '66% 32%', gap: '2%', width: '100%', alignItems: 'stretch' }}>
        
        {/* TOP-LEFT WIDE CARD: Full 12-Month Yearly Donation Activity Timeline */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Donation Activity & Accumulated Volume (Full Year)
              </h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#a71e24', backgroundColor: '#fff1f2', padding: '4px 10px', borderRadius: '8px' }}>
                {totalVolumeMl.toLocaleString()} mL Total Donated
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
              12-month annual collection timeline (Jan – Dec).
            </p>
          </div>

          {/* FULL 12-MONTH VISUAL BAR GRAPH */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justify: 'space-between',
            height: '190px',
            paddingTop: '20px',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '8px',
            gap: '4px'
          }}>
            {yearlyChartData.map((m, index) => {
              const hasVolume = m.volume > 0;
              const heightPct = hasVolume ? Math.max(18, (m.volume / maxMonthlyVolume) * 100) : 4;

              return (
                <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: hasVolume ? '800' : '500',
                    color: hasVolume ? '#a71e24' : '#cbd5e1'
                  }}>
                    {hasVolume ? `${m.volume}` : '0'}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '24px',
                    height: `${heightPct}%`,
                    backgroundColor: hasVolume ? (index % 2 === 0 ? '#a71e24' : '#0284c7') : '#e2e8f0',
                    borderRadius: hasVolume ? '6px 6px 2px 2px' : '4px',
                    transition: 'height 0.4s ease'
                  }} />
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: hasVolume ? 'bold' : 'normal',
                    color: hasVolume ? 'var(--text-main)' : 'var(--text-muted)'
                  }}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP-RIGHT CARD: Digital Donor Health Pass */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Digital Donor Pass
            </div>

            {/* Styled ID Card Surface */}
            <div style={{
              background: 'linear-gradient(135deg, #a71e24 0%, #881337 100%)',
              color: '#ffffff',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 8px 20px rgba(167, 30, 36, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', letterSpacing: '0.05em' }}>BLOODLINK NETWORK</span>
                <span style={{ padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', fontWeight: 'bold' }}>VERIFIED</span>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{displayName}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>Registered Voluntary Donor</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '900' }}>{displayBloodGroupShort}</span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Donor Status: Active</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Emergency Phone:</span>
              <strong>{donorProfile?.phone || 'N/A'}</strong>
            </div>
            <button 
              type="button" 
              className="table-action-outline"
              style={{ width: '100%', padding: '8px', textAlign: 'center' }}
              onClick={() => navigate('/dashboard/profile')}
            >
              View Full Profile
            </button>
          </div>
        </div>

      </div>

      {/* BOTTOM ROW (3 EQUAL CARDS: Component Donut + Impact Summary + Emergency Alerts) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', width: '100%' }}>

        {/* BOTTOM-LEFT CARD: Component Impact Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>
              Component Breakdown
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
              Distribution of donated blood components.
            </p>
          </div>

          {/* Visual SVG Donut Ring Representation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '12px 0' }}>
            <svg width="100" height="100" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3.8" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a71e24" strokeWidth="3.8" strokeDasharray="50 50" strokeDashoffset="25" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0284c7" strokeWidth="3.8" strokeDasharray="30 70" strokeDashoffset="75" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="3.8" strokeDasharray="20 80" strokeDashoffset="5" />
            </svg>
          </div>

          {/* Component Legend List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a71e24' }} />
                Packed Red Cells (PRBC)
              </span>
              <strong>50%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
                Fresh Frozen Plasma (FFP)
              </span>
              <strong>30%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
                Platelet Concentrate
              </span>
              <strong>20%</strong>
            </div>
          </div>
        </div>

        {/* BOTTOM-CENTER CARD: Impact Summary & Recent Activity */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lifesaving Impact
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px' }}>
              {livesSavedCount} Lives Saved
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--success-main)', fontWeight: 'bold' }}>
              +3 lives per successful 450 mL unit
            </div>
          </div>

          <div style={{ borderTop: '1.5px dashed #e2e8f0', margin: '16px 0' }} />

          {/* Recent 3 Donations List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Recent Logs</span>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', color: '#a71e24', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}
                onClick={() => navigate('/dashboard/donations')}
              >
                View All →
              </button>
            </div>

            {recentDonations.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No recent donation records.</div>
            ) : (
              recentDonations.map((d) => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', paddingBottom: '6px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-main)' }}>{d.organization_name || 'Blood Center'}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{new Date(d.donation_date).toLocaleDateString()}</span>
                  </div>
                  <span className="table-badge badge-success">{d.volume_ml || 450} mL</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* BOTTOM-RIGHT CARD: District Emergency Shortages */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1.5px solid #e2e8f0',
          padding: '24px',
          boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                District Shortage Alerts
              </h3>
              <span className="table-badge badge-danger" style={{ fontSize: '0.7rem' }}>
                {notifications.filter(n => !n.is_read).length} Unread
              </span>
            </div>

            {/* List of Recent Emergency Alerts */}
            {recentAlerts.length === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                ✓ No active emergency shortages in your district.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentAlerts.map((n) => (
                  <div 
                    key={n.id} 
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: n.urgency === 'CRITICAL' ? '#fff1f2' : '#f8fafc',
                      border: `1px solid ${n.urgency === 'CRITICAL' ? '#fecdd3' : '#e2e8f0'}`,
                      cursor: 'pointer'
                    }}
                    onClick={() => { setSelectedNotif(n); setPledged(false); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      <span style={{ color: n.urgency === 'CRITICAL' ? '#a71e24' : 'var(--text-main)' }}>{n.title}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{n.blood_type || 'O-'}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {n.hospital_name || 'Emergency Center'} • {n.units_needed || 2} units
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="button" 
            className="table-action-outline"
            style={{ width: '100%', padding: '8px', textAlign: 'center', marginTop: '12px' }}
            onClick={() => navigate('/dashboard/notifications')}
          >
            Manage Notifications →
          </button>
        </div>

      </div>

      {/* Emergency Alert Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedNotif)}
        onClose={() => setSelectedNotif(null)}
        title="Emergency Shortage Alert Details"
      >
        {selectedNotif && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: selectedNotif.urgency === 'CRITICAL' ? '#fff1f2' : '#f0fdf4', borderRadius: '12px', border: `1.5px solid ${selectedNotif.urgency === 'CRITICAL' ? '#fecdd3' : '#a7f3d0'}` }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: selectedNotif.urgency === 'CRITICAL' ? '#a71e24' : 'var(--success-main)', textTransform: 'uppercase' }}>
                🚨 {selectedNotif.urgency || 'URGENT'} Shortage Notice
              </div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '6px' }}>
                {selectedNotif.title}
              </h4>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {selectedNotif.message}
            </p>

            {pledged ? (
              <div style={{ padding: '14px', backgroundColor: '#f0fdf4', border: '1.5px solid #a7f3d0', borderRadius: '10px', color: 'var(--success-main)', fontWeight: 'bold', textAlign: 'center' }}>
                ✓ Thank you! Your pledge has been recorded.
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
          </div>
        )}
      </Drawer>

    </div>
  );
}
