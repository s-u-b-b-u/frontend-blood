import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import InputField from '../components/InputField';

export default function HospitalInventory() {
  const { token } = useAuth();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Geolocation / Nearby Compatible Finder
  const [searchParams, setSearchParams] = useState({
    patient_blood_group: 'A_POSITIVE',
    units_needed: 2,
    max_distance_km: 25
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [token]);

  const fetchInventory = async () => {
    try {
      const data = await api.getInventorySummary(token);
      setSummary(data.items || data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchCompatible = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    try {
      const data = await api.findCompatibleInventory(
        token,
        searchParams.patient_blood_group,
        searchParams.units_needed,
        searchParams.max_distance_km
      );
      setSearchResults(data);
    } catch (err) {
      alert('Error searching compatible inventory: ' + err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const summaryColumns = [
    { key: 'blood_group_code', label: 'Blood Group' },
    { key: 'blood_component_code', label: 'Component' },
    { key: 'total_units', label: 'Available Units' },
    { 
      key: 'status', 
      label: 'Supply Level',
      render: (val, row) => {
        const units = row.total_units || 0;
        const isLow = units < 5;
        const isCritical = units === 0;

        return (
          <span className={`table-badge ${isCritical ? 'badge-danger' : isLow ? 'badge-warning' : 'badge-success'}`}>
            {isCritical ? 'CRITICAL OUTAGE' : isLow ? 'LOW STOCK' : 'OPTIMAL'}
          </span>
        );
      }
    }
  ];

  const resultColumns = [
    { key: 'organization_name', label: 'Facility Name' },
    { key: 'organization_type', label: 'Facility Type' },
    { key: 'blood_group', label: 'Blood Group' },
    { key: 'available_units', label: 'Available Units' },
    { 
      key: 'distance_km', 
      label: 'Distance',
      render: (dist) => dist !== undefined ? `${dist.toFixed(1)} km` : 'N/A'
    }
  ];

  if (loading) return <p style={{ padding: '20px' }}>Loading inventory...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>Error: {error}</p>;

  // Calculate totals
  const totalUnits = summary.reduce((acc, curr) => acc + (curr.total_units || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          Hospital Blood Inventory
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Monitor internal blood stock levels & search nearby compatible network supplies.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="stat-card-grid">
        <StatCard
          title="Total Stocked Units"
          value={totalUnits}
          subtitle="Reserved for hospital care"
          iconColor="var(--brand-primary)"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          }
        />

        <StatCard
          title="Stock Categories"
          value={summary.length}
          subtitle="Active blood group / component types"
          iconColor="#2563eb"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          }
        />
      </div>

      {/* Inventory Summary Table */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--weight-bold)', marginBottom: '16px', color: 'var(--text-main)' }}>
          Internal Stock Breakdown
        </h3>

        <DataTable
          columns={summaryColumns}
          data={summary}
          gridTemplate="1.5fr 1.5fr 1.5fr 1.5fr"
          searchPlaceholder="Filter inventory by blood group, component..."
        />
      </div>

      {/* Nearby Compatible Inventory Search Form */}
      <div style={{ padding: '24px', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1.5px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--weight-bold)', marginBottom: '8px', color: 'var(--text-main)' }}>
          🔍 Emergency Compatible Supply Search
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)', marginBottom: '16px' }}>
          Locate compatible blood inventory units across nearby hospitals and blood banks within your region.
        </p>

        <form onSubmit={handleSearchCompatible} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <InputField
            label="Patient Blood Group"
            type="select"
            value={searchParams.patient_blood_group}
            onChange={e => setSearchParams({...searchParams, patient_blood_group: e.target.value})}
            options={[
              { value: 'A_POSITIVE', label: 'A+' },
              { value: 'A_NEGATIVE', label: 'A-' },
              { value: 'B_POSITIVE', label: 'B+' },
              { value: 'B_NEGATIVE', label: 'B-' },
              { value: 'AB_POSITIVE', label: 'AB+' },
              { value: 'AB_NEGATIVE', label: 'AB-' },
              { value: 'O_POSITIVE', label: 'O+' },
              { value: 'O_NEGATIVE', label: 'O-' }
            ]}
          />

          <InputField
            label="Units Needed"
            type="number"
            value={searchParams.units_needed}
            onChange={e => setSearchParams({...searchParams, units_needed: Number(e.target.value)})}
            min="1"
          />

          <InputField
            label="Max Distance (KM)"
            type="number"
            value={searchParams.max_distance_km}
            onChange={e => setSearchParams({...searchParams, max_distance_km: Number(e.target.value)})}
            min="1"
          />

          <button type="submit" className="btn-primary-large" disabled={searchLoading} style={{ marginTop: 0 }}>
            {searchLoading ? 'Searching...' : 'Find Compatible Stock'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults && (
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--weight-bold)', marginBottom: '12px' }}>
              Search Results ({searchResults.matches?.length || 0} compatible matches found)
            </h4>

            <DataTable
              columns={resultColumns}
              data={searchResults.matches || []}
              gridTemplate="2fr 1.2fr 1fr 1fr 1fr"
              searchPlaceholder="Filter search results..."
            />
          </div>
        )}
      </div>

    </div>
  );
}
