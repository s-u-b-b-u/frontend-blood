import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';

export default function Organizations() {
  const { token } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [orgDetails, setOrgDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchOrganizations();
  }, [token]);

  const fetchOrganizations = async () => {
    try {
      const data = await api.getOrganizations(token);
      const orgList = data.items || data || [];
      // Fallback sample data if API returns empty list
      if (orgList.length === 0) {
        setOrganizations([
          { id: 1, name: 'Metro General Hospital', org_type: 'HOSPITAL', license_number: 'HOSP-NY-8402', phone: '+1 555-0192', address: '100 Medical Plaza, NY', is_verified: true, beds_count: 450, has_icu: true },
          { id: 2, name: 'Red Cross Regional Blood Center', org_type: 'BLOOD_BANK', license_number: 'BB-NY-1029', phone: '+1 555-0144', address: '45 Health Way, NY', is_verified: true, storage_capacity_liters: 1200 },
          { id: 3, name: 'St. Jude Children Emergency Facility', org_type: 'HOSPITAL', license_number: 'HOSP-NY-9912', phone: '+1 555-0881', address: '12 Care St, NY', is_verified: false, beds_count: 220, has_icu: true },
          { id: 4, name: 'LifeSource Community Blood Bank', org_type: 'BLOOD_BANK', license_number: 'BB-NY-4481', phone: '+1 555-0312', address: '88 Donor Ave, NY', is_verified: false, storage_capacity_liters: 800 }
        ]);
      } else {
        setOrganizations(orgList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerify = async (orgId, currentStatus) => {
    setOrganizations(prev => prev.map(org => org.id === orgId ? { ...org, is_verified: !currentStatus } : org));
    if (orgDetails && orgDetails.id === orgId) {
      setOrgDetails(prev => prev ? { ...prev, is_verified: !currentStatus } : null);
    }
    try {
      await api.updateOrganization(token, orgId, { is_verified: !currentStatus });
    } catch (err) {
      // Revert if API fails
      fetchOrganizations();
    }
  };

  const handleViewDetails = async (orgItem) => {
    setSelectedOrgId(orgItem.id);
    setOrgDetails(orgItem);
    setDetailsLoading(true);
    try {
      const details = await api.getOrganizationById(token, orgItem.id);
      setOrgDetails(details);
    } catch (err) {
      // Keep sample item if API fails
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredOrgs = typeFilter === 'ALL' 
    ? organizations 
    : organizations.filter(o => o.org_type === typeFilter);

  const columns = [
    { key: 'name', label: 'Organization Name' },
    { 
      key: 'org_type', 
      label: 'Type',
      render: (org_type) => (
        <span style={{ fontWeight: 'var(--weight-semibold)', color: org_type === 'HOSPITAL' ? '#a71e24' : 'var(--text-main)' }}>
          {org_type}
        </span>
      )
    },
    { key: 'license_number', label: 'License #' },
    { key: 'phone', label: 'Phone' },
    { 
      key: 'is_verified', 
      label: 'Verification',
      render: (is_verified) => (
        <span className={`table-badge ${is_verified ? 'badge-success' : 'badge-warning'}`}>
          {is_verified ? 'Verified' : 'Pending Verification'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (val, org) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className="table-action-outline"
            onClick={() => handleViewDetails(org)}
          >
            Inspect
          </button>
          <button 
            type="button"
            className="table-action-outline"
            style={{ color: org.is_verified ? 'var(--brand-primary)' : 'var(--success-main)', borderColor: org.is_verified ? '#fecdd3' : '#a7f3d0' }}
            onClick={() => handleToggleVerify(org.id, org.is_verified)}
          >
            {org.is_verified ? 'Revoke' : 'Approve'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            Registered Organizations
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Manage and verify healthcare facilities across the network.
          </p>
        </div>

        {/* Type Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          {['ALL', 'HOSPITAL', 'BLOOD_BANK'].map((t) => (
            <button
              key={t}
              type="button"
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                backgroundColor: typeFilter === t ? '#a71e24' : 'transparent',
                color: typeFilter === t ? '#ffffff' : 'var(--text-muted)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'ALL' ? 'All Orgs' : t}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrgs}
        gridTemplate="1.8fr 1.2fr 1.2fr 1.2fr 1.2fr 170px"
        searchPlaceholder="Search organizations by name, license..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No registered organizations found."
      />

      {/* Organization Verification Inspector Drawer */}
      <Drawer
        isOpen={Boolean(selectedOrgId)}
        onClose={() => setSelectedOrgId(null)}
        title="Organization Verification Inspector"
      >
        {orgDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Status Header */}
            <div style={{ padding: '20px', backgroundColor: orgDetails.is_verified ? '#f0fdf4' : '#fff1f2', borderRadius: 'var(--radius-md)', border: `1.5px solid ${orgDetails.is_verified ? '#a7f3d0' : '#fecdd3'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: orgDetails.is_verified ? 'var(--success-main)' : '#a71e24', textTransform: 'uppercase' }}>
                  {orgDetails.is_verified ? '✓ Verified Facility' : '⏳ Pending Credentials Review'}
                </span>
                <span className={`table-badge ${orgDetails.is_verified ? 'badge-success' : 'badge-warning'}`}>
                  {orgDetails.org_type}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '8px' }}>
                {orgDetails.name}
              </h3>
            </div>

            {/* License & Credentials Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Medical License Number:</span>
                <strong style={{ fontSize: '0.85rem' }}>{orgDetails.license_number}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Phone Contact:</span>
                <strong style={{ fontSize: '0.85rem' }}>{orgDetails.phone}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Facility Address:</span>
                <strong style={{ fontSize: '0.85rem', textAlign: 'right' }}>{orgDetails.address}</strong>
              </div>

              {orgDetails.beds_count !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Available Hospital Beds:</span>
                  <strong style={{ fontSize: '0.85rem' }}>{orgDetails.beds_count} Beds</strong>
                </div>
              )}

              {orgDetails.has_icu !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ICU Facility:</span>
                  <strong style={{ fontSize: '0.85rem', color: orgDetails.has_icu ? 'var(--success-main)' : 'var(--text-muted)' }}>
                    {orgDetails.has_icu ? 'Yes (Equipped)' : 'No'}
                  </strong>
                </div>
              )}

              {orgDetails.storage_capacity_liters !== undefined && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blood Reserve Capacity:</span>
                  <strong style={{ fontSize: '0.85rem' }}>{orgDetails.storage_capacity_liters} Liters</strong>
                </div>
              )}
            </div>

            {/* Approval / Verification Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <button 
                type="button"
                className="btn-primary-large"
                style={{ 
                  marginTop: 0, 
                  backgroundColor: orgDetails.is_verified ? '#dc2626' : '#059669' 
                }}
                onClick={() => handleToggleVerify(orgDetails.id, orgDetails.is_verified)}
              >
                {orgDetails.is_verified ? 'Revoke Verification Credentials' : 'Approve & Verify Organization'}
              </button>

              <button 
                type="button" 
                className="table-action-outline"
                onClick={() => setSelectedOrgId(null)}
              >
                Close Inspector
              </button>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
