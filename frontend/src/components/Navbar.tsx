import React from 'react';
import type { HRUser } from '../types';
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'employees' | 'audit';
  setActiveTab: (tab: 'dashboard' | 'employees' | 'audit') => void;
  hrUser: HRUser | null;
  onOpenCreateEmployee: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hrUser,
  onOpenCreateEmployee,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 24px',
      boxShadow: '0 1px 3px rgba(234, 179, 8, 0.08)',
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '24px',
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(234, 179, 8, 0.35)',
            border: '1px solid #facc15',
          }}>
            <Sparkles size={22} color="#713f12" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#18181b' }}>
                Comp<span style={{ color: '#ca8a04' }}>Pulse</span>
              </span>
              <span className="badge badge-yellow" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                v1.0 • Enterprise
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Total Rewards & Salary Management
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            Analytics
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
            Employee Salaries
          </button>
        </nav>

        {/* Action Controls & HR User Persona */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <span style={{ fontSize: '0.8rem' }}>Audit Log</span>
          </button>

          <button
            onClick={onOpenCreateEmployee}
            className="btn btn-primary btn-sm"
          >
            <UserPlus size={15} />
            Add Employee
          </button>

          {/* User Persona Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '5px 12px 5px 6px',
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
            }}>
              EV
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#18181b' }}>
                {hrUser?.name || 'Elena Vance'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#854d0e', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308' }}></span>
                HR Manager Persona
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
