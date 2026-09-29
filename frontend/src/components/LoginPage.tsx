import React, { useState } from 'react';
import { Activity, ArrowRight } from 'lucide-react';
import type { HRUser } from '../types';

interface LoginPageProps {
  onLogin: (user: HRUser) => void;
  isLoading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isLoading = false }) => {
  const [email, setEmail] = useState('elena.vance@company.com');
  const [password, setPassword] = useState('Password123!');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your work email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const authenticatedUser: HRUser = {
        id: 101,
        name: 'Elena Vance',
        email: email.trim(),
        role: 'HR_MANAGER',
        title: 'Head of People & Total Rewards',
        organization: 'Acme Global Technologies',
        permissions: ['VIEW_SALARIES', 'REVISE_SALARY', 'GENERATE_REPORTS', 'AUDIT_ACCESS'],
      };
      setIsSubmitting(false);
      onLogin(authenticatedUser);
    }, 200);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-simple">
        
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div className="login-logo-badge">
            <Activity size={24} color="#713f12" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#18181b', margin: '8px 0 4px 0', letterSpacing: '-0.02em' }}>
            Comp<span style={{ color: '#ca8a04' }}>Pulse</span>
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#71717a', margin: 0 }}>
            Sign in to access your compensation dashboard
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3f3f46', marginBottom: '6px' }}>
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#3f3f46', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '11px',
              fontSize: '0.92rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '6px',
            }}
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>

          <p style={{
            margin: '6px 0 0 0',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#71717a'
          }}>
            Demo credentials pre-filled for <strong style={{ color: '#854d0e' }}>Elena Vance (HR Manager)</strong>
          </p>
        </form>

      </div>
    </div>
  );
};
