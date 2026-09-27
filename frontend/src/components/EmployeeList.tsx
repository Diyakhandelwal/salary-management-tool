import React, { useState, useEffect } from 'react';
import type { Employee } from '../types';
import { 
  Search, 
  TrendingUp, 
  History, 
  Edit3, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  Download
} from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  departments: string[];
  countries: string[];
  initialDeptFilter?: string;
  initialCountryFilter?: string;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: {
    keyword: string;
    department: string;
    country: string;
    status: string;
    minSalary?: number;
    maxSalary?: number;
    sortBy: string;
    sortDirection: string;
  }) => void;
  onOpenRevision: (emp: Employee) => void;
  onOpenHistory: (emp: Employee) => void;
  onOpenEdit: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  onExportFiltered?: () => void;
  isExporting?: boolean;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  totalElements,
  totalPages,
  currentPage,
  departments,
  countries,
  initialDeptFilter = '',
  initialCountryFilter = '',
  onPageChange,
  onFilterChange,
  onOpenRevision,
  onOpenHistory,
  onOpenEdit,
  onDeleteEmployee,
  onExportFiltered,
  isExporting = false,
}) => {
  const [keyword, setKeyword] = useState('');
  const [department, setDepartment] = useState(initialDeptFilter);
  const [country, setCountry] = useState(initialCountryFilter);
  const [status, setStatus] = useState('');
  const [minSalary, setMinSalary] = useState<string>('');
  const [maxSalary, setMaxSalary] = useState<string>('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (initialDeptFilter) setDepartment(initialDeptFilter);
    if (initialCountryFilter) setCountry(initialCountryFilter);
  }, [initialDeptFilter, initialCountryFilter]);

  const applyFilters = () => {
    onFilterChange({
      keyword,
      department,
      country,
      status,
      minSalary: minSalary ? parseFloat(minSalary) : undefined,
      maxSalary: maxSalary ? parseFloat(maxSalary) : undefined,
      sortBy,
      sortDirection,
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      applyFilters();
    }, 250);
    return () => clearTimeout(handler);
  }, [keyword, department, country, status, minSalary, maxSalary, sortBy, sortDirection]);

  const handleReset = () => {
    setKeyword('');
    setDepartment('');
    setCountry('');
    setStatus('');
    setMinSalary('');
    setMaxSalary('');
    setSortBy('id');
    setSortDirection('desc');
  };

  const formatCurrency = (val: number | undefined, currency = 'USD') => {
    if (val === undefined || isNaN(val)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Search Control Bar */}
      <div className="glass-panel" style={{ padding: '20px', background: '#ffffff', border: '1px solid #f2ebd4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Search box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} color="#a16207" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by employee name, code (EMP-...), role, or email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px' }}
            />
            {keyword && (
              <button
                onClick={() => setKeyword('')}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Dropdown Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Department */}
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input-field"
              style={{ width: '160px' }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Country */}
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input-field"
              style={{ width: '150px' }}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Toggle Advanced Filters */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`btn ${showAdvancedFilters ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '9px 14px' }}
            >
              <SlidersHorizontal size={15} />
              Filter
            </button>

            {(department || country || status || minSalary || maxSalary || keyword) && (
              <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ color: '#be123c', borderColor: '#fecdd3' }}>
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters */}
        {showAdvancedFilters && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            alignItems: 'flex-end',
          }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#713f12', marginBottom: '4px', display: 'block' }}>
                Status
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
                <option value="">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="ONBOARDING">ONBOARDING</option>
                <option value="ON_LEAVE">ON LEAVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#713f12', marginBottom: '4px', display: 'block' }}>
                Min Base Salary ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 80000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#713f12', marginBottom: '4px', display: 'block' }}>
                Max Base Salary ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 180000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#713f12', marginBottom: '4px', display: 'block' }}>
                Sort By
              </label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                <option value="id">Employee ID</option>
                <option value="baseSalary">Base Salary</option>
                <option value="lastName">Last Name</option>
                <option value="department">Department</option>
                <option value="hireDate">Hire Date</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#713f12', marginBottom: '4px', display: 'block' }}>
                Direction
              </label>
              <select value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} className="input-field">
                <option value="desc">Descending (High to Low)</option>
                <option value="asc">Ascending (Low to High)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-panel" style={{ overflow: 'hidden', background: '#ffffff', border: '1px solid #f2ebd4' }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
        }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#18181b' }}>
              Employee Salary Directory
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
              Showing {employees.length} of {totalElements} registered compensation profiles
            </span>
          </div>

          {onExportFiltered && (
            <button
              onClick={onExportFiltered}
              disabled={isExporting || totalElements === 0}
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: '#eab308',
                color: '#713f12',
                background: '#fefce8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Download CSV report matching your active filters"
            >
              <Download size={14} color="#a16207" />
              <span>{isExporting ? 'Generating...' : `Export Filtered CSV (${totalElements})`}</span>
            </button>
          )}
        </div>

        {employees.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No employee records match your search criteria.</p>
            <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="data-table-container" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Title & Department</th>
                  <th>Location</th>
                  <th>Base Salary</th>
                  <th>Variable Bonus</th>
                  <th>Total Comp</th>
                  <th>Last Revised</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const initials = `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`;
                  return (
                    <tr key={emp.id}>
                      {/* Employee details */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #fde047 0%, #eab308 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            color: '#713f12',
                            flexShrink: 0,
                            border: '1px solid #facc15',
                          }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#18181b', fontSize: '0.9rem' }}>
                              {emp.firstName} {emp.lastName}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              <span className="badge badge-yellow" style={{ padding: '1px 6px', fontSize: '0.68rem' }}>
                                {emp.employeeCode}
                              </span>
                              <span>{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Title & Dept */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#27272a', fontSize: '0.875rem' }}>
                          {emp.jobTitle}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {emp.department}
                        </div>
                      </td>

                      {/* Location */}
                      <td>
                        <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                          {emp.country}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {emp.organization}
                        </div>
                      </td>

                      {/* Base Salary */}
                      <td>
                        <div className="amount-mono" style={{ fontSize: '0.95rem', color: '#18181b', fontWeight: 700 }}>
                          {formatCurrency(emp.baseSalary, emp.currency)}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Annualized</div>
                      </td>

                      {/* Bonus */}
                      <td>
                        <div className="amount-mono" style={{ fontSize: '0.875rem', color: '#059669', fontWeight: 600 }}>
                          {formatCurrency(emp.variableBonus, emp.currency)}
                        </div>
                      </td>

                      {/* Total Comp */}
                      <td>
                        <div className="amount-mono" style={{ fontSize: '1rem', color: '#854d0e', fontWeight: 800 }}>
                          {formatCurrency(emp.totalCompensation, emp.currency)}
                        </div>
                      </td>

                      {/* Last Revision */}
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {emp.lastRevisionDate || 'Initial'}
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`badge ${
                          emp.status === 'ACTIVE' ? 'badge-active' :
                          emp.status === 'ONBOARDING' ? 'badge-onboarding' :
                          emp.status === 'ON_LEAVE' ? 'badge-leave' : 'badge-terminated'
                        }`}>
                          {emp.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => onOpenRevision(emp)}
                            className="btn btn-primary btn-sm"
                            disabled={emp.status === 'TERMINATED'}
                            title={emp.status === 'TERMINATED' ? 'Cannot revise compensation for a TERMINATED employee' : 'Revise Base Salary or Variable Bonus'}
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              opacity: emp.status === 'TERMINATED' ? 0.45 : 1,
                              cursor: emp.status === 'TERMINATED' ? 'not-allowed' : 'pointer',
                            }}
                          >
                            <TrendingUp size={13} />
                            Revise
                          </button>

                          <button
                            onClick={() => onOpenHistory(emp)}
                            className="btn btn-secondary btn-sm"
                            title="View Revision Timeline"
                            style={{ padding: '5px 8px' }}
                          >
                            <History size={14} color="#713f12" />
                          </button>

                          <button
                            onClick={() => onOpenEdit(emp)}
                            className="btn btn-secondary btn-sm"
                            title="Edit Profile"
                            style={{ padding: '5px 8px' }}
                          >
                            <Edit3 size={14} color="#713f12" />
                          </button>

                          <button
                            onClick={() => onDeleteEmployee(emp)}
                            className="btn btn-danger btn-sm"
                            title="Remove Profile"
                            style={{ padding: '5px 8px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fffef5',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page <strong style={{ color: '#18181b' }}>{currentPage + 1}</strong> of <strong style={{ color: '#18181b' }}>{totalPages}</strong>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="btn btn-secondary btn-sm"
                style={{ opacity: currentPage >= totalPages - 1 ? 0.4 : 1 }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
