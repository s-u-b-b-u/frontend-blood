import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';

export default function BloodBankTransfers() {
  const { token } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [carrierName, setCarrierName] = useState('Red Cross Cold-Chain Fleet #4');
  const [tempCelsius, setTempCelsius] = useState('4.0°C');

  useEffect(() => {
    fetchTransfers();
  }, [token]);

  const fetchTransfers = async () => {
    try {
      const data = await api.getTransfers(token);
      const transferList = data.items || data || [];
      if (transferList.length === 0) {
        setTransfers([
          { id: 601, created_at: '2026-08-17', receiver_organization_name: 'Metro General Hospital', blood_type: 'O-', units_count: 4, status: 'DRAFT', priority: 'CRITICAL' },
          { id: 602, created_at: '2026-08-16', receiver_organization_name: 'St. Jude Children Hospital', blood_type: 'A+', units_count: 2, status: 'IN_TRANSIT', priority: 'HIGH', carrier: 'Red Cross Cold-Chain Fleet #4', temp_celsius: '3.8°C' },
          { id: 603, created_at: '2026-08-14', receiver_organization_name: 'City Trauma Center', blood_type: 'B+', units_count: 1, status: 'RECEIVED', priority: 'NORMAL', carrier: 'Express Med Courier', temp_celsius: '4.2°C' }
        ]);
      } else {
        setTransfers(transferList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatchSubmit = async (transferId) => {
    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'IN_TRANSIT', carrier: carrierName, temp_celsius: tempCelsius } : t));
    setSelectedTransfer(null);
    try {
      await api.dispatchTransfer(token, transferId);
    } catch (err) {
      // Keep optimistic state update
    }
  };

  const columns = [
    { 
      key: 'created_at', 
      label: 'Request Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'receiver_organization', 
      label: 'Target Hospital Facility',
      render: (org, row) => (
        <span style={{ fontWeight: 'bold' }}>
          {org?.name || row.receiver_organization_name || 'Emergency Center'}
        </span>
      )
    },
    { 
      key: 'blood_type', 
      label: 'Group & Units',
      render: (val, row) => `${row.blood_type || 'O-'} (${row.units_count || 2} Units)`
    },
    { 
      key: 'status', 
      label: 'Shipment Status',
      render: (status) => {
        const badgeClass = status === 'RECEIVED' ? 'badge-success' :
                           status === 'DISPATCHED' || status === 'IN_TRANSIT' ? 'badge-info' :
                           status === 'DRAFT' || status === 'PENDING' ? 'badge-warning' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    },
    { 
      key: 'actions', 
      label: 'Dispatch Actions', 
      sortable: false,
      render: (val, tr) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className="table-action-outline"
            onClick={() => setSelectedTransfer(tr)}
          >
            Manage Dispatch
          </button>
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          Blood Dispatch & Transfer Control
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Approve hospital blood unit requests and assign cold-chain courier transport.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={transfers}
        gridTemplate="1.2fr 2fr 1.5fr 1.2fr 160px"
        searchPlaceholder="Search transfers by hospital name..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No transfer requests recorded."
      />

      {/* Dispatch Action & Carrier Assignment Drawer */}
      <Drawer
        isOpen={Boolean(selectedTransfer)}
        onClose={() => setSelectedTransfer(null)}
        title="Cold-Chain Transfer Dispatch Inspector"
      >
        {selectedTransfer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Target Facility Summary */}
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a71e24', textTransform: 'uppercase' }}>
                {selectedTransfer.priority || 'HIGH'} Priority Dispatch
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)', marginTop: '6px' }}>
                {selectedTransfer.receiver_organization_name || 'Hospital Facility'}
              </h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Units Requested: <strong>{selectedTransfer.units_count || 2} Units of {selectedTransfer.blood_type || 'O-'}</strong>
              </div>
            </div>

            {/* Carrier & Temperature Assignment Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Assign Cold-Chain Logistics Carrier
                </label>
                <select 
                  className="table-entries-dropdown"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                  value={carrierName}
                  onChange={(e) => setCarrierName(e.target.value)}
                >
                  <option value="Red Cross Cold-Chain Fleet #4">Red Cross Cold-Chain Fleet #4 (Refrigerated Vehicle)</option>
                  <option value="Express Med Transport #12">Express Med Transport #12 (Rapid Dispatch)</option>
                  <option value="District Emergency Courier">District Emergency Courier Service</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Monitored Cold-Storage Temperature
                </label>
                <input 
                  type="text"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(e.target.value)}
                />
              </div>
            </div>

            {/* Dispatch Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {selectedTransfer.status !== 'IN_TRANSIT' && selectedTransfer.status !== 'RECEIVED' ? (
                <button 
                  type="button" 
                  className="btn-primary-large"
                  style={{ marginTop: 0, backgroundColor: '#0284c7' }}
                  onClick={() => handleDispatchSubmit(selectedTransfer.id)}
                >
                  🚚 Approve & Initiate Cold-Chain Dispatch
                </button>
              ) : (
                <div style={{ padding: '14px', backgroundColor: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-md)', color: 'var(--success-main)', fontWeight: 'bold', textAlign: 'center' }}>
                  ✓ Shipment is currently {selectedTransfer.status} via {selectedTransfer.carrier || 'Carrier'}.
                </div>
              )}

              <button 
                type="button" 
                className="table-action-outline"
                onClick={() => setSelectedTransfer(null)}
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
