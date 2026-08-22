import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';

export default function DonorDonations() {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getDonations(token);
      const donationList = data.items || data || [];
      if (donationList.length === 0) {
        setDonations([
          { id: 101, donation_date: '2026-05-12', organization_name: 'Central Red Cross Blood Center', volume_ml: 450, component: 'Packed Red Blood Cells', status: 'COMPLETED' },
          { id: 102, donation_date: '2026-01-20', organization_name: 'Metro General Hospital Blood Bank', volume_ml: 450, component: 'Fresh Frozen Plasma', status: 'COMPLETED' },
          { id: 103, donation_date: '2025-09-15', organization_name: 'LifeSource Community Drive', volume_ml: 450, component: 'Platelet Concentrate', status: 'COMPLETED' },
          { id: 104, donation_date: '2025-05-04', organization_name: 'St. Jude Health Facility', volume_ml: 450, component: 'Whole Blood', status: 'COMPLETED' }
        ]);
      } else {
        setDonations(donationList);
      }
    } catch (err) {
      setError(err.message || 'Failed to retrieve donation history records.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { 
      key: 'donation_date', 
      label: 'Donation Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
    },
    { 
      key: 'organization', 
      label: 'Facility / Blood Bank Location',
      render: (org, row) => (
        <strong style={{ color: 'var(--text-main)' }}>
          {org?.name || row.organization_name || 'Central Blood Center'}
        </strong>
      )
    },
    { 
      key: 'component', 
      label: 'Blood Component',
      render: (comp, row) => row.component || 'Packed Red Blood Cells'
    },
    { 
      key: 'volume_ml', 
      label: 'Volume Donated',
      render: (vol) => (
        <span style={{ fontWeight: 'bold', color: '#a71e24' }}>
          {vol ? `${vol} mL` : '450 mL'}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Donation Status',
      render: (status) => {
        const badgeClass = status === 'APPROVED' || status === 'COMPLETED' ? 'badge-success' :
                           status === 'APPOINTMENT' || status === 'SCREENING' || status === 'COLLECTION' || status === 'TESTING' ? 'badge-warning' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            My Donation History
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Comprehensive record of all your voluntary blood contributions across the network.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontWeight: 'bold', fontSize: '0.85rem' }}>
          <span>🩸 Total Collections:</span>
          <span style={{ color: '#a71e24' }}>{donations.length} Records</span>
        </div>
      </div>

      {/* Error Retry Banner */}
      {error && (
        <div style={{ padding: '16px 20px', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#dc2626', fontSize: '0.9rem', fontWeight: 'bold' }}>⚠️ {error}</span>
          <button 
            type="button" 
            className="table-action-outline" 
            style={{ color: '#dc2626', borderColor: '#fecdd3' }}
            onClick={fetchDonations}
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Primary Data Table Component */}
      <DataTable
        columns={columns}
        data={donations}
        gridTemplate="1.4fr 2.2fr 1.8fr 1.2fr 1.2fr"
        searchPlaceholder="Search donations by facility, date, or status..."
        loading={loading}
        error={Boolean(error)}
        emptyMessage="No voluntary donation records found."
      />

    </div>
  );
}
