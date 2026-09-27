import React, { useState } from 'react';
import type { Employee, SalaryRevisionRequest } from '../types';
import { TrendingUp, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface SalaryRevisionModalProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employeeId: number, data: SalaryRevisionRequest) => Promise<void>;
}

export const SalaryRevisionModal: React.FC<SalaryRevisionModalProps> = ({
  employee,
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const [newBaseSalary, setNewBaseSalary] = useState<number>(employee.baseSalary);
  const [newBonus, setNewBonus] = useState<number>(employee.variableBonus || 0);
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [revisionReason, setRevisionReason] = useState<string>('Annual Merit Review');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const prevBase = employee.baseSalary || 0;
  const salaryDiff = newBaseSalary - prevBase;
  const percentageChange = prevBase > 0 ? ((salaryDiff / prevBase) * 100) : 0;
  const newTotalComp = Number(newBaseSalary) + Number(newBonus);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newBaseSalary <= 0) {
      setError('Base salary must be greater than zero.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(employee.id, {
        newBaseSalary: Number(newBaseSalary),
        newBonus: Number(newBonus),
        effectiveDate,
        revisionReason,
        notes,
        approvedBy: 'Elena Vance (HR Manager)',
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit salary revision');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: employee.currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #fef08a' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f2ebd4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fefce8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              background: '#fef9c3',
              color: '#854d0e',
              border: '1px solid #fde047',
            }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#18181b' }}>
                Revise Salary Compensation
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#713f12' }}>
                {employee.firstName} {employee.lastName} • {employee.jobTitle} ({employee.employeeCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current State vs Proposed Comparison Card */}
        <div style={{ padding: '20px 24px 0 24px' }}>
          <div style={{
            background: '#fffef5',
            border: '1px solid #fef08a',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Current Base</span>
              <div className="amount-mono" style={{ fontSize: '1.1rem', color: '#18181b', marginTop: '2px', fontWeight: 700 }}>
                {formatCurrency(prevBase)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Proposed Adjustment</span>
              <div className="amount-mono" style={{
                fontSize: '1.1rem',
                color: salaryDiff >= 0 ? '#059669' : '#be123c',
                fontWeight: 800,
                marginTop: '2px'
              }}>
                {salaryDiff >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ({salaryDiff >= 0 ? '+' : ''}{formatCurrency(salaryDiff)})
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>New Total Comp</span>
              <div className="amount-mono" style={{ fontSize: '1.1rem', color: '#854d0e', fontWeight: 800, marginTop: '2px' }}>
                {formatCurrency(newTotalComp)}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {error && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              color: '#be123c',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12', marginBottom: '6px', display: 'block' }}>
                New Base Salary ({employee.currency}) *
              </label>
              <input
                type="number"
                step="500"
                min="1000"
                value={newBaseSalary}
                onChange={(e) => setNewBaseSalary(parseFloat(e.target.value) || 0)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12', marginBottom: '6px', display: 'block' }}>
                Variable Bonus / Incentive ({employee.currency})
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={newBonus}
                onChange={(e) => setNewBonus(parseFloat(e.target.value) || 0)}
                className="input-field"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12', marginBottom: '6px', display: 'block' }}>
                Effective Date *
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12', marginBottom: '6px', display: 'block' }}>
                Revision Reason *
              </label>
              <select
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                className="input-field"
                required
              >
                <option value="Annual Merit Review">Annual Merit Review</option>
                <option value="Promotion & Role Elevation">Promotion & Role Elevation</option>
                <option value="Market Benchmark Adjustment">Market Benchmark Adjustment</option>
                <option value="Key Talent Retention">Key Talent Retention</option>
                <option value="Cost of Living Adjustment">Cost of Living Adjustment</option>
                <option value="Equity & Internal Parity Correction">Equity & Internal Parity Correction</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#713f12', marginBottom: '6px', display: 'block' }}>
              Justification & Performance Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Exceeded H1 key deliverables, benchmarked against top percentile for lead engineering roles..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Persona Approver Notice */}
          <div style={{
            background: '#fef9c3',
            border: '1px solid #fde047',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#713f12',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <CheckCircle2 size={16} color="#854d0e" />
            <span>
              Authorized under single HR Manager approval persona (Elena Vance). Changes will be recorded in the audit trail.
            </span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Committing Revision...' : 'Apply Salary Revision'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
