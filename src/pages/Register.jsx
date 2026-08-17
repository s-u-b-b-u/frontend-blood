import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import AuthHero from '../components/AuthHero';
import InputField from '../components/InputField';

export default function Register() {
  const navigate = useNavigate();

  // Wizard Step State (1 or 2)
  const [step, setStep] = useState(1);

  // Form & Profile States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'DONOR',
  });

  const [profile, setProfile] = useState({});
  const [bloodGroups, setBloodGroups] = useState([]);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch Blood Groups on Mount for Donor Profile
  useEffect(() => {
    api.getBloodGroups()
      .then(data => setBloodGroups(data.items || data || []))
      .catch(err => console.error('Failed to load blood groups', err));
  }, []);

  // Set Profile Defaults when Role Changes
  useEffect(() => {
    if (formData.role === 'HOSPITAL') {
      setProfile({ name: '', license_number: '', phone: '', beds_count: 50, address: '', has_icu: false });
    } else if (formData.role === 'BLOOD_BANK') {
      setProfile({ name: '', license_number: '', phone: '', storage_capacity_liters: 1000, address: '', operating_hours: '24/7' });
    } else {
      setProfile({ full_name: '', phone: '', date_of_birth: '', gender: 'MALE', blood_group_id: '', address: '' });
    }
    setTouched({});
  }, [formData.role]);

  // Helper to calculate exact age in years from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const donorAge = calculateAge(profile.date_of_birth);
  const isDonorAgeValid = Boolean(profile.date_of_birth) && donorAge >= 18;

  const getDobError = () => {
    if (!profile.date_of_birth) return 'Date of birth is required';
    if (donorAge < 18) return `Must be at least 18 years old (Current age: ${donorAge})`;
    return '';
  };

  // Real-Time Keystroke Validation Rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email.trim());
  const isPasswordValid = formData.password.length >= 6;
  const isStep1Valid = isEmailValid && isPasswordValid && Boolean(formData.role);

  // Profile Validations
  const isDonorValid = profile.full_name?.trim().length >= 2 &&
                       profile.phone?.trim().length >= 8 &&
                       isDonorAgeValid &&
                       Boolean(profile.blood_group_id) &&
                       profile.address?.trim().length >= 3;

  const isHospitalValid = profile.name?.trim().length >= 2 &&
                          profile.license_number?.trim().length >= 2 &&
                          profile.phone?.trim().length >= 8 &&
                          Number(profile.beds_count) > 0 &&
                          profile.address?.trim().length >= 3;

  const isBloodBankValid = profile.name?.trim().length >= 2 &&
                           profile.license_number?.trim().length >= 2 &&
                           profile.phone?.trim().length >= 8 &&
                           Number(profile.storage_capacity_liters) > 0 &&
                           profile.address?.trim().length >= 3;

  const isStep2Valid = formData.role === 'DONOR' ? isDonorValid :
                       formData.role === 'HOSPITAL' ? isHospitalValid :
                       isBloodBankValid;

  // Instant Typing Handlers (Sets touched = true immediately on first keystroke)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (error) setError('');
  };

  const handleProfileChange = (e) => {
    const name = e.target.name;
    let val = e.target.value;
    if (e.target.type === 'checkbox') val = e.target.checked;
    else if (e.target.type === 'number') val = val === '' ? '' : Number(val);

    setProfile(prev => ({ ...prev, [name]: val }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (error) setError('');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isStep2Valid) return;

    setLoading(true);
    setError('');

    const payload = { ...formData, profile };

    try {
      await api.register(payload);
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Reusable Left Hero Panel */}
      <AuthHero />

      {/* Right Form Container */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Join BloodLink Network</h2>
          </div>

          {/* Compact Progress Bar */}
          <div className="progress-bar-wrapper">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
            <div className="progress-bar-labels">
              <span style={{ color: step >= 1 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>Step 1: Credentials</span>
              <span style={{ color: step === 2 ? 'var(--brand-primary)' : 'var(--text-muted)' }}>Step 2: Profile Details</span>
            </div>
          </div>

          {error && (
            <div className="witty-banner" style={{ background: 'var(--state-error-bg)', borderColor: 'var(--state-error-border)', color: 'var(--state-error)', marginBottom: '12px' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* STEP 1: CREDENTIALS & ROLE SELECTION */}
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <label className="input-label" style={{ marginBottom: '6px' }}>
                Account Role <span style={{ color: 'var(--brand-primary)' }}>*</span>
              </label>
              <div className="role-selector-grid">
                <button
                  type="button"
                  className={`role-pill-btn ${formData.role === 'DONOR' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'DONOR' })}
                >
                  <span className="role-pill-icon">🩸</span>
                  <span>Donor</span>
                </button>
                <button
                  type="button"
                  className={`role-pill-btn ${formData.role === 'HOSPITAL' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'HOSPITAL' })}
                >
                  <span className="role-pill-icon">🏥</span>
                  <span>Hospital</span>
                </button>
                <button
                  type="button"
                  className={`role-pill-btn ${formData.role === 'BLOOD_BANK' ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'BLOOD_BANK' })}
                >
                  <span className="role-pill-icon">🏦</span>
                  <span>Blood Bank</span>
                </button>
              </div>

              <InputField
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="e.g. user@domain.com"
                required
                touched={touched.email}
                isValid={isEmailValid}
                error={touched.email && !isEmailValid ? 'Please enter a valid email address' : ''}
              />

              <InputField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Minimum 6 characters"
                required
                touched={touched.password}
                isValid={isPasswordValid}
                error={touched.password && !isPasswordValid ? 'Password must be at least 6 characters' : ''}
              />

              <button
                type="submit"
                className="btn-primary-large"
                disabled={!isStep1Valid}
                style={{ marginTop: '8px' }}
              >
                Next Step ➔
              </button>
            </form>
          )}

          {/* STEP 2: DYNAMIC ROLE PROFILE DETAILS */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              {formData.role === 'DONOR' && (
                <>
                  <InputField
                    label="Full Name"
                    name="full_name"
                    value={profile.full_name || ''}
                    onChange={handleProfileChange}
                    placeholder="e.g. John Doe"
                    required
                    touched={touched.full_name}
                    isValid={profile.full_name?.trim().length >= 2}
                    error={touched.full_name && profile.full_name?.trim().length < 2 ? 'Name required' : ''}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="Phone Number"
                      type="text"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleProfileChange}
                      placeholder="+1234567890"
                      required
                      touched={touched.phone}
                      isValid={profile.phone?.trim().length >= 8}
                      error={touched.phone && profile.phone?.trim().length < 8 ? 'Valid phone required' : ''}
                    />

                    {/* Donor Age Live Validation */}
                    <InputField
                      label="Date of Birth"
                      type="date"
                      name="date_of_birth"
                      value={profile.date_of_birth || ''}
                      onChange={handleProfileChange}
                      required
                      touched={touched.date_of_birth}
                      isValid={isDonorAgeValid}
                      error={touched.date_of_birth ? getDobError() : ''}
                      helpText={isDonorAgeValid ? `Age: ${donorAge} (Eligible)` : ''}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="Gender"
                      type="select"
                      name="gender"
                      value={profile.gender || 'MALE'}
                      onChange={handleProfileChange}
                      required
                      options={[
                        { value: 'MALE', label: 'Male' },
                        { value: 'FEMALE', label: 'Female' },
                        { value: 'OTHER', label: 'Other' }
                      ]}
                    />

                    <InputField
                      label="Blood Group"
                      type="select"
                      name="blood_group_id"
                      value={profile.blood_group_id || ''}
                      onChange={handleProfileChange}
                      required
                      touched={touched.blood_group_id}
                      isValid={Boolean(profile.blood_group_id)}
                      error={touched.blood_group_id && !profile.blood_group_id ? 'Select group' : ''}
                      options={bloodGroups.map(bg => ({ value: bg.id, label: `${bg.name} (${bg.code})` }))}
                    />
                  </div>

                  <InputField
                    label="Address"
                    name="address"
                    value={profile.address || ''}
                    onChange={handleProfileChange}
                    placeholder="City, State"
                    required
                    touched={touched.address}
                    isValid={profile.address?.trim().length >= 3}
                    error={touched.address && profile.address?.trim().length < 3 ? 'Address required' : ''}
                  />
                </>
              )}

              {formData.role === 'HOSPITAL' && (
                <>
                  <InputField
                    label="Hospital Name"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleProfileChange}
                    placeholder="e.g. St. Jude General Hospital"
                    required
                    touched={touched.name}
                    isValid={profile.name?.trim().length >= 2}
                    error={touched.name && profile.name?.trim().length < 2 ? 'Hospital name required' : ''}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="License Number"
                      name="license_number"
                      value={profile.license_number || ''}
                      onChange={handleProfileChange}
                      placeholder="HOSP-12345"
                      required
                      touched={touched.license_number}
                      isValid={profile.license_number?.trim().length >= 2}
                      error={touched.license_number && profile.license_number?.trim().length < 2 ? 'License required' : ''}
                    />

                    <InputField
                      label="Beds Count"
                      type="number"
                      name="beds_count"
                      value={profile.beds_count || ''}
                      onChange={handleProfileChange}
                      min="1"
                      required
                      touched={touched.beds_count}
                      isValid={Number(profile.beds_count) > 0}
                      error={touched.beds_count && Number(profile.beds_count) <= 0 ? 'Beds > 0' : ''}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="Phone Number"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleProfileChange}
                      placeholder="+1234567890"
                      required
                      touched={touched.phone}
                      isValid={profile.phone?.trim().length >= 8}
                      error={touched.phone && profile.phone?.trim().length < 8 ? 'Valid phone required' : ''}
                    />

                    <div className="input-group" style={{ justifyContent: 'center' }}>
                      <label className="input-label">ICU Facility</label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginTop: '4px', fontSize: '0.85rem' }}>
                        <input
                          type="checkbox"
                          name="has_icu"
                          checked={profile.has_icu || false}
                          onChange={handleProfileChange}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
                        />
                        <span>Has ICU Ward</span>
                      </label>
                    </div>
                  </div>

                  <InputField
                    label="Hospital Address"
                    name="address"
                    value={profile.address || ''}
                    onChange={handleProfileChange}
                    placeholder="456 Healthcare Ave, City"
                    required
                    touched={touched.address}
                    isValid={profile.address?.trim().length >= 3}
                    error={touched.address && profile.address?.trim().length < 3 ? 'Address required' : ''}
                  />
                </>
              )}

              {formData.role === 'BLOOD_BANK' && (
                <>
                  <InputField
                    label="Blood Bank Name"
                    name="name"
                    value={profile.name || ''}
                    onChange={handleProfileChange}
                    placeholder="e.g. Central Red Cross Blood Bank"
                    required
                    touched={touched.name}
                    isValid={profile.name?.trim().length >= 2}
                    error={touched.name && profile.name?.trim().length < 2 ? 'Name required' : ''}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="License Number"
                      name="license_number"
                      value={profile.license_number || ''}
                      onChange={handleProfileChange}
                      placeholder="BB-98765"
                      required
                      touched={touched.license_number}
                      isValid={profile.license_number?.trim().length >= 2}
                      error={touched.license_number && profile.license_number?.trim().length < 2 ? 'License required' : ''}
                    />

                    <InputField
                      label="Capacity (Liters)"
                      type="number"
                      name="storage_capacity_liters"
                      value={profile.storage_capacity_liters || ''}
                      onChange={handleProfileChange}
                      min="1"
                      required
                      touched={touched.storage_capacity_liters}
                      isValid={Number(profile.storage_capacity_liters) > 0}
                      error={touched.storage_capacity_liters && Number(profile.storage_capacity_liters) <= 0 ? 'Capacity > 0' : ''}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <InputField
                      label="Phone Number"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleProfileChange}
                      placeholder="+1555666777"
                      required
                      touched={touched.phone}
                      isValid={profile.phone?.trim().length >= 8}
                      error={touched.phone && profile.phone?.trim().length < 8 ? 'Valid phone required' : ''}
                    />

                    <InputField
                      label="Operating Hours"
                      name="operating_hours"
                      value={profile.operating_hours || '24/7'}
                      onChange={handleProfileChange}
                      placeholder="e.g. 24/7"
                      required
                    />
                  </div>

                  <InputField
                    label="Facility Address"
                    name="address"
                    value={profile.address || ''}
                    onChange={handleProfileChange}
                    placeholder="789 Donation Blvd, City"
                    required
                    touched={touched.address}
                    isValid={profile.address?.trim().length >= 3}
                    error={touched.address && profile.address?.trim().length < 3 ? 'Address required' : ''}
                  />
                </>
              )}

              {/* Step 2 Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                  style={{ padding: '9px 16px' }}
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="btn-primary-large"
                  disabled={loading || !isStep2Valid}
                  style={{ flex: 1, marginTop: 0 }}
                >
                  {loading ? 'Registering...' : 'Complete Registration ➔'}
                </button>
              </div>
            </form>
          )}

          <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: '700', textDecoration: 'none' }}>
              Sign In Here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
