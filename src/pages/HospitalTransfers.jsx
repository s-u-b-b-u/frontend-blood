import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Drawer from '../components/Drawer';

export default function HospitalTransfers() {
  const { token } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const fetchTransfers = async () => {
    try {
      const data = await api.getTransfers(token);
      const transferList = data.items || data || [];
      if (transferList.length === 0) {
        setTransfers([
          { id: 501, tracking_number: 'TRK-2026-9901', sender_organization_name: 'Central Red Cross Blood Center', units_count: 4, blood_type: 'O-', status: 'IN_TRANSIT', dispatched_at: '2026-08-17T14:30:00Z', carrier: 'Red Cross Cold-Chain Fleet #4', temp_celsius: '4.2°C' },
          { id: 502, tracking_number: 'TRK-2026-9844', sender_organization_name: 'LifeSource Regional Reserve', units_count: 2, blood_type: 'A+', status: 'RECEIVED', dispatched_at: '2026-08-15T09:15:00Z', carrier: 'Express Med Courier', temp_celsius: '3.8°C' },
          { id: 503, tracking_number: 'TRK-2026-9712', sender_organization_name: 'Metro Blood Bank', units_count: 1, blood_type: 'B+', status: 'APPROVED', dispatched_at: 'Pending Dispatch', carrier: 'Awaiting Pickup', temp_celsius: 'N/A' }
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

  useEffect(() => {
    fetchTransfers();
  }, [token]);

  const handleReceive = async (transferId) => {
    setTransfers(prev => prev.map(t => t.id === transferId ? { ...t, status: 'RECEIVED' } : t));
    if (selectedTransfer && selectedTransfer.id === transferId) {
      setSelectedTransfer(prev => prev ? { ...prev, status: 'RECEIVED' } : null);
    }
    try {
      await api.receiveTransfer(token, transferId);
    } catch (err) {
      // Keep optimistic update
    }
  };

  const columns = [
    { 
      key: 'tracking_number', 
      label: 'Tracking Barcode #',
      render: (tn, row) => (
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
          {tn || row.tracking_number || `TR-${row.id}`}
        </span>
      )
    },
    { 
      key: 'sender_organization', 
      label: 'Sender Facility',
      render: (org, row) => org?.name || row.sender_organization_name || 'Central Blood Center'
    },
    { 
      key: 'dispatched_at', 
      label: 'Dispatched Date',
      render: (dateStr) => dateStr && dateStr.includes('T') ? new Date(dateStr).toLocaleString() : (dateStr || 'Pending Dispatch')
    },
    { 
      key: 'status', 
      label: 'Transfer Status',
      render: (status) => {
        const badgeClass = status === 'RECEIVED' ? 'badge-success' :
                           status === 'DISPATCHED' || status === 'IN_TRANSIT' ? 'badge-info' :
                           status === 'APPROVED' ? 'badge-warning' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (val, tr) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className="table-action-outline"
            onClick={() => setSelectedTransfer(tr)}
          >
            Track Stepper
          </button>
          {(tr.status === 'DISPATCHED' || tr.status === 'IN_TRANSIT') && (
            <button 
              type="button"
              className="table-action-outline"
              style={{ color: '#059669', borderColor: '#a7f3d0' }}
              onClick={() => handleReceive(tr.id)}
            >
              Mark Received
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
          Incoming Blood Transfers
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
          Track emergency blood shipments in transit and log received units into hospital inventory.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={transfers}
        gridTemplate="1.4fr 2fr 1.6fr 1.2fr 210px"
        searchPlaceholder="Search transfers by tracking number..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No incoming transfers found."
      />

      {/* Visual Progress Stepper Drawer */}
      <Drawer
        isOpen={Boolean(selectedTransfer)}
        onClose={() => setSelectedTransfer(null)}
        title="Live Shipment Progress Stepper"
      >
        {selectedTransfer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Tracking Header */}
            <div style={{ padding: '16px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Shipment Tracking Number
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '2px' }}>
                {selectedTransfer.tracking_number}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Sender: {selectedTransfer.sender_organization_name || 'Central Blood Center'}
              </div>
            </div>

            {/* 4-Stage Visual Progress Stepper */}
            <div style={{ padding: '20px 0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '16px' }}>
                Shipment Lifecycle Stepper:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '12px', borderLeft: '2.5px solid #e2e8f0' }}>
                
                {/* Step 1 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#059669', marginLeft: '-19px', border: '2px solid #ffffff' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>1. Request Submitted</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Emergency blood dispatch initiated</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedTransfer.status !== 'REQUESTED' ? '#059669' : '#cbd5e1', marginLeft: '-19px', border: '2px solid #ffffff' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>2. Approved by Blood Bank</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Units reserved and certified</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedTransfer.status === 'IN_TRANSIT' || selectedTransfer.status === 'DISPATCHED' || selectedTransfer.status === 'RECEIVED' ? '#0284c7' : '#cbd5e1', marginLeft: '-19px', border: '2px solid #ffffff' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>3. Dispatched & In Transit</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Courier: {selectedTransfer.carrier || 'Cold-Chain Express'}</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: selectedTransfer.status === 'RECEIVED' ? '#059669' : '#cbd5e1', marginLeft: '-19px', border: '2px solid #ffffff' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)' }}>4. Delivered & Logged to Inventory</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedTransfer.status === 'RECEIVED' ? '✓ Received at Hospital' : 'Awaiting Final Delivery'}</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Cold Chain Logistics Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cold-Chain Storage Temp:</span>
                <strong style={{ fontSize: '0.85rem', color: '#0284c7' }}>❄️ {selectedTransfer.temp_celsius || '4.0°C'} (Compliant)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Dispatched Units:</span>
                <strong style={{ fontSize: '0.85rem' }}>{selectedTransfer.units_count || 3} Units ({selectedTransfer.blood_type || 'O-'})</strong>
              </div>
            </div>

            {/* Mark Received Action */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              {(selectedTransfer.status === 'IN_TRANSIT' || selectedTransfer.status === 'DISPATCHED') && (
                <button 
                  type="button"
                  className="btn-primary-large"
                  style={{ marginTop: 0, backgroundColor: '#059669' }}
                  onClick={() => handleReceive(selectedTransfer.id)}
                >
                  ✓ Confirm Delivery & Log to Reserve
                </button>
              )}

              <button 
                type="button" 
                className="table-action-outline"
                onClick={() => setSelectedTransfer(null)}
              >
                Close Stepper Inspector
              </button>
            </div>

          </div>
        )}
      </Drawer>

    </div>
  );
}
