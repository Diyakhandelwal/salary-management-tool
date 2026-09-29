import React from 'react';
import type { HRUser } from '../types';
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  ShieldCheck,
  Activity,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'employees' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'audit') => void;
  hrUser: HRUser | null;
  onOpenCreateEmployee: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hrUser,
  onOpenCreateEmployee,
  onLogout,
}) => {
  return (
    <header className="main-navbar" style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(234, 179, 8, 0.08)',
    }}>
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.35)',
            border: '1px solid #facc15',
            flexShrink: 0,
          }}>
            <Activity size={22} color="#713f12" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#18181b', lineHeight: 1.1 }}>
                Comp<span style={{ color: '#ca8a04' }}>Pulse</span>
              </span>
            </div>
            <p className="navbar-subtext" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Total Rewards & Salary Management
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-tabs" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-secondary' : ''}`}
            style={{
              background: activeTab === 'dashboard' ? '#fef9c3' : 'transparent',
              color: activeTab === 'dashboard' ? '#713f12' : 'var(--text-secondary)',
              borderColor: activeTab === 'dashboard' ? '#fde047' : 'transparent',
              fontWeight: activeTab === 'dashboard' ? 700 : 500,
            }}
          >
            <BarChart3 size={17} color={activeTab === 'dashboard' ? '#a16207' : undefined} />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`btn ${activeTab === 'employees' ? 'btn-secondary' : ''}`}
            style={{
              background: activeTab === 'employees' ? '#fef9c3' : 'transparent',
              color: activeTab === 'employees' ? '#713f12' : 'var(--text-secondary)',
              borderColor: activeTab === 'employees' ? '#fde047' : 'transparent',
              fontWeight: activeTab === 'employees' ? 700 : 500,
            }}
          >
            <Users size={17} color={activeTab === 'employees' ? '#a16207' : undefined} />
            <span>Employee Directory</span>
          </button>
        </nav>

        {/* Action Controls & HR User Persona */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Discrete Secondary Access: Audit Log */}
          <button
            onClick={() => setActiveTab('audit')}
            className="btn btn-secondary btn-sm"
            style={{
              background: activeTab === 'audit' ? '#fef9c3' : '#ffffff',
              borderColor: activeTab === 'audit' ? '#eab308' : '#e4d7a8',
              color: activeTab === 'audit' ? '#713f12' : '#71717a',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="System & Compliance Audit Trail"
          >
            <ShieldCheck size={14} color={activeTab === 'audit' ? '#a16207' : '#854d0e'} />
            <span className="audit-text" style={{ fontSize: '0.8rem' }}>Audit Log</span>
          </button>

          <button
            onClick={onOpenCreateEmployee}
            className="btn btn-primary btn-sm"
          >
            <UserPlus size={15} />
            <span className="add-emp-text">Add Employee</span>
          </button>

          {/* User Persona Chip */}
          <div className="persona-chip" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px 4px 4px',
            background: '#fefce8',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #fef08a',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#713f12',
              border: '1px solid #ca8a04',
              flexShrink: 0,
            }}>
              EV
            </div>
            <div className="persona-details" style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#18181b', whiteSpace: 'nowrap' }}>
                {hrUser?.name || 'Elena Vance'}
              </div>
              <div style={{ fontSize: '0.66rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#eab308' }}></span>
                HR Manager
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '6px 10px',
                fontSize: '0.78rem',
                color: '#71717a',
                borderColor: '#e4e4e7',
                background: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Sign out of CompPulse session"
            >
              <LogOut size={14} />
              <span className="logout-text">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
