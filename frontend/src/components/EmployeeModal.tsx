import React, { useState } from 'react';
import { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../types';
import { UserPlus, Edit3, X, AlertCircle } from 'lucide-react';
import { CurrencyCode, SUPPORTED_CURRENCIES, formatCurrencyAmount } from '../utils/currency';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCreate: (data: EmployeeCreateRequest) => Promise<void>;
  onSubmitUpdate: (id: number, data: EmployeeUpdateRequest) => Promise<void>;
  employeeToEdit?: Employee | null;
  departments: string[];
  countries: string[];
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
  employeeToEdit,
  departments,
  countries,
}) => {
  if (!isOpen) return null;

  const isEdit = !!employeeToEdit;

  const [employeeCode, setEmployeeCode] = useState(employeeToEdit?.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [firstName, setFirstName] = useState(employeeToEdit?.firstName || '');
  const [lastName, setLastName] = useState(employeeToEdit?.lastName || '');
  const [email, setEmail] = useState(employeeToEdit?.email || '');
  const [jobTitle, setJobTitle] = useState(employeeToEdit?.jobTitle || '');
  const [department, setDepartment] = useState(employeeToEdit?.department || (departments[0] || 'Engineering'));
  const [organization, setOrganization] = useState(employeeToEdit?.organization || 'Acme Global Technologies');
  const [country, setCountry] = useState(employeeToEdit?.country || (countries[0] || 'United States'));
  const [currency, setCurrency] = useState(employeeToEdit?.currency || 'USD');
  const [managerName, setManagerName] = useState(employeeToEdit?.managerName || '');
  const [status, setStatus] = useState(employeeToEdit?.status || 'ACTIVE');
  const [hireDate, setHireDate] = useState(employeeToEdit?.hireDate || new Date().toISOString().split('T')[0]);
  const [baseSalary, setBaseSalary] = useState(employeeToEdit?.baseSalary || 95000);
  const [variableBonus, setVariableBonus] = useState(employeeToEdit?.variableBonus || 10000);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const isFutureHireDate = hireDate > todayStr;

  const handleHireDateChange = (newDate: string) => {
    setHireDate(newDate);
    if (newDate > todayStr) {
      setStatus('ONBOARDING');
    } else if (status === 'ONBOARDING') {
      setStatus('ACTIVE');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isFutureHireDate && (status === 'ACTIVE' || status === 'TERMINATED')) {
      setError('Employees with a future start date must be marked as ONBOARDING.');
      return;
    }

    if (!isEdit && Number(baseSalary) <= 0) {
      setError('Starting base salary must be greater than zero.');
      return;
    }

    if (!isEdit && Number(variableBonus) < 0) {
      setError('Variable bonus cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (isEdit && employeeToEdit) {
        await onSubmitUpdate(employeeToEdit.id, {
          firstName,
          lastName,
          email,
          jobTitle,
          department,
          organization,
          country,
          managerName,
          status,
          hireDate,
        });
      } else {
        await onSubmitCreate({
          employeeCode,
          firstName,
          lastName,
          email,
          jobTitle,
          department,
          organization,
          country,
          currency,
          managerName,
          status,
          hireDate,
          baseSalary: Number(baseSalary),
          variableBonus: Number(variableBonus),
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fefce8',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              background: 'rgba(250, 204, 21, 0.25)',
              color: '#a16207',
            }}>
              {isEdit ? <Edit3 size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {isEdit ? 'Edit Employee Profile' : 'Add New Employee'}
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isEdit ? `Updating profile for ${employeeToEdit?.employeeCode}` : 'Register a new employee with initial salary package'}
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Employee Code *
              </label>
              <input
                type="text"
                value={employeeCode}
                onChange={(e) => setEmployeeCode(e.target.value)}
                disabled={isEdit}
                className="input-field"
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Status *
                </label>
                {isFutureHireDate && (
                  <span style={{ fontSize: '0.68rem', color: '#1d4ed8', fontWeight: 700, background: '#eff6ff', padding: '1px 6px', borderRadius: '4px' }}>
                    Future Hire
                  </span>
                )}
              </div>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as any)} 
                className="input-field"
                disabled={isFutureHireDate}
                title={isFutureHireDate ? "Status is locked to ONBOARDING for future hires" : undefined}
              >
                <option value="ACTIVE" disabled={isFutureHireDate}>ACTIVE</option>
                <option value="ONBOARDING">ONBOARDING (Future Hire)</option>
                <option value="ON_LEAVE" disabled={isFutureHireDate}>ON_LEAVE</option>
                <option value="TERMINATED" disabled={isFutureHireDate}>TERMINATED</option>
              </select>
              {isFutureHireDate && (
                <p style={{ fontSize: '0.72rem', color: '#1d4ed8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1.2 }}>
                  <AlertCircle size={12} /> Status set to ONBOARDING until start date ({hireDate}).
                </p>
              )}
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Lead Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Department *
              </label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field">
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                {!departments.includes('Engineering') && <option value="Engineering">Engineering</option>}
                {!departments.includes('Product') && <option value="Product">Product</option>}
                {!departments.includes('Marketing') && <option value="Marketing">Marketing</option>}
                {!departments.includes('Sales') && <option value="Sales">Sales</option>}
                {!departments.includes('Human Resources') && <option value="Human Resources">Human Resources</option>}
                {!departments.includes('Finance') && <option value="Finance">Finance</option>}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Country Location *
              </label>
              <select 
                value={country} 
                onChange={(e) => {
                  const val = e.target.value;
                  setCountry(val);
                  if (!isEdit) {
                    if (val.includes('United Kingdom') || val.includes('UK')) setCurrency('GBP');
                    else if (val.includes('Germany')) setCurrency('EUR');
                    else if (val.includes('India')) setCurrency('INR');
                    else if (val.includes('Singapore')) setCurrency('SGD');
                    else setCurrency('USD');
                  }
                }} 
                className="input-field"
              >
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!countries.includes('United States') && <option value="United States">United States</option>}
                {!countries.includes('United Kingdom') && <option value="United Kingdom">United Kingdom</option>}
                {!countries.includes('India') && <option value="India">India</option>}
                {!countries.includes('Germany') && <option value="Germany">Germany</option>}
                {!countries.includes('Singapore') && <option value="Singapore">Singapore</option>}
              </select>
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Payroll Currency * {isEdit && <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>(Locked)</span>}
              </label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                className="input-field"
                disabled={isEdit}
                style={{ opacity: isEdit ? 0.75 : 1, cursor: isEdit ? 'not-allowed' : 'pointer' }}
                title={isEdit ? 'Compensation currency is modified via Salary Revision requests' : 'Select currency'}
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="INR">INR (₹ - Indian Rupee)</option>
                <option value="SGD">SGD (S$ - Singapore Dollar)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Direct Manager Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Chen"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-grid-2col">
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Hire Date *
              </label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => handleHireDateChange(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Employment Status
              </label>
              <div style={{ 
                padding: '9px 12px', 
                borderRadius: 'var(--radius-sm)', 
                background: status === 'ACTIVE' ? '#ecfdf5' : '#eff6ff', 
                border: status === 'ACTIVE' ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                color: status === 'ACTIVE' ? '#065f46' : '#1e40af',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: '42px',
                boxSizing: 'border-box'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status === 'ACTIVE' ? '#10b981' : '#3b82f6' }}></span>
                <span>{status} {hireDate && new Date(hireDate) > new Date() ? '(Future Hire)' : ''}</span>
              </div>
            </div>
          </div>

          {!isEdit && (
            <div style={{
              marginTop: '6px',
              padding: '14px',
              background: '#fffdf5',
              border: '1px solid #fef08a',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#854d0e' }}>
                  Starting Compensation Package (USD Base Standard)
                </span>
                {currency !== 'USD' && (
                  <span style={{ fontSize: '0.72rem', color: '#713f12', background: '#fef9c3', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    1 USD = {SUPPORTED_CURRENCIES[currency as CurrencyCode]?.rateFromUSD} {currency}
                  </span>
                )}
              </div>

              <div className="form-grid-2col">
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#854d0e', marginBottom: '5px', display: 'block' }}>
                    Starting Base Salary (USD $) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <input
                      type="number"
                      step="1000"
                      min="1000"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                      className="input-field"
                      style={{ paddingLeft: '28px' }}
                      required
                    />
                  </div>
                  {currency !== 'USD' && (
                    <div style={{ fontSize: '0.74rem', color: '#854d0e', marginTop: '4px', fontWeight: 600 }}>
                      ≈ {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(baseSalary * (SUPPORTED_CURRENCIES[currency as CurrencyCode]?.rateFromUSD || 1))} in {currency}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#854d0e', marginBottom: '5px', display: 'block' }}>
                    Variable Bonus (USD $)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>$</span>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={variableBonus}
                      onChange={(e) => setVariableBonus(parseFloat(e.target.value) || 0)}
                      className="input-field"
                      style={{ paddingLeft: '28px' }}
                    />
                  </div>
                  {currency !== 'USD' && (
                    <div style={{ fontSize: '0.74rem', color: '#854d0e', marginTop: '4px', fontWeight: 600 }}>
                      ≈ {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(variableBonus * (SUPPORTED_CURRENCIES[currency as CurrencyCode]?.rateFromUSD || 1))} in {currency}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
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
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Employee Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
