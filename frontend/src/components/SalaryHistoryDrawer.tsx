import React, { useEffect, useState } from 'react';
import { Employee, SalaryRevision } from '../types';
import { api } from '../services/api';
import { X, History, ArrowUpRight, Calendar, UserCheck, FileText, CheckCircle2 } from 'lucide-react';

interface SalaryHistoryDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRevisionModal: (emp: Employee) => void;
}

export const SalaryHistoryDrawer: React.FC<SalaryHistoryDrawerProps> = ({
  employee,
  isOpen,
  onClose,
  onOpenRevisionModal,
}) => {
  if (!isOpen || !employee) return null;

  const [history, setHistory] = useState<SalaryRevision[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getSalaryHistory(employee.id);
        if (isMounted) setHistory(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to load salary history');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [employee]);

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: employee.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(250, 204, 21, 0.2)',
              color: '#a16207',
            }}>
              <History size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Salary Revision History
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Audit trail of compensation changes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Employee Summary Card */}
        <div style={{
          background: '#fffdf0',
          border: '1px solid #fef08a',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {employee.firstName} {employee.lastName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {employee.jobTitle} • {employee.department}
              </div>
            </div>
            <span className="badge badge-indigo">
              {employee.employeeCode}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Current Base Salary</div>
              <div className="amount-mono" style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                {formatCurrency(employee.baseSalary)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Compensation</div>
              <div className="amount-mono" style={{ fontSize: '1.15rem', color: '#b45309', fontWeight: 700 }}>
                {formatCurrency(employee.totalCompensation)}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenRevisionModal(employee);
            }}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', marginTop: '14px' }}
          >
            <ArrowUpRight size={15} />
            Revise Salary Now
          </button>
        </div>

        {/* Timeline Content */}
        <div style={{ position: 'relative' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#713f12', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '18px' }}>
            Revision Timeline ({history.length} events)
          </h3>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading revision timeline...
            </div>
          ) : error ? (
            <div style={{ padding: '20px', color: '#be123c', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px' }}>
              {error}
            </div>
          ) : history.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: '#fefce8',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed #fde047',
            }}>
              <CheckCircle2 size={32} color="#ca8a04" style={{ margin: '0 auto 10px auto' }} />
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>No prior revisions recorded</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
                This employee is currently on their initial hire compensation package.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '24px' }}>
              {/* Vertical timeline line */}
              <div style={{
                position: 'absolute',
                left: '7px',
                top: '10px',
                bottom: '10px',
                width: '2px',
                background: 'linear-gradient(180deg, #eab308 0%, rgba(234, 179, 8, 0.2) 100%)',
              }} />

              {history.map((rev, index) => (
                <div key={rev.id} style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-24px',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: index === 0 ? '#10b981' : '#eab308',
                    border: '3px solid #ffffff',
                    boxShadow: index === 0 ? '0 0 8px rgba(16, 185, 129, 0.4)' : '0 0 6px rgba(234, 179, 8, 0.4)',
                  }} />

                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #fef08a',
                    boxShadow: '0 2px 8px rgba(202, 138, 4, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-active" style={{ fontSize: '0.78rem' }}>
                        +{rev.percentageChange?.toFixed(1)}% Adjustment
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Effective: {rev.effectiveDate}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                      <span className="amount-mono" style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatCurrency(rev.previousBaseSalary)}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>➔</span>
                      <span className="amount-mono" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.05rem' }}>
                        {formatCurrency(rev.newBaseSalary)}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
                      {rev.revisionReason}
                    </div>

                    {rev.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                        "{rev.notes}"
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                      <UserCheck size={13} color="#059669" />
                      <span>Approved by: {rev.approvedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
