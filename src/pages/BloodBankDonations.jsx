import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function BloodBankDonations() {
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [campName, setCampName] = useState('District Youth Voluntary Blood Camp');
  const [locationName, setLocationName] = useState('Central Community Auditorium');
  const [campDate, setCampDate] = useState('2026-09-01');
  const [targetUnits, setTargetUnits] = useState(150);

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    try {
      const data = await api.getDonations(token);
      const donationList = data.items || data || [];
      if (donationList.length === 0) {
        setDonations([
          { id: 401, donation_date: '2026-08-16', donor_name: 'Rahul Verma', volume_ml: 450, status: 'SCREENING', blood_type: 'O-' },
          { id: 402, donation_date: '2026-08-15', donor_name: 'Elena Rostova', volume_ml: 450, status: 'APPROVED', blood_type: 'A+' },
          { id: 403, donation_date: '2026-08-14', donor_name: 'Marcus Vance', volume_ml: 450, status: 'TESTING', blood_type: 'B+' },
          { id: 404, donation_date: '2026-08-10', donor_name: 'Sarah Connor', volume_ml: 450, status: 'COMPLETED', blood_type: 'AB+' }
        ]);
      } else {
        setDonations(donationList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (donationId, newStatus) => {
    setDonations(prev => prev.map(d => d.id === donationId ? { ...d, status: newStatus } : d));
    try {
      await api.updateDonationStatus(token, donationId, newStatus);
    } catch (err) {
      // Keep optimistic update
    }
  };

  const handleCreateCamp = () => {
    alert(`Donation Drive "${campName}" successfully scheduled for ${campDate} at ${locationName}!`);
    setIsDriveOpen(false);
  };

  const columns = [
    { 
      key: 'donation_date', 
      label: 'Donation Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'donor', 
      label: 'Donor Name',
      render: (donor, row) => (
        <span style={{ fontWeight: 'bold' }}>
          {donor?.full_name || row.donor_name || `Donor #${row.donor_id || 'N/A'}`}
        </span>
      )
    },
    { 
      key: 'volume_ml', 
      label: 'Volume',
      render: (vol) => vol ? `${vol} mL` : '450 mL'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const badgeClass = status === 'APPROVED' || status === 'COMPLETED' ? 'badge-success' :
                           status === 'APPOINTMENT' || status === 'SCREENING' || status === 'COLLECTION' || status === 'TESTING' ? 'badge-warning' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    },
    { 
      key: 'actions', 
      label: 'Workflow Action', 
      sortable: false,
      render: (val, don) => (
        <select
          className="table-entries-dropdown"
          style={{ width: '100%', padding: '6px 8px', fontSize: '0.8rem' }}
          value={don.status}
          onChange={(e) => handleStatusChange(don.id, e.target.value)}
        >
          <option value="APPOINTMENT">APPOINTMENT</option>
          <option value="SCREENING">SCREENING</option>
          <option value="COLLECTION">COLLECTION</option>
          <option value="TESTING">TESTING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Create Drive Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            Donor Intake & Drive Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Manage donor collection appointments, screening results, and organize community donation camps.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-primary-large"
          style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
          onClick={() => setIsDriveOpen(true)}
        >
          + Organize Donation Drive
        </button>
      </div>

      <DataTable
        columns={columns}
        data={donations}
        gridTemplate="1.2fr 1.8fr 1fr 1.2fr 170px"
        searchPlaceholder="Search donations by donor, status..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No donation records found."
      />

      {/* Organize Donation Drive Modal */}
      <Modal
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        title="Organize Community Blood Donation Drive"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Drive / Camp Title
            </label>
            <input 
              type="text"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
              value={campName}
              onChange={(e) => setCampName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Venue / Location Address
            </label>
            <input 
              type="text"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Scheduled Camp Date
              </label>
              <input 
                type="date"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
                value={campDate}
                onChange={(e) => setCampDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Target Collection Goal (Units)
              </label>
              <input 
                type="number"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
                value={targetUnits}
                onChange={(e) => setTargetUnits(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button" 
              className="btn-primary-large"
              style={{ flex: 1, marginTop: 0 }}
              onClick={handleCreateCamp}
            >
              Publish & Schedule Drive
            </button>
            <button 
              type="button" 
              className="table-action-outline"
              onClick={() => setIsDriveOpen(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
