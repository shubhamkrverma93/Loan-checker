import React, { useState } from 'react';
import { User, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api, setStoredToken, setStoredUser } from '../services/api';

export default function AuthPage({ setActivePage }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let res;
      if (isRegister) {
        res = await api.register({ name, email, password });
        setSuccess('Registration successful! Redirecting...');
      } else {
        res = await api.login({ email, password });
        setSuccess('Login successful! Redirecting...');
      }

      setStoredToken(res.access_token);
      setStoredUser(res.user);
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => {
        setActivePage('dashboard');
      }, 700);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsRegister(false);
  };

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>
            {isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isRegister
              ? 'Register to track loan applications and analytics.'
              : 'Sign in to access your loan history and predictive models.'}
          </p>
        </div>

        {import.meta.env.DEV && (
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Quick Demo Login Presets:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                onClick={() => handleQuickDemo('admin@loanapproval.ai', 'admin123')}
              >
                <Shield size={13} style={{ color: 'var(--accent-primary)' }} /> Fill Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
                onClick={() => handleQuickDemo('rahul@example.com', 'user123')}
              >
                <User size={13} style={{ color: 'var(--info)' }} /> Fill Applicant
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              background: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'var(--success-bg)',
              color: 'var(--success)',
              border: '1px solid var(--success-border)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {isRegister ? (
            <span>
              Already registered?{' '}
              <a
                href="#login"
                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                onClick={(e) => { e.preventDefault(); setIsRegister(false); setError(''); }}
              >
                Sign In
              </a>
            </span>
          ) : (
            <span>
              Need an account?{' '}
              <a
                href="#register"
                style={{ color: 'var(--accent-primary)', fontWeight: 600 }}
                onClick={(e) => { e.preventDefault(); setIsRegister(true); setError(''); }}
              >
                Create Account
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
