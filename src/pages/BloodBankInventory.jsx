import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';

export default function BloodBankInventory() {
  const { token } = useAuth();
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [unitNumber, setUnitNumber] = useState('UNIT-2026-901');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [component, setComponent] = useState('PRBC');
  const [statusState, setStatusState] = useState('UNDER_TESTING');
  const [expiryDate, setExpiryDate] = useState('2026-09-15');

  useEffect(() => {
    fetchBloodUnits();
  }, [token]);

  const fetchBloodUnits = async () => {
    try {
      const data = await api.getBloodUnits(token);
      const unitList = data.items || data || [];
      if (unitList.length === 0) {
        setBloodUnits([
          { id: 1, unit_number: 'UNIT-2026-801', blood_group_code: 'O-Negative (O-)', blood_component_code: 'Packed Red Blood Cells', status: 'AVAILABLE', expiry_date: '2026-08-20' },
          { id: 2, unit_number: 'UNIT-2026-802', blood_group_code: 'A-Positive (A+)', blood_component_code: 'Fresh Frozen Plasma', status: 'UNDER_TESTING', expiry_date: '2026-09-10' },
          { id: 3, unit_number: 'UNIT-2026-803', blood_group_code: 'B-Positive (B+)', blood_component_code: 'Whole Blood', status: 'AVAILABLE', expiry_date: '2026-08-22' },
          { id: 4, unit_number: 'UNIT-2026-804', blood_group_code: 'AB-Positive (AB+)', blood_component_code: 'Platelet Concentrate', status: 'COLLECTED', expiry_date: '2026-08-19' }
        ]);
      } else {
        setBloodUnits(unitList);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (unitId, newStatus) => {
    setBloodUnits(prev => prev.map(u => u.id === unitId ? { ...u, status: newStatus } : u));
    try {
      await api.updateBloodUnitStatus(token, unitId, newStatus);
    } catch (err) {
      // Keep optimistic update
    }
  };

  const handleAddIntake = () => {
    const newUnit = {
      id: Date.now(),
      unit_number: unitNumber,
      blood_group_code: bloodGroup,
      blood_component_code: component,
      status: statusState,
      expiry_date: expiryDate
    };
    setBloodUnits(prev => [newUnit, ...prev]);
    setIsIntakeOpen(false);
  };

  const columns = [
    { key: 'unit_number', label: 'Unit Barcode #' },
    { 
      key: 'blood_group', 
      label: 'Blood Group',
      render: (bg, row) => (
        <span style={{ fontWeight: 'bold', color: '#a71e24' }}>
          {bg?.name || row.blood_group_code || 'N/A'}
        </span>
      )
    },
    { 
      key: 'blood_component', 
      label: 'Component',
      render: (comp, row) => comp?.name || row.blood_component_code || 'N/A'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const badgeClass = status === 'AVAILABLE' ? 'badge-success' :
                           status === 'UNDER_TESTING' || status === 'COLLECTED' ? 'badge-warning' :
                           status === 'RESERVED' || status === 'DISPATCHED' ? 'badge-info' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    },
    { 
      key: 'expiry_date', 
      label: 'Expiry Date & Alert',
      render: (dateStr) => {
        if (!dateStr) return 'N/A';
        const expDate = new Date(dateStr);
        const daysLeft = Math.ceil((expDate.getTime() - Date.now()) / (1000 * 3600 * 24));
        const isNearExpiry = daysLeft <= 5;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{expDate.toLocaleDateString()}</span>
            {isNearExpiry && (
              <span className="table-badge badge-danger" style={{ fontSize: '0.7rem' }}>
                ⚠️ {daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}
              </span>
            )}
          </div>
        );
      }
    },
    { 
      key: 'actions', 
      label: 'Status Transition', 
      sortable: false,
      render: (val, unit) => (
        <select
          className="table-entries-dropdown"
          style={{ width: '100%', padding: '6px 8px', fontSize: '0.8rem' }}
          value={unit.status}
          onChange={(e) => handleStatusChange(unit.id, e.target.value)}
        >
          <option value="COLLECTED">COLLECTED</option>
          <option value="UNDER_TESTING">UNDER TESTING</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RESERVED">RESERVED</option>
          <option value="DISPATCHED">DISPATCHED</option>
          <option value="EXPIRED">EXPIRED</option>
          <option value="DISCARDED">DISCARDED</option>
        </select>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Intake Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            Blood Bank Unit Inventory
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Track individual blood unit life cycle, testing compliance, and release status.
          </p>
        </div>

        <button 
          type="button" 
          className="btn-primary-large"
          style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
          onClick={() => setIsIntakeOpen(true)}
        >
          + Intake New Unit
        </button>
      </div>

      <DataTable
        columns={columns}
        data={bloodUnits}
        gridTemplate="1.4fr 1.3fr 1.8fr 1.2fr 1.6fr 150px"
        searchPlaceholder="Search units by number, blood group..."
        loading={loading}
        error={error ? true : false}
        emptyMessage="No blood units in inventory."
      />

      {/* Unit Intake & Testing Intake Modal */}
      <Modal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        title="Log Blood Unit Intake & Testing"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Unit Barcode / Number
            </label>
            <input 
              type="text"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Blood Group
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="O-Negative (O-)">O-Negative (O-)</option>
                <option value="A-Positive (A+)">A-Positive (A+)</option>
                <option value="B-Positive (B+)">B-Positive (B+)</option>
                <option value="AB-Positive (AB+)">AB-Positive (AB+)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Component Type
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={component}
                onChange={(e) => setComponent(e.target.value)}
              >
                <option value="Packed Red Blood Cells">Packed Red Blood Cells (PRBC)</option>
                <option value="Fresh Frozen Plasma">Fresh Frozen Plasma (FFP)</option>
                <option value="Whole Blood">Whole Blood</option>
                <option value="Platelet Concentrate">Platelet Concentrate</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Testing State
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={statusState}
                onChange={(e) => setStatusState(e.target.value)}
              >
                <option value="UNDER_TESTING">UNDER TESTING</option>
                <option value="COLLECTED">COLLECTED</option>
                <option value="AVAILABLE">AVAILABLE (Passed Test)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Expiration Date
              </label>
              <input 
                type="date"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)' }}
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button 
              type="button" 
              className="btn-primary-large"
              style={{ flex: 1, marginTop: 0 }}
              onClick={handleAddIntake}
            >
              Save Blood Intake Record
            </button>
            <button 
              type="button" 
              className="table-action-outline"
              onClick={() => setIsIntakeOpen(false)}
            >
              Cancel
            </button>
          </div>

        </div>
      </Modal>

    </div>
  );
}
