import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/StatCard';
import DonorDashboard from './DonorDashboard';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    metric1: { title: 'Available Blood Units', value: 0, subtitle: 'Across compatible groups' },
    metric2: { title: 'Emergency Requests', value: 0, subtitle: 'High priority requests' },
    metric3: { title: 'Active Transfers', value: 0, subtitle: 'Inter-facility dispatches' },
    metric4: { title: 'Verified Facilities', value: 0, subtitle: 'Registered network partners' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token && user && user.role !== 'DONOR') {
      fetchDashboardStats();
    }
  }, [token, user]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(false);
    try {
      if (user?.role === 'HOSPITAL') {
        const [invData, reqData, trData] = await Promise.allSettled([
          api.getInventorySummary(token),
          api.getBloodRequests(token),
          api.getTransfers(token)
        ]);

        const invItems = invData.status === 'fulfilled' ? (invData.value.items || invData.value || []) : [];
        const reqItems = reqData.status === 'fulfilled' ? (reqData.value.items || reqData.value || []) : [];
        const trItems = trData.status === 'fulfilled' ? (trData.value.items || trData.value || []) : [];

        const totalUnits = invItems.reduce((acc, curr) => acc + (curr.total_units || 0), 0);
        const urgentReqs = reqItems.filter(r => r.priority === 'CRITICAL' || r.priority === 'URGENT' || r.priority === 'HIGH').length;

        setStats({
          metric1: { title: 'Available Blood Units', value: totalUnits, subtitle: 'In hospital stock' },
          metric2: { title: 'Total Blood Requests', value: reqItems.length, subtitle: `${urgentReqs} high priority` },
          metric3: { title: 'Active Transfers', value: trItems.length, subtitle: 'Incoming shipments' },
          metric4: { title: 'Stock Categories', value: invItems.length, subtitle: 'Active component types' }
        });
      } else if (user?.role === 'BLOOD_BANK') {
        const [unitData, donData, trData] = await Promise.allSettled([
          api.getBloodUnits(token),
          api.getDonations(token),
          api.getTransfers(token)
        ]);

        const unitItems = unitData.status === 'fulfilled' ? (unitData.value.items || unitData.value || []) : [];
        const donItems = donData.status === 'fulfilled' ? (donData.value.items || donData.value || []) : [];
        const trItems = trData.status === 'fulfilled' ? (trData.value.items || trData.value || []) : [];

        const availableUnits = unitItems.filter(u => u.status === 'AVAILABLE').length;

        setStats({
          metric1: { title: 'Total Blood Units', value: unitItems.length, subtitle: `${availableUnits} available for release` },
          metric2: { title: 'Donor Appointments', value: donItems.length, subtitle: 'Screenings & collections' },
          metric3: { title: 'Dispatched Transfers', value: trItems.length, subtitle: 'Inter-facility shipments' },
          metric4: { title: 'Testing Queue', value: unitItems.filter(u => u.status === 'UNDER_TESTING').length, subtitle: 'Units pending lab check' }
        });
      } else if (user?.role === 'ADMIN') {
        const [orgData, userData, logData] = await Promise.allSettled([
          api.getOrganizations(token),
          api.getUsers(token),
          api.getAuditLogs(token)
        ]);

        const orgItems = orgData.status === 'fulfilled' ? (orgData.value.items || orgData.value || []) : [];
        const userItems = userData.status === 'fulfilled' ? (userData.value.items || userData.value || []) : [];
        const logItems = logData.status === 'fulfilled' ? (logData.value.items || logData.value || []) : [];

        const verifiedOrgs = orgItems.filter(o => o.is_verified).length;

        setStats({
          metric1: { title: 'Total Organizations', value: orgItems.length, subtitle: `${verifiedOrgs} verified partners` },
          metric2: { title: 'Registered Users', value: userItems.length, subtitle: 'Across all portal roles' },
          metric3: { title: 'Audit Trail Events', value: logItems.length, subtitle: 'Logged security events' },
          metric4: { title: 'Pending Verifications', value: orgItems.length - verifiedOrgs, subtitle: 'Awaiting admin check' }
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Dedicated Redesigned Dashboard for DONOR Role
  if (user?.role === 'DONOR') {
    return <DonorDashboard />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Overview Header */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          Overview Dashboard
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Real-time network metrics & account summary for BloodLink.
        </p>
      </div>

      {/* Generalized Error State Card */}
      {error ? (
        <div className="state-card error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p style={{ fontWeight: '700', color: '#dc2626', fontSize: '1rem', marginBottom: '4px' }}>
            Unable to load dashboard analytics
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            We encountered an issue retrieving live metric data. Please check your network connection or try refreshing.
          </p>
        </div>
      ) : loading ? (
        /* Shimmer Skeleton Loading State Grid */
        <div className="stat-card-grid">
          <StatCard loading={true} />
          <StatCard loading={true} />
          <StatCard loading={true} />
          <StatCard loading={true} />
        </div>
      ) : (
        /* Analytical Metric Cards Grid with Real Backend Counts */
        <div className="stat-card-grid">
          <StatCard
            title={stats.metric1.title}
            value={stats.metric1.value}
            subtitle={stats.metric1.subtitle}
            iconColor="var(--brand-primary)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
            }
          />

          <StatCard
            title={stats.metric2.title}
            value={stats.metric2.value}
            subtitle={stats.metric2.subtitle}
            valueColor="var(--brand-primary)"
            iconColor="var(--state-error)"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            }
          />

          <StatCard
            title={stats.metric3.title}
            value={stats.metric3.value}
            subtitle={stats.metric3.subtitle}
            iconColor="#2563eb"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            }
          />

          <StatCard
            title={stats.metric4.title}
            value={stats.metric4.value}
            subtitle={stats.metric4.subtitle}
            iconColor="#059669"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline className="check-tick" points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            }
          />
        </div>
      )}

      {/* Active Session Details Card */}
      <div style={{ padding: '24px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--weight-bold)', marginBottom: '16px', color: 'var(--text-main)' }}>
          Active Session Details
        </h3>
        {user ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Registered Email</div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-main)' }}>{user.email}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Account Role</div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--brand-primary)' }}>{user.role}</div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Account Status</div>
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--state-success)' }}>{user.is_active ? 'Active & Verified' : 'Inactive'}</div>
            </div>
          </div>
        ) : (
          <p>Loading profile data...</p>
        )}
      </div>

    </div>
  );
}
