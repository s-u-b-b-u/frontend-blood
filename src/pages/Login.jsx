import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthHero from '../components/AuthHero';
import InputField from '../components/InputField';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Real-time validation checks
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email.trim());
  const isPasswordValid = formData.password.length >= 6;

  const getEmailError = () => {
    if (!formData.email.trim()) return 'Email address is required';
    if (!isEmailValid) return 'Please enter a valid email address';
    return '';
  };

  const getPasswordError = () => {
    if (!formData.password) return 'Password is required';
    if (!isPasswordValid) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!isEmailValid || !isPasswordValid) return;

    setLoading(true);
    setError('');

    try {
      await login(formData.email.trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = isEmailValid && isPasswordValid;

  return (
    <div className="auth-container">
      {/* Reusable Left Panel Hero */}
      <AuthHero 
        title="Welcome Back to BloodLink"
        subtitle="Sign in to access your portal, manage inventory, or respond to urgent blood requests."
      />

      {/* Right Form Panel */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back to BloodLink</h2>
          </div>

          {error && (
            <div className="witty-banner" style={{ background: 'var(--state-error-bg)', borderColor: 'var(--state-error-border)', color: 'var(--state-error)', marginBottom: '16px' }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. user@bloodlink.org"
              required
              touched={touched.email}
              isValid={isEmailValid}
              error={getEmailError()}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              touched={touched.password}
              isValid={isPasswordValid}
              error={getPasswordError()}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand-primary)' }} />
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary-large"
              disabled={loading || (touched.email && !isFormValid)}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: '700', textDecoration: 'none' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
