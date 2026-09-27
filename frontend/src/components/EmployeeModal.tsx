import React, { useState } from 'react';
import { Employee, EmployeeCreateRequest, EmployeeUpdateRequest } from '../types';
import { UserPlus, Edit3, X, AlertCircle } from 'lucide-react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Status *
              </label>
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input-field">
                <option value="ACTIVE">ACTIVE</option>
                <option value="ON_LEAVE">ON_LEAVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Hire Date *
              </label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          {!isEdit && (
            <div style={{
              marginTop: '6px',
              padding: '14px',
              background: '#fffdf5',
              border: '1px solid #fef08a',
              borderRadius: 'var(--radius-md)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '14px',
            }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#854d0e', marginBottom: '5px', display: 'block' }}>
                  Starting Base Salary ({currency}) *
                </label>
                <input
                  type="number"
                  step="1000"
                  min="1000"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#854d0e', marginBottom: '5px', display: 'block' }}>
                  Variable Bonus ({currency})
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={variableBonus}
                  onChange={(e) => setVariableBonus(parseFloat(e.target.value) || 0)}
                  className="input-field"
                />
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
