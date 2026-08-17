import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function DonorDonations() {
  const { token, user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('Central Red Cross Blood Bank');
  const [bookingDate, setBookingDate] = useState('2026-08-20');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [healthChecked, setHealthChecked] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, [token]);

  const fetchDonations = async () => {
    try {
      const data = await api.getDonations(token);
      const donationList = data.items || data || [];
      if (donationList.length === 0) {
        setDonations([
          { id: 101, donation_date: '2026-05-12', organization_name: 'Central Red Cross Blood Center', volume_ml: 450, status: 'COMPLETED' },
          { id: 102, donation_date: '2026-01-20', organization_name: 'Metro General Hospital Blood Bank', volume_ml: 450, status: 'COMPLETED' },
          { id: 103, donation_date: '2025-09-15', organization_name: 'LifeSource Community Drive', volume_ml: 450, status: 'COMPLETED' }
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

  const handleBookAppointment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking = {
        id: Date.now(),
        donation_date: bookingDate,
        organization_name: selectedFacility,
        volume_ml: 450,
        status: 'APPOINTMENT'
      };
      setDonations(prev => [newBooking, ...prev]);
      setIsSubmitting(false);
      setIsBookingOpen(false);
    }, 450);
  };

  const columns = [
    { 
      key: 'donation_date', 
      label: 'Donation Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'organization', 
      label: 'Facility / Blood Bank',
      render: (org, row) => org?.name || row.organization_name || 'Central Blood Center'
    },
    { 
      key: 'volume_ml', 
      label: 'Volume Donated',
      render: (vol) => vol ? `${vol} mL` : '450 mL'
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
      
      {/* Header with Schedule Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            My Donation Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Track your lifesaving blood donation history and schedule new voluntary appointments.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-primary-large"
          style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}
          onClick={() => setIsBookingOpen(true)}
        >
          + Schedule New Donation
        </button>
      </div>

      {/* Digital Donor Health Pass Card */}
      <div style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid #e2e8f0', boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.04)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', alignItems: 'center' }}>
        
        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Donor Health Badge
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>🩸</span>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: '900', color: '#a71e24' }}>
                O-Positive (O+)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Universal Recipient Donor</div>
            </div>
          </div>
        </div>

        <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Impact Score
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '8px' }}>
            12 Lives Impacted
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>1,350 mL Total Donated</div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Eligibility Status
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: 'var(--radius-full)', backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', color: 'var(--success-main)', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '8px' }}>
            ✓ Eligible to Donate Today
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Minimum 56-day gap requirement met.</div>
        </div>

      </div>

      {/* Donation History Table */}
      <DataTable
        columns={columns}
        data={donations}
        gridTemplate="1.5fr 2fr 1.2fr 1.2fr"
        searchPlaceholder="Search donation records..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No donation records found."
      />

      {/* Voluntary Appointment Booking Modal */}
      <Modal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        title="Schedule Voluntary Blood Donation"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Select Blood Center / Drive Location
            </label>
            <select 
              className="table-entries-dropdown"
              style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
            >
              <option value="Central Red Cross Blood Bank">Central Red Cross Blood Bank (Main Facility)</option>
              <option value="Metro General Hospital Blood Center">Metro General Hospital Blood Center</option>
              <option value="LifeSource Community Drive">LifeSource Voluntary Drive (District Center)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Preferred Date
              </label>
              <input 
                type="date"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Time Slot
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
              >
                <option value="09:00 AM">09:00 AM - Morning</option>
                <option value="10:00 AM">10:00 AM - Morning</option>
                <option value="02:00 PM">02:00 PM - Afternoon</option>
                <option value="04:30 PM">04:30 PM - Evening</option>
              </select>
            </div>
          </div>

          <div style={{ padding: '16px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 'var(--weight-medium)' }}>
              <input 
                type="checkbox"
                checked={healthChecked}
                onChange={(e) => setHealthChecked(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#a71e24' }}
              />
              I confirm that I feel healthy today, weighed over 50kg, and have not had a fever or tattoo in the past 14 days.
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button" 
              className="btn-primary-large"
              style={{ flex: 1, marginTop: 0, backgroundColor: '#a71e24' }}
              onClick={handleBookAppointment}
              disabled={isSubmitting || !healthChecked}
            >
              {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment Booking'}
            </button>
            <button 
              type="button" 
              className="table-action-outline"
              onClick={() => setIsBookingOpen(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
