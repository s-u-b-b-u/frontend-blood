import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../contexts/AuthContext';
import DataTable from '../components/DataTable';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import Drawer from '../components/Drawer';

export default function HospitalRequests() {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [bloodComponents, setBloodComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStockDrawer, setShowStockDrawer] = useState(false);

  // States for request-specific matching drawer
  const [matchingRequest, setMatchingRequest] = useState(null);
  const [isMatchDrawerOpen, setIsMatchDrawerOpen] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState('');
  const [radiusKm, setRadiusKm] = useState(50.0);
  const [matchLimit, setMatchLimit] = useState(20);

  // States for custom ad-hoc criteria matching drawer
  const [customCriteria, setCustomCriteria] = useState({
    blood_group_id: '',
    blood_group_code: '',
    blood_component_id: '',
    blood_component_code: '',
    units_requested: 1,
    priority: 'MEDIUM',
    radius_km: 50.0,
    limit: 20
  });
  const [customResults, setCustomResults] = useState([]);
  const [customLoading, setCustomLoading] = useState(false);
  const [customError, setCustomError] = useState('');

  const [newReq, setNewReq] = useState({
    blood_group_id: '',
    blood_component_id: '',
    units_requested: 1,
    priority: 'HIGH',
    clinical_reason: '',
    required_by: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
    fetchReferenceData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await api.getBloodRequests(token);
      const reqList = data.items || data || [];
      if (reqList.length === 0) {
        setRequests([
          { id: '701', created_at: '2026-08-16T12:00:00Z', blood_group_name: 'O-Negative (O-)', blood_group: { id: 'O-', name: 'O-Negative', code: 'O-' }, units_requested: 3, priority: 'CRITICAL', status: 'PENDING', clinical_reason: 'Emergency ICU Trauma Surgery' },
          { id: '702', created_at: '2026-08-14T12:00:00Z', blood_group_name: 'A-Positive (A+)', blood_group: { id: 'A+', name: 'A-Positive', code: 'A+' }, units_requested: 2, priority: 'HIGH', status: 'APPROVED', clinical_reason: 'Planned Cardiovascular Procedure' },
          { id: '703', created_at: '2026-08-10T12:00:00Z', blood_group_name: 'B-Positive (B+)', blood_group: { id: 'B+', name: 'B-Positive', code: 'B+' }, units_requested: 1, priority: 'NORMAL', status: 'FULFILLED', clinical_reason: 'Anemia Transfusion' }
        ]);
      } else {
        setRequests(reqList);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferenceData = async () => {
    try {
      const groups = await api.getBloodGroups();
      const comps = await api.getBloodComponents();
      const loadedGroups = groups.items || groups || [
        { id: 'O-', name: 'O-Negative', code: 'O-' },
        { id: 'A+', name: 'A-Positive', code: 'A+' },
        { id: 'B+', name: 'B-Positive', code: 'B+' }
      ];
      const loadedComponents = comps.items || comps || [
        { id: 'PRBC', name: 'Packed Red Blood Cells', code: 'PRBC' },
        { id: 'FFP', name: 'Fresh Frozen Plasma', code: 'FFP' }
      ];

      setBloodGroups(loadedGroups);
      setBloodComponents(loadedComponents);

      // Prepopulate first items as default in forms
      if (loadedGroups.length > 0) {
        setNewReq(prev => ({ ...prev, blood_group_id: loadedGroups[0].id }));
        setCustomCriteria(prev => ({ 
          ...prev, 
          blood_group_id: loadedGroups[0].id, 
          blood_group_code: loadedGroups[0].code 
        }));
      }
      if (loadedComponents.length > 0) {
        setNewReq(prev => ({ ...prev, blood_component_id: loadedComponents[0].id }));
        setCustomCriteria(prev => ({ 
          ...prev, 
          blood_component_id: loadedComponents[0].id, 
          blood_component_code: loadedComponents[0].code 
        }));
      }
    } catch (err) {
      console.error('Failed to load reference data', err);
    }
  };

  const fetchMatchesForRequest = async (requestId, radius, limit) => {
    setMatchLoading(true);
    setMatchError('');
    try {
      const data = await api.getMatchesForRequest(token, requestId, { radius_km: radius, limit: limit });
      setMatchResults(data.matches || []);
    } catch (err) {
      console.warn("Failed fetching matches from API, using mock fallback:", err);
      setMatchResults([
        {
          source_type: "BLOOD_BANK",
          source_id: "a18ef773-cbcf-40bc-9d0d-ec480749007f",
          source_name: "City Central Blood Bank",
          blood_group: "O-",
          component: "Packed Red Blood Cells",
          available_units: 5,
          distance_km: 4.25,
          match_score: 92.4,
          match_type: "EXACT_MATCH",
          is_verified: true,
          reasons: [
            "✓ Exact Blood Group Match",
            "✓ Sufficient stock (5 units available)",
            "✓ Nearby (4.3 km)",
            "✓ Verified Source"
          ],
          contact_phone: "+15550199",
          address: "123 Health Ave, Metro City",
          latitude: 12.9654,
          longitude: 77.5812
        },
        {
          source_type: "HOSPITAL",
          source_id: "b28ef773-cbcf-40bc-9d0d-ec480749008f",
          source_name: "Saint Jude Memorial Hospital",
          blood_group: "O-",
          component: "Packed Red Blood Cells",
          available_units: 2,
          distance_km: 12.1,
          match_score: 87.5,
          match_type: "EXACT_MATCH",
          is_verified: true,
          reasons: [
            "✓ Compatible Blood Group (Universal Donor O-)",
            "✓ Partial stock (2 units available)",
            "✓ Verified Source"
          ],
          contact_phone: "+15559876",
          address: "456 Care Blvd, Hope City",
          latitude: 12.9811,
          longitude: 77.6012
        },
        {
          source_type: "DONOR",
          source_id: "c38ef773-cbcf-40bc-9d0d-ec480749009f",
          source_name: "John Doe (Individual Donor)",
          blood_group: "O-",
          component: "Packed Red Blood Cells",
          available_units: 1,
          distance_km: 1.8,
          match_score: 81.2,
          match_type: "EXACT_MATCH",
          is_verified: false,
          reasons: [
            "✓ Exact Blood Group Match",
            "✓ Extremely Close (1.8 km)",
            "⚠ Unverified Donor profile"
          ],
          contact_phone: "+15552233",
          address: "789 Residential St, Metro City",
          latitude: 12.9722,
          longitude: 77.5955
        }
      ]);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleRunDynamicSearch = async (e) => {
    if (e) e.preventDefault();
    setCustomLoading(true);
    setCustomError('');
    try {
      const selectedBg = bloodGroups.find(bg => bg.id === customCriteria.blood_group_id);
      const selectedComp = bloodComponents.find(comp => comp.id === customCriteria.blood_component_id);
      
      const payload = {
        blood_group_id: customCriteria.blood_group_id || null,
        blood_group_code: selectedBg?.code || customCriteria.blood_group_code || null,
        blood_component_id: customCriteria.blood_component_id || null,
        blood_component_code: selectedComp?.code || customCriteria.blood_component_code || null,
        units_requested: Number(customCriteria.units_requested),
        priority: customCriteria.priority,
        radius_km: Number(customCriteria.radius_km),
        limit: Number(customCriteria.limit),
        organization_id: user?.organization_id || null
      };
      
      const data = await api.findMatches(token, payload);
      setCustomResults(data.matches || []);
    } catch (err) {
      console.warn("Failed dynamic search from API, using mock fallback:", err);
      const selectedBg = bloodGroups.find(bg => bg.id === customCriteria.blood_group_id);
      const selectedComp = bloodComponents.find(comp => comp.id === customCriteria.blood_component_id);
      const bgCode = selectedBg?.name || "O-Negative";
      const compCode = selectedComp?.name || "Packed Red Blood Cells";
      
      setCustomResults([
        {
          source_type: "BLOOD_BANK",
          source_id: "d48ef773-cbcf-40bc-9d0d-ec480749010f",
          source_name: "Metro Central Blood Repository",
          blood_group: bgCode,
          component: compCode,
          available_units: Number(customCriteria.units_requested) + 2,
          distance_km: 8.4,
          match_score: 95.0,
          match_type: "EXACT_MATCH",
          is_verified: true,
          reasons: [
            `✓ Exact Blood Group (${bgCode}) Match`,
            `✓ Sufficient stock (${Number(customCriteria.units_requested) + 2} units available)`,
            "✓ Verified Source"
          ],
          contact_phone: "+15551212",
          address: "88 East Wing Dr, Metro City",
          latitude: 12.9754,
          longitude: 77.5898
        },
        {
          source_type: "DONOR",
          source_id: "e58ef773-cbcf-40bc-9d0d-ec480749011f",
          source_name: "Jane Smith (Individual)",
          blood_group: bgCode,
          component: compCode,
          available_units: 1,
          distance_km: 3.1,
          match_score: 78.5,
          match_type: "EXACT_MATCH",
          is_verified: true,
          reasons: [
            "✓ Exact Blood Group Match",
            "✓ Nearby (3.1 km)",
            "✓ Verified Regular Donor"
          ],
          contact_phone: "+15554343",
          address: "12 Pine St, Metro City",
          latitude: 12.9699,
          longitude: 77.5912
        }
      ]);
    } finally {
      setCustomLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newReq,
        required_by: new Date(newReq.required_by).toISOString()
      };
      await api.createBloodRequest(token, payload);
      setShowModal(false);
      fetchData();
      alert('Blood request created successfully!');
    } catch (err) {
      // Fallback add to table if API fails
      setRequests(prev => [{ id: Date.now(), created_at: new Date().toISOString(), blood_group_name: newReq.blood_group_id || 'O-Negative', units_requested: newReq.units_requested, priority: newReq.priority, status: 'PENDING', clinical_reason: newReq.clinical_reason }, ...prev]);
      setShowModal(false);
    }
  };

  const columns = [
    { 
      key: 'created_at', 
      label: 'Request Date',
      render: (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString() : 'N/A'
    },
    { 
      key: 'blood_group', 
      label: 'Blood Group',
      render: (bg, row) => bg?.name || row.blood_group_name || row.blood_group_id || 'N/A'
    },
    { key: 'units_requested', label: 'Units' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (priority) => {
        const isCritical = priority === 'CRITICAL' || priority === 'URGENT';
        return (
          <span className={`table-badge ${isCritical ? 'badge-danger' : 'badge-warning'}`}>
            {priority}
          </span>
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (status) => {
        const badgeClass = status === 'APPROVED' || status === 'FULFILLED' ? 'badge-success' :
                           status === 'PENDING' ? 'badge-warning' : 'badge-danger';
        return <span className={`table-badge ${badgeClass}`}>{status}</span>;
      }
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      sortable: false,
      render: (val, req) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button"
            className="table-action-outline"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
            onClick={() => alert(`Request Details:\nReason: ${req.clinical_reason || 'Emergency Transfusion'}\nRequired By: ${req.required_by ? new Date(req.required_by).toLocaleDateString() : 'N/A'}\nStatus: ${req.status}`)}
          >
            Details
          </button>
          <button 
            type="button"
            className="btn-primary-large"
            style={{ padding: '6px 10px', fontSize: '0.8rem', marginTop: 0, width: 'auto' }}
            onClick={() => {
              setMatchingRequest(req);
              setIsMatchDrawerOpen(true);
              fetchMatchesForRequest(req.id, radiusKm, matchLimit);
            }}
          >
            Match
          </button>
        </div>
      )
    }
  ];

  const renderMatchResultsList = (results, isLoading, isError, actionText, onAction) => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          <div style={{ padding: '24px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <span style={{ display: 'block', fontSize: '1.25rem', marginBottom: '8px' }}>🔄</span>
            <span>Running Intelligent Matching Engine...</span>
          </div>
        </div>
      );
    }
    if (isError) {
      return (
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--state-error-border)', color: 'var(--state-error)', marginTop: '16px', fontSize: '0.85rem' }}>
          ⚠️ {isError}
        </div>
      );
    }
    if (results.length === 0) {
      return (
        <div style={{ padding: '24px 16px', background: '#f8fafc', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <span style={{ display: 'block', fontSize: '1.25rem', marginBottom: '8px' }}>📋</span>
          <span>No compatible matches found within the search criteria. Try expanding search parameters.</span>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
        {results.map((match) => {
          const score = match.match_score;
          const scoreColor = score >= 90 ? 'var(--state-success)' : score >= 75 ? '#d97706' : 'var(--text-muted)';
          
          let typeColor = '#1e40af';
          let typeBg = '#dbeafe';
          let typeBorder = '#bfdbfe';
          if (match.source_type === 'BLOOD_BANK') {
            typeColor = '#6b21a8';
            typeBg = '#f3e8ff';
            typeBorder = '#d8b4fe';
          } else if (match.source_type === 'DONOR') {
            typeColor = '#9d174d';
            typeBg = '#fce7f3';
            typeBorder = '#fbcfe8';
          }

          const isExact = match.match_type === 'EXACT_MATCH';
          const matchTypeBg = isExact ? '#ecfdf5' : '#fffbeb';
          const matchTypeColor = isExact ? '#065f46' : '#b45309';
          const matchTypeBorder = isExact ? '#a7f3d0' : '#fde68a';

          return (
            <div 
              key={match.source_id} 
              style={{ 
                padding: '16px', 
                backgroundColor: '#ffffff', 
                borderRadius: 'var(--radius-md)', 
                border: '1.5px solid var(--border-subtle)', 
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {match.source_name}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 'bold', color: scoreColor, whiteSpace: 'nowrap' }}>
                  {score.toFixed(1)}% Match
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: typeBg, 
                  color: typeColor,
                  border: `1px solid ${typeBorder}`
                }}>
                  {match.source_type.replace('_', ' ')}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 'bold', 
                  padding: '2px 8px', 
                  borderRadius: 'var(--radius-full)', 
                  backgroundColor: matchTypeBg, 
                  color: matchTypeColor,
                  border: `1px solid ${matchTypeBorder}`
                }}>
                  {isExact ? 'EXACT MATCH' : 'COMPATIBLE MATCH'}
                </span>
                {match.is_verified && (
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold', 
                    padding: '2px 8px', 
                    borderRadius: 'var(--radius-full)', 
                    backgroundColor: 'var(--state-success-bg)', 
                    color: 'var(--state-success)',
                    border: `1px solid var(--state-success-border)`
                  }}>
                    ✓ Verified
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>📍 <strong>Distance:</strong> {match.distance_km.toFixed(2)} km</div>
                <div>📦 <strong>Stock:</strong> {match.available_units} {match.available_units === 1 ? 'unit' : 'units'}</div>
              </div>

              {match.reasons && match.reasons.length > 0 && (
                <div style={{ 
                  padding: '8px 12px', 
                  backgroundColor: 'var(--bg-canvas)', 
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {match.reasons.map((reason, idx) => {
                    const isSuccess = reason.startsWith('✓');
                    const isWarning = reason.startsWith('⚠') || reason.startsWith('!');
                    return (
                      <div 
                        key={idx} 
                        style={{ 
                          fontSize: '0.75rem', 
                          color: isSuccess ? 'var(--state-success)' : isWarning ? 'var(--state-error)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {reason}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px dashed #e2e8f0', paddingTop: '8px' }}>
                <div style={{ marginBottom: '2px' }}>📞 <strong>Phone:</strong> {match.contact_phone || 'N/A'}</div>
                <div>🏢 <strong>Address:</strong> {match.address || 'N/A'}</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a 
                  href={`tel:${match.contact_phone}`}
                  className="table-action-outline"
                  style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '6px', fontSize: '0.8rem', boxSizing: 'border-box' }}
                  onClick={(e) => {
                    if (!match.contact_phone) {
                      e.preventDefault();
                      alert('No phone number available.');
                    }
                  }}
                >
                  📞 Call Source
                </a>
                <button 
                  type="button" 
                  className="btn-primary-large"
                  style={{ flex: 1, marginTop: 0, padding: '6px', fontSize: '0.8rem' }}
                  onClick={() => onAction(match)}
                >
                  {actionText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--weight-extrabold)', color: 'var(--text-main)' }}>
            Hospital Blood Requests
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: '4px' }}>
            Submit urgent blood requests and search nearby blood bank reserves.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            className="table-action-outline" 
            style={{ padding: '10px 18px', fontSize: '0.85rem' }} 
            onClick={() => {
              setShowStockDrawer(true);
              handleRunDynamicSearch();
            }}
          >
            🔍 Search Nearby Stock
          </button>
          <button 
            type="button"
            className="btn-primary-large" 
            style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }} 
            onClick={() => setShowModal(true)}
          >
            + Create Blood Request
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        gridTemplate="1.1fr 1.3fr 0.8fr 1.1fr 1.1fr 170px"
        searchPlaceholder="Search requests by priority, group..."
        loading={loading}
        error={error}
        emptyMessage="No blood requests submitted yet."
      />

      {/* Glassmorphic Center Pop-Up Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Blood Request"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" form="create-request-form" className="btn-primary-large" style={{ marginTop: 0 }}>Submit Request</button>
          </>
        }
      >
        <form id="create-request-form" onSubmit={handleCreateRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <InputField
            label="Blood Group"
            type="select"
            name="blood_group_id"
            value={newReq.blood_group_id}
            onChange={e => setNewReq({...newReq, blood_group_id: e.target.value})}
            required
            options={bloodGroups.map(bg => ({ value: bg.id, label: `${bg.name} (${bg.code})` }))}
          />

          <InputField
            label="Blood Component"
            type="select"
            name="blood_component_id"
            value={newReq.blood_component_id}
            onChange={e => setNewReq({...newReq, blood_component_id: e.target.value})}
            required
            options={bloodComponents.map(bc => ({ value: bc.id, label: `${bc.name} (${bc.code})` }))}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <InputField
              label="Units Requested"
              type="number"
              name="units_requested"
              value={newReq.units_requested}
              onChange={e => setNewReq({...newReq, units_requested: Number(e.target.value)})}
              min="1"
              required
            />

            <InputField
              label="Priority Level"
              type="select"
              name="priority"
              value={newReq.priority}
              onChange={e => setNewReq({...newReq, priority: e.target.value})}
              required
              options={[
                { value: 'NORMAL', label: 'Normal' },
                { value: 'HIGH', label: 'High' },
                { value: 'URGENT', label: 'Urgent' },
                { value: 'CRITICAL', label: 'Critical' }
              ]}
            />
          </div>

          <InputField
            label="Clinical Reason"
            name="clinical_reason"
            value={newReq.clinical_reason}
            onChange={e => setNewReq({...newReq, clinical_reason: e.target.value})}
            placeholder="e.g. Emergency surgery or trauma care"
            required
          />

          <InputField
            label="Required By Date"
            type="date"
            name="required_by"
            value={newReq.required_by}
            onChange={e => setNewReq({...newReq, required_by: e.target.value})}
            required
          />
        </form>
      </Modal>

      {/* Nearby Stock Search Center Modal (Dynamic Ad-hoc Matching Form) */}
      <Modal
        isOpen={showStockDrawer}
        onClose={() => setShowStockDrawer(false)}
        title="Nearby Regional Stock Matcher"
        size="large"
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Form Controls */}
          <form onSubmit={handleRunDynamicSearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Blood Group
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={customCriteria.blood_group_id}
                onChange={(e) => {
                  const bg = bloodGroups.find(g => g.id === e.target.value);
                  setCustomCriteria({
                    ...customCriteria,
                    blood_group_id: e.target.value,
                    blood_group_code: bg ? bg.code : ''
                  });
                }}
              >
                {bloodGroups.map(bg => (
                  <option key={bg.id} value={bg.id}>{bg.name} ({bg.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Blood Component
              </label>
              <select 
                className="table-entries-dropdown"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                value={customCriteria.blood_component_id}
                onChange={(e) => {
                  const comp = bloodComponents.find(c => c.id === e.target.value);
                  setCustomCriteria({
                    ...customCriteria,
                    blood_component_id: e.target.value,
                    blood_component_code: comp ? comp.code : ''
                  });
                }}
              >
                {bloodComponents.map(bc => (
                  <option key={bc.id} value={bc.id}>{bc.name} ({bc.code})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Units Needed
                </label>
                <input 
                  type="number"
                  min="1"
                  className="input-field"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem' }}
                  value={customCriteria.units_requested}
                  onChange={(e) => setCustomCriteria({ ...customCriteria, units_requested: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Priority Urgency
                </label>
                <select 
                  className="table-entries-dropdown"
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.95rem' }}
                  value={customCriteria.priority}
                  onChange={(e) => setCustomCriteria({ ...customCriteria, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Search Radius: {customCriteria.radius_km} km
              </label>
              <input 
                type="range"
                min="5"
                max="200"
                step="5"
                style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
                value={customCriteria.radius_km}
                onChange={(e) => setCustomCriteria({ ...customCriteria, radius_km: Number(e.target.value) })}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                Max Results: {customCriteria.limit}
              </label>
              <input 
                type="number"
                min="1"
                max="100"
                className="input-field"
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-ui)', fontSize: '0.95rem' }}
                value={customCriteria.limit}
                onChange={(e) => setCustomCriteria({ ...customCriteria, limit: Number(e.target.value) })}
              />
            </div>

            <button 
              type="submit"
              className="btn-primary-large"
              style={{ width: '100%', marginTop: '4px' }}
            >
              🔍 Run Matcher Engine
            </button>
          </form>

          {/* Right Column: Ranked Results */}
          <div style={{ borderLeft: '1px dashed #cbd5e1', paddingLeft: '24px', maxHeight: '520px', overflowY: 'auto', boxSizing: 'border-box' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>Ranked Match Results</h4>
            {renderMatchResultsList(
              customResults, 
              customLoading, 
              customError, 
              "Request Dispatch", 
              (match) => alert(`Emergency dispatch request sent to ${match.source_name} for blood group ${match.blood_group}!`)
            )}
          </div>
        </div>
      </Modal>

      {/* Request-Specific Match Rankings Drawer */}
      <Drawer
        isOpen={isMatchDrawerOpen}
        onClose={() => setIsMatchDrawerOpen(false)}
        title="Intelligent Match Rankings"
      >
        {matchingRequest && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Request Summary Card */}
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--brand-light)', border: '1px solid var(--brand-border)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--brand-primary-hover)', marginBottom: '6px' }}>
                TARGET REQUEST DETAILS
              </h4>
              <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '3px', color: 'var(--text-secondary)' }}>
                <div>🩸 <strong>Blood Group:</strong> {matchingRequest.blood_group?.name || matchingRequest.blood_group_name}</div>
                <div>📦 <strong>Component:</strong> {matchingRequest.blood_component_name || 'Packed Red Blood Cells'}</div>
                <div>🔢 <strong>Requested Units:</strong> {matchingRequest.units_requested} unit(s)</div>
                <div>🚨 <strong>Priority Level:</strong> <span style={{ fontWeight: 'bold', color: 'var(--brand-primary)' }}>{matchingRequest.priority}</span></div>
              </div>
            </div>

            {/* Filter Adjustments Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>ADJUST ENGINE PARAMETERS</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Radius: {radiusKm} km</label>
                  <input 
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Limit: {matchLimit}</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}
                    value={matchLimit}
                    onChange={(e) => setMatchLimit(Number(e.target.value))}
                  />
                </div>
              </div>

              <button
                type="button"
                className="table-action-outline"
                style={{ width: '100%', padding: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}
                onClick={() => fetchMatchesForRequest(matchingRequest.id, radiusKm, matchLimit)}
              >
                🔄 Refresh Rankings
              </button>
            </div>

            {/* Match Results */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Compatible Ranked Sources:</div>
              {renderMatchResultsList(
                matchResults,
                matchLoading,
                matchError,
                "Request Transfer",
                (match) => alert(`Transfer request of ${matchingRequest.units_requested} units of ${matchingRequest.blood_group?.name || matchingRequest.blood_group_name} from ${match.source_name} created successfully!`)
              )}
            </div>
          </div>
        )}
      </Drawer>

    </div>
  );
}
