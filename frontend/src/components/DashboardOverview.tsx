import React from 'react';
import type { DashboardSummary, SalaryRevision, RoleAnalytics } from '../types';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Scale, 
  Globe2, 
  Building2, 
  ArrowUpRight, 
  Layers
} from 'lucide-react';

interface DashboardOverviewProps {
  summary: DashboardSummary | null;
  recentRevisions: SalaryRevision[];
  roleAnalytics: RoleAnalytics[];
  onNavigateToEmployees: (filter?: { department?: string; country?: string }) => void;
  onOpenRevisionForEmployee?: (employeeId: number) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  recentRevisions,
  onNavigateToEmployees,
}) => {
  if (!summary) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading compensation metrics...
      </div>
    );
  }

  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const maxDeptSpend = Math.max(...(summary.departmentBreakdown?.map(d => d.totalExpenditure) || [1]), 1);
  const maxCountrySpend = Math.max(...(summary.countryBreakdown?.map(c => c.totalExpenditure) || [1]), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner / Welcome with warm yellow gradient */}
      <div className="glass-panel" style={{
        padding: '26px 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 60%, #fef9c3 100%)',
        border: '1px solid #fef08a',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(234, 179, 8, 0.12)',
      }}>
        <div style={{ zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-yellow">HR Leadership View</span>
            <span style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 600 }}>Acme Global Technologies</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.02em' }}>
            Compensation & Salary Portfolio
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '680px', marginTop: '4px' }}>
            Real-time analytics on total compensation expenditure, headcount distribution, parity benchmarks, and revision activity across 5 global operating regions.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          zIndex: 1,
        }}>
          <button 
            onClick={() => onNavigateToEmployees()} 
            className="btn btn-primary"
          >
            Explore Employee Roster
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
      }}>
        {/* KPI 1 */}
        <div className="glass-panel kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Annual Payroll
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#fef9c3', color: '#a16207' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b' }}>
            {formatCurrency(summary.totalAnnualPayroll)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#047857', fontWeight: 600 }}>Active Base Compensation</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel kpi-card emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Headcount
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b' }}>
            {summary.activeEmployees} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ {summary.totalEmployees}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Across {summary.departmentCount} depts & {summary.countryCount} countries
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel kpi-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0e7490', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Average Salary
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfeff', color: '#0891b2' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b' }}>
            {formatCurrency(summary.averageSalary)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Median: <strong style={{ color: '#18181b' }}>{formatCurrency(summary.medianSalary)}</strong>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel kpi-card amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Salary Spread (Min - Max)
            </span>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#fffbeb', color: '#d97706' }}>
              <Scale size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.45rem', color: '#18181b', lineHeight: 1.3 }}>
            {formatCurrency(summary.minSalary)} - {formatCurrency(summary.maxSalary)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Dynamic compensation bandwidth
          </div>
        </div>
      </div>

      {/* Salary Distribution Histogram Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#ca8a04" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#18181b' }}>
                Salary Distribution & Compensation Bands
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Headcount density across annualized base compensation brackets
            </p>
          </div>
          <span className="badge badge-yellow">
            {summary.salaryDistribution?.reduce((acc, curr) => acc + curr.employeeCount, 0)} Total Profiles
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          {summary.salaryDistribution?.map((band, idx) => {
            const heightPercent = Math.max((band.percentage / 40) * 100, 10);
            return (
              <div
                key={idx}
                style={{
                  background: '#fffef5',
                  border: '1px solid #fef08a',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#713f12' }}>
                  {band.bandLabel}
                </div>

                <div style={{
                  width: '100%',
                  height: '110px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '6px 0',
                }}>
                  <div
                    style={{
                      width: '44px',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, #fde047 0%, #eab308 100%)',
                      borderRadius: '6px 6px 2px 2px',
                      boxShadow: '0 2px 10px rgba(234, 179, 8, 0.3)',
                      transition: 'height 0.4s ease',
                    }}
                  />
                </div>

                <div className="amount-mono" style={{ fontSize: '1.1rem', color: '#18181b', fontWeight: 700 }}>
                  {band.employeeCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>emps</span>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#a16207', fontWeight: 700 }}>
                  {band.percentage}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Department vs Country Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
      }}>
        {/* Department Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} color="#059669" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b' }}>
                Department Budget Allocation
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By Total Expenditure</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {summary.departmentBreakdown?.map((dept, i) => {
              const percent = Math.round((dept.totalExpenditure / maxDeptSpend) * 100);
              return (
                <div
                  key={i}
                  onClick={() => onNavigateToEmployees({ department: dept.department })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#fffef5',
                    border: '1px solid #fef08a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ca8a04';
                    e.currentTarget.style.background = '#fefce8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#fef08a';
                    e.currentTarget.style.background = '#fffef5';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#18181b', fontSize: '0.9rem' }}>{dept.department}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({dept.employeeCount} headcount)
                      </span>
                    </div>
                    <div className="amount-mono" style={{ fontSize: '0.95rem', color: '#854d0e', fontWeight: 700 }}>
                      {formatCurrency(dept.totalExpenditure)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: '#f5f0e1', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #facc15, #ca8a04)',
                      borderRadius: '999px',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Avg: <strong style={{ color: '#27272a' }}>{formatCurrency(dept.averageSalary)}</strong></span>
                    <span>Range: {formatCurrency(dept.minSalary)} - {formatCurrency(dept.maxSalary)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe2 size={18} color="#0891b2" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b' }}>
                Geographic Compensation & Headcount
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5 Operating Regions</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {summary.countryBreakdown?.map((country, i) => {
              const percent = Math.round((country.totalExpenditure / maxCountrySpend) * 100);
              return (
                <div
                  key={i}
                  onClick={() => onNavigateToEmployees({ country: country.country })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#fffef5',
                    border: '1px solid #fef08a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ca8a04';
                    e.currentTarget.style.background = '#fefce8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#fef08a';
                    e.currentTarget.style.background = '#fffef5';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#18181b', fontSize: '0.9rem' }}>{country.country}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '8px' }}>
                        ({country.employeeCount} headcount)
                      </span>
                    </div>
                    <div className="amount-mono" style={{ fontSize: '0.95rem', color: '#854d0e', fontWeight: 700 }}>
                      {formatCurrency(country.totalExpenditure)}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '6px', background: '#f5f0e1', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #fde047, #eab308)',
                      borderRadius: '999px',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <span>Avg Salary: <strong style={{ color: '#27272a' }}>{formatCurrency(country.averageSalary)}</strong></span>
                    <span>Range: {formatCurrency(country.minSalary)} - {formatCurrency(country.maxSalary)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Salary Revisions Log Row */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#d97706" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b' }}>
                Recent Salary Revisions & Adjustments
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Historical audit of merit bumps, promotions, and market adjustments
            </p>
          </div>
        </div>

        {recentRevisions.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No recent salary revisions logged yet.
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Effective Date</th>
                  <th>Employee ID</th>
                  <th>Previous Base</th>
                  <th>New Base</th>
                  <th>Adjustment (%)</th>
                  <th>Revision Reason</th>
                  <th>Authorized By</th>
                  <th>Justification Notes</th>
                </tr>
              </thead>
              <tbody>
                {recentRevisions.map((rev) => (
                  <tr key={rev.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {rev.effectiveDate}
                    </td>
                    <td>
                      <span className="badge badge-yellow">
                        EMP-{rev.employeeId}
                      </span>
                    </td>
                    <td className="amount-mono" style={{ color: 'var(--text-muted)' }}>
                      {formatCurrency(rev.previousBaseSalary)}
                    </td>
                    <td className="amount-mono" style={{ color: '#18181b', fontWeight: 700 }}>
                      {formatCurrency(rev.newBaseSalary)}
                    </td>
                    <td>
                      <span className="badge badge-active" style={{ fontSize: '0.78rem' }}>
                        +{rev.percentageChange?.toFixed(1)}%
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#27272a' }}>
                      {rev.revisionReason}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {rev.approvedBy}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rev.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
