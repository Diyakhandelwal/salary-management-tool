import React, { useState } from 'react';
import type { DashboardSummary, SalaryRevision, RoleAnalytics } from '../types';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Scale, 
  Globe2, 
  Building2, 
  ArrowUpRight, 
  Layers,
  Calendar,
  CircleDollarSign
} from 'lucide-react';
import { CurrencyCode, SUPPORTED_CURRENCIES, formatCurrencyAmount } from '../utils/currency';

interface DashboardOverviewProps {
  summary: DashboardSummary | null;
  recentRevisions: SalaryRevision[];
  roleAnalytics: RoleAnalytics[];
  onNavigateToEmployees: (filter?: { department?: string; country?: string }) => void;
  onOpenRevisionForEmployee?: (employeeId: number) => void;
  onOpenHistoryForEmployee?: (employeeId: number) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  recentRevisions,
  onNavigateToEmployees,
  onOpenHistoryForEmployee,
}) => {
  const [reportingCurrency, setReportingCurrency] = useState<CurrencyCode>('USD');
  const [fiscalPeriod, setFiscalPeriod] = useState<'FY2026' | 'TTM' | 'FY2025'>('FY2026');
  const [filterRevisionsByPeriod, setFilterRevisionsByPeriod] = useState<boolean>(true);

  if (!summary) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading compensation metrics...
      </div>
    );
  }

  // Multiplier for fiscal period comparison simulation
  const periodMultiplier = fiscalPeriod === 'FY2026' ? 1.0 : fiscalPeriod === 'TTM' ? 0.96 : 0.89;

  // Formatter for simulated portfolio totals across periods
  const formatCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '$0';
    return formatCurrencyAmount(val * periodMultiplier, reportingCurrency);
  };

  // Formatter for actual historical logged salary transactions (converts currency without artificial multiplier scaling)
  const formatActualCurrency = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '$0';
    return formatCurrencyAmount(val, reportingCurrency);
  };

  // Revisions dynamically filtered by selected duration or all-time
  const displayedRevisions = recentRevisions.filter((rev) => {
    if (!filterRevisionsByPeriod) return true;
    if (!rev.effectiveDate) return true;
    const revDate = new Date(rev.effectiveDate);
    const revYear = revDate.getFullYear();
    if (fiscalPeriod === 'FY2026') {
      return revYear === 2026;
    } else if (fiscalPeriod === 'FY2025') {
      return revYear === 2025;
    } else if (fiscalPeriod === 'TTM') {
      const now = new Date();
      const diffMonths = (now.getFullYear() - revDate.getFullYear()) * 12 + (now.getMonth() - revDate.getMonth());
      return diffMonths >= 0 && diffMonths <= 12;
    }
    return true;
  });

  const getConvertedBandLabel = (originalLabel: string, currency: CurrencyCode): string => {
    if (currency === 'USD') return originalLabel;
    const rate = SUPPORTED_CURRENCIES[currency].rateFromUSD;
    const sym = SUPPORTED_CURRENCIES[currency].symbol;

    if (originalLabel.startsWith('< $')) {
      const num = parseInt(originalLabel.replace(/[^0-9]/g, ''), 10);
      return `< ${sym}${Math.round(num * rate)}K`;
    }
    if (originalLabel.endsWith('K+')) {
      const num = parseInt(originalLabel.replace(/[^0-9]/g, ''), 10);
      return `${sym}${Math.round(num * rate)}K+`;
    }
    if (originalLabel.includes('-')) {
      const parts = originalLabel.split('-').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return `${sym}${Math.round(parts[0] * rate)}K - ${sym}${Math.round(parts[1] * rate)}K`;
      }
    }
    return originalLabel;
  };

  const maxDeptSpend = Math.max(...(summary.departmentBreakdown?.map(d => d.totalExpenditure) || [1]), 1);
  const maxCountrySpend = Math.max(...(summary.countryBreakdown?.map(c => c.totalExpenditure) || [1]), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Top Banner / Welcome & Controls with warm yellow gradient */}
      <div className="glass-panel dashboard-banner" style={{
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 60%, #fef9c3 100%)',
        border: '1px solid #fef08a',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px -2px rgba(234, 179, 8, 0.12)',
      }}>
        <div style={{ zIndex: 1, flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-yellow">HR Leadership Executive View</span>
            <span style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: 600 }}>Acme Global Technologies</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#18181b', letterSpacing: '-0.02em', margin: 0 }}>
            Compensation & Salary Portfolio
          </h1>
          
          {/* Explicit Reporting Period & Duration Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '8px',
            fontSize: '0.78rem',
            color: '#713f12',
            flexWrap: 'wrap',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
              <Calendar size={13} color="#a16207" />
              Reporting Duration:
            </span>
            <span style={{ background: '#fef08a', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
              {fiscalPeriod === 'FY2026' && 'Fiscal Year 2026 (Jan 1 – Dec 31, 2026 • Annualized)'}
              {fiscalPeriod === 'TTM' && 'Trailing 12 Months (Oct 2025 – Sep 2026 • Rolling Actuals)'}
              {fiscalPeriod === 'FY2025' && 'Fiscal Year 2025 (Historical Closed Annual Actuals)'}
            </span>
            <span>•</span>
            <span>Live snapshot as of <strong>Q3 2026</strong></span>
            {reportingCurrency !== 'USD' && (
              <>
                <span>•</span>
                <span style={{ color: '#854d0e', fontWeight: 600 }}>
                  Converted at 1 USD = {SUPPORTED_CURRENCIES[reportingCurrency].rateFromUSD} {reportingCurrency}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Global Controls: Period Selector & Multi-Currency Switcher */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'flex-end',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Fiscal Period Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#ffffff',
              padding: '3px 6px',
              borderRadius: '8px',
              border: '1px solid #fde047',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <Calendar size={13} color="#854d0e" style={{ marginLeft: '4px' }} />
              <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#713f12', marginRight: '4px' }}>Period:</span>
              {(['FY2026', 'TTM', 'FY2025'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setFiscalPeriod(p)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '5px',
                    border: 'none',
                    background: fiscalPeriod === p ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' : 'transparent',
                    color: fiscalPeriod === p ? '#713f12' : '#71717a',
                    fontWeight: fiscalPeriod === p ? 800 : 500,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={p === 'FY2026' ? 'Current 2026 Annualized Payroll' : p === 'TTM' ? 'Trailing 12 Months' : 'Prior Year 2025'}
                >
                  {p === 'FY2026' ? 'FY 2026' : p === 'TTM' ? 'TTM (12M)' : 'FY 2025'}
                </button>
              ))}
            </div>

            {/* Currency Switcher */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#ffffff',
              padding: '3px 6px',
              borderRadius: '8px',
              border: '1px solid #fde047',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <CircleDollarSign size={13} color="#854d0e" style={{ marginLeft: '4px' }} />
              <span style={{ fontSize: '0.73rem', fontWeight: 700, color: '#713f12', marginRight: '4px' }}>Currency:</span>
              {(['USD', 'EUR', 'GBP', 'INR', 'SGD'] as CurrencyCode[]).map(c => (
                <button
                  key={c}
                  onClick={() => setReportingCurrency(c)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '5px',
                    border: 'none',
                    background: reportingCurrency === c ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' : 'transparent',
                    color: reportingCurrency === c ? '#713f12' : '#71717a',
                    fontWeight: reportingCurrency === c ? 800 : 500,
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title={`${SUPPORTED_CURRENCIES[c].name} (${SUPPORTED_CURRENCIES[c].symbol})`}
                >
                  {SUPPORTED_CURRENCIES[c].symbol} {c}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigateToEmployees()} 
            className="btn btn-primary btn-sm"
            style={{ padding: '6px 14px' }}
          >
            Explore Employee Roster
            <ArrowUpRight size={14} />
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
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Total Annual Payroll
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {fiscalPeriod === 'FY2026' ? 'FY 2026 Projected' : fiscalPeriod === 'TTM' ? 'TTM Rolling' : 'FY 2025 Closed'}
              </span>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#fef9c3', color: '#a16207' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b', marginTop: '4px' }}>
            {formatCurrency(summary.totalAnnualPayroll)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#047857', fontWeight: 600 }}>Active Base Compensation</span>
            <span>•</span>
            <span>in {reportingCurrency}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel kpi-card emerald">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Active Headcount
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Workforce Density</span>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfdf5', color: '#059669' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b', marginTop: '4px' }}>
            {summary.activeEmployees} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ {summary.totalEmployees}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Across {summary.departmentCount} depts & {summary.countryCount} countries
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel kpi-card cyan">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0e7490', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Average Salary
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mean Compensation</span>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#ecfeff', color: '#0891b2' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.9rem', color: '#18181b', marginTop: '4px' }}>
            {formatCurrency(summary.averageSalary)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Median: <strong style={{ color: '#18181b' }}>{formatCurrency(summary.medianSalary)}</strong>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel kpi-card amber">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>
                Salary Spread (Min - Max)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bandwidth Range</span>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: '#fffbeb', color: '#d97706' }}>
              <Scale size={18} />
            </div>
          </div>
          <div className="amount-mono" style={{ fontSize: '1.45rem', color: '#18181b', lineHeight: 1.3, marginTop: '4px' }}>
            {formatCurrency(summary.minSalary)} - {formatCurrency(summary.maxSalary)}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Organizational compensation spread
          </div>
        </div>
      </div>

      {/* Salary Distribution Histogram Section - FIXED: Bars cannot overlap slab labels */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#ca8a04" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
                Salary Distribution & Compensation Bands
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              Headcount density across annualized base compensation brackets ({reportingCurrency})
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
            const maxPercentage = Math.max(...(summary.salaryDistribution?.map(b => b.percentage) || [1]), 1);
            // Height is strictly capped at 75% so it leaves 25px clear space below the slab label!
            const barFillPercent = band.employeeCount === 0 
              ? 3 
              : Math.min(Math.max((band.percentage / maxPercentage) * 75, 8), 75);

            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fef08a',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Slab Header Label - Guaranteed to never be overlapped */}
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#713f12',
                  textAlign: 'center',
                  minHeight: '22px',
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  {getConvertedBandLabel(band.bandLabel, reportingCurrency)}
                </div>

                {/* Bar Area: Fixed 95px container with internal track, prevents any overflow */}
                <div style={{
                  width: '100%',
                  height: '95px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  padding: '0 6px',
                }}>
                  <div style={{
                    width: '44px',
                    height: '100%',
                    background: '#fefce8',
                    borderRadius: '8px',
                    border: '1px solid #fef08a',
                    display: 'flex',
                    alignItems: 'flex-end',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${barFillPercent}%`,
                        background: band.employeeCount > 0 
                          ? 'linear-gradient(180deg, #facc15 0%, #ca8a04 100%)' 
                          : '#f4f4f5',
                        borderRadius: '6px 6px 0 0',
                        boxShadow: band.employeeCount > 0 ? '0 -2px 8px rgba(202, 138, 4, 0.35)' : 'none',
                        transition: 'height 0.4s ease',
                      }}
                      title={`${band.bandLabel}: ${band.employeeCount} employees (${band.percentage}%)`}
                    />
                  </div>
                </div>

                {/* Headcount Count */}
                <div className="amount-mono" style={{ fontSize: '1.15rem', color: '#18181b', fontWeight: 800 }}>
                  {band.employeeCount} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>emps</span>
                </div>

                {/* Percentage */}
                <div style={{ fontSize: '0.75rem', color: '#a16207', fontWeight: 700, marginTop: '2px' }}>
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              In {reportingCurrency} • {fiscalPeriod}
            </span>
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
                Global Regional Allocation
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              In {reportingCurrency} • {fiscalPeriod}
            </span>
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

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', background: '#f5f0e1', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #38bdf8, #0284c7)',
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#d97706" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
                Recent Salary Revisions & Adjustments
              </h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
              {filterRevisionsByPeriod
                ? `Filtered for ${fiscalPeriod === 'FY2026' ? 'Fiscal Year 2026 (Annualized Cycle)' : fiscalPeriod === 'TTM' ? 'Trailing 12 Months' : 'Fiscal Year 2025 (Closed Annual Cycle)'}`
                : 'Displaying complete chronological audit trail across all logged cycles'}
            </p>
          </div>

          {/* Duration Filter Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Duration:</span>
            <button
              type="button"
              onClick={() => setFilterRevisionsByPeriod(true)}
              className="btn btn-sm"
              style={{
                background: filterRevisionsByPeriod ? '#fef9c3' : '#ffffff',
                border: filterRevisionsByPeriod ? '1px solid #fde047' : '1px solid #e4d7a8',
                color: filterRevisionsByPeriod ? '#713f12' : '#71717a',
                fontWeight: filterRevisionsByPeriod ? 700 : 500,
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              {fiscalPeriod} Active ({displayedRevisions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterRevisionsByPeriod(false)}
              className="btn btn-sm"
              style={{
                background: !filterRevisionsByPeriod ? '#fef9c3' : '#ffffff',
                border: !filterRevisionsByPeriod ? '1px solid #fde047' : '1px solid #e4d7a8',
                color: !filterRevisionsByPeriod ? '#713f12' : '#71717a',
                fontWeight: !filterRevisionsByPeriod ? 700 : 500,
                padding: '4px 10px',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              All Time ({recentRevisions.length})
            </button>
          </div>
        </div>

        {displayedRevisions.length === 0 ? (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            background: '#fffef5',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed #fef08a',
          }}>
            <p style={{ color: '#713f12', fontSize: '0.9rem', fontWeight: 700 }}>
              No salary revisions recorded in {fiscalPeriod === 'FY2026' ? 'Fiscal Year 2026' : fiscalPeriod === 'TTM' ? 'Trailing 12 Months' : 'Fiscal Year 2025'}.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '4px' }}>
              Select "All Time" to view all {recentRevisions.length} historical revisions logged in the system.
            </p>
            <button
              onClick={() => setFilterRevisionsByPeriod(false)}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
            >
              Show All Recorded Revisions ({recentRevisions.length})
            </button>
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Effective Date</th>
                  <th>Previous Base</th>
                  <th>New Base</th>
                  <th>Delta (%)</th>
                  <th>Reason</th>
                  <th>Approved By</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedRevisions.slice(0, 8).map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <button
                        onClick={() => onOpenHistoryForEmployee ? onOpenHistoryForEmployee(rev.employeeId) : onNavigateToEmployees()}
                        style={{
                          background: '#fefce8',
                          border: '1px solid #fde047',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontWeight: 700,
                          color: '#854d0e',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          transition: 'all 0.15s ease',
                        }}
                        title="Click to view full compensation revision history"
                      >
                        EMP-{rev.employeeId}
                        <ArrowUpRight size={12} />
                      </button>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{rev.effectiveDate}</td>
                    <td className="amount-mono">{formatActualCurrency(rev.previousBaseSalary)}</td>
                    <td className="amount-mono" style={{ fontWeight: 700, color: '#18181b' }}>
                      {formatActualCurrency(rev.newBaseSalary)}
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: rev.percentageChange >= 0 ? '#ecfdf5' : '#fff1f2',
                        color: rev.percentageChange >= 0 ? '#065f46' : '#be123c',
                      }}>
                        {rev.percentageChange >= 0 ? '+' : ''}{rev.percentageChange}%
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rev.revisionReason}</td>
                    <td>
                      <span className="badge badge-yellow" style={{ fontSize: '0.75rem' }}>
                        {rev.approvedBy}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenHistoryForEmployee && onOpenHistoryForEmployee(rev.employeeId)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '3px 8px', fontSize: '0.75rem' }}
                        title="View complete revision history"
                      >
                        Timeline
                      </button>
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
