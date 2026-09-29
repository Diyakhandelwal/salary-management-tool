import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { EmployeeList } from './components/EmployeeList';
import { SalaryRevisionModal } from './components/SalaryRevisionModal';
import { SalaryHistoryDrawer } from './components/SalaryHistoryDrawer';
import { EmployeeModal } from './components/EmployeeModal';
import { AuditLogsView } from './components/AuditLogsView';
import { LoginPage } from './components/LoginPage';
import { api } from './services/api';
import { 
  Employee, 
  DashboardSummary, 
  SalaryRevision, 
  RoleAnalytics, 
  HRUser,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  SalaryRevisionRequest
} from './types';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'employees' | 'audit'>('dashboard');
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('comppulse_is_authenticated') === 'true';
  });

  // Data states
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentRevisions, setRecentRevisions] = useState<SalaryRevision[]>([]);
  const [roleAnalytics, setRoleAnalytics] = useState<RoleAnalytics[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [hrUser, setHrUser] = useState<HRUser | null>(() => {
    const saved = localStorage.getItem('comppulse_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Filter state for employee list
  const [filters, setFilters] = useState<{
    keyword: string;
    department: string;
    country: string;
    status: string;
    minSalary?: number;
    maxSalary?: number;
    sortBy: string;
    sortDirection: string;
  }>({
    keyword: '',
    department: '',
    country: '',
    status: '',
    sortBy: 'id',
    sortDirection: 'desc',
  });

  // Modal states
  const [selectedForRevision, setSelectedForRevision] = useState<Employee | null>(null);
  const [selectedForHistory, setSelectedForHistory] = useState<Employee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState<boolean>(false);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Load dashboard, user profile, and master lists
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoadingInitial(true);
      const [sumData, recRev, roles, depts, counts, profile] = await Promise.all([
        api.getDashboardSummary().catch(() => null),
        api.getRecentRevisions().catch(() => []),
        api.getRoleAnalytics().catch(() => []),
        api.getDepartments().catch(() => []),
        api.getCountries().catch(() => []),
        api.getHRProfile().catch(() => null),
      ]);

      if (sumData) {
        setSummary(sumData);
      } else {
        // Cold-start resilience: if cloud backend was sleeping, retry after 3.5s
        setTimeout(() => {
          Promise.all([
            api.getDashboardSummary().catch(() => null),
            api.getRecentRevisions().catch(() => []),
            api.getRoleAnalytics().catch(() => []),
            api.getDepartments().catch(() => []),
            api.getCountries().catch(() => []),
            api.getHRProfile().catch(() => null),
          ]).then(([sData, rRev, rRoles, dDepts, cCounts, pProfile]) => {
            if (sData) setSummary(sData);
            if (rRev && rRev.length > 0) setRecentRevisions(rRev);
            if (rRoles && rRoles.length > 0) setRoleAnalytics(rRoles);
            if (dDepts && dDepts.length > 0) setDepartments(dDepts);
            if (cCounts && cCounts.length > 0) setCountries(cCounts);
            if (pProfile) setHrUser(pProfile);
          }).catch(() => {});
        }, 3500);
      }
      setRecentRevisions(recRev);
      setRoleAnalytics(roles);
      setDepartments(depts);
      setCountries(counts);
      if (profile) setHrUser(profile);
    } catch (err) {
      console.error('Error loading initial data', err);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  // Fetch employees list based on filters and pagination
  const fetchEmployeesList = useCallback(async (page = 0, currentFilters = filters) => {
    try {
      const res = await api.getEmployees({
        page,
        size: 10,
        keyword: currentFilters.keyword,
        department: currentFilters.department,
        country: currentFilters.country,
        status: currentFilters.status,
        minSalary: currentFilters.minSalary,
        maxSalary: currentFilters.maxSalary,
        sortBy: currentFilters.sortBy,
        sortDirection: currentFilters.sortDirection,
      });

      setEmployees(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 0);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated) {
      loadInitialData();
    }
  }, [isAuthenticated, loadInitialData]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEmployeesList(currentPage, filters);
    }
  }, [isAuthenticated, currentPage, filters, fetchEmployeesList]);

  // Auth session handlers
  const handleLogin = (user: HRUser) => {
    localStorage.setItem('comppulse_is_authenticated', 'true');
    localStorage.setItem('comppulse_auth_user', JSON.stringify(user));
    setHrUser(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name}! CompPulse session authenticated.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('comppulse_is_authenticated');
    localStorage.removeItem('comppulse_auth_user');
    setIsAuthenticated(false);
    showToast('Signed out of CompPulse session.', 'success');
  };

  // Handle salary revision submission
  const handleSalaryRevision = async (employeeId: number, req: SalaryRevisionRequest) => {
    await api.reviseSalary(employeeId, req);
    showToast(`Salary revision successfully applied and logged for employee EMP-${employeeId}!`, 'success');
    
    // Refresh all affected states
    await Promise.all([
      fetchEmployeesList(currentPage, filters),
      api.getDashboardSummary().then(setSummary),
      api.getRecentRevisions().then(setRecentRevisions),
    ]);
  };

  // Handle employee creation
  const handleCreateEmployee = async (req: EmployeeCreateRequest) => {
    await api.createEmployee(req);
    showToast(`Employee profile for ${req.firstName} ${req.lastName} successfully created!`, 'success');
    
    await Promise.all([
      fetchEmployeesList(0, filters),
      api.getDashboardSummary().then(setSummary),
      api.getDepartments().then(setDepartments),
      api.getCountries().then(setCountries),
    ]);
  };

  // Handle employee profile update
  const handleUpdateEmployee = async (id: number, req: EmployeeUpdateRequest) => {
    await api.updateEmployee(id, req);
    showToast(`Employee profile updated successfully!`, 'success');
    
    await Promise.all([
      fetchEmployeesList(currentPage, filters),
      api.getDashboardSummary().then(setSummary),
    ]);
  };

  // Handle employee deletion
  const handleDeleteEmployee = async (emp: Employee) => {
    if (!window.confirm(`Are you sure you want to remove ${emp.firstName} ${emp.lastName} (${emp.employeeCode})? This will be permanently recorded in the audit trail.`)) {
      return;
    }

    try {
      await api.deleteEmployee(emp.id);
      showToast(`Employee profile ${emp.employeeCode} has been removed.`, 'success');
      
      await Promise.all([
        fetchEmployeesList(currentPage, filters),
        api.getDashboardSummary().then(setSummary),
      ]);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete employee', 'error');
    }
  };

  // Handle CSV export (supports all records or active filter criteria)
  const handleExportCsv = async (applyCurrentFilters = false) => {
    try {
      setIsExporting(true);
      const hasActiveFilters = Boolean(
        filters.keyword ||
        filters.department ||
        filters.country ||
        filters.status ||
        (filters.minSalary && filters.minSalary > 0) ||
        (filters.maxSalary && filters.maxSalary > 0)
      );

      const shouldFilter = applyCurrentFilters || (activeTab === 'employees' && hasActiveFilters);
      const url = shouldFilter ? api.getCsvExportUrl(filters) : api.getCsvExportUrl();

      window.location.href = url;
      const countNotice = shouldFilter ? `matching filtered records (${totalElements} employees)` : 'all employees';
      showToast(`Compensation roster CSV generated for ${countNotice}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'CSV Export failed', 'error');
    } finally {
      setTimeout(() => setIsExporting(false), 1500);
    }
  };

  // Deep linking from dashboard cards into filtered employee directory
  const handleNavigateToEmployeesWithFilter = (targetFilter?: { department?: string; country?: string }) => {
    if (targetFilter) {
      setFilters(prev => ({
        ...prev,
        department: targetFilter.department || '',
        country: targetFilter.country || '',
      }));
    }
    setActiveTab('employees');
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 2000,
            background: toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            animation: 'slideUp 0.2s ease-out',
          }}>
            {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{toastMessage.text}</span>
          </div>
        )}
        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hrUser={hrUser}
        onOpenCreateEmployee={() => {
          setEmployeeToEdit(null);
          setIsEmployeeModalOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '84px',
          right: '24px',
          zIndex: 2000,
          background: toastMessage.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
          animation: 'slideUp 0.2s ease-out',
        }}>
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '28px 24px 60px 24px',
      }}>
        {activeTab === 'dashboard' && (
          <DashboardOverview
            summary={summary}
            recentRevisions={recentRevisions}
            roleAnalytics={roleAnalytics}
            onNavigateToEmployees={handleNavigateToEmployeesWithFilter}
            onOpenRevisionForEmployee={async (empId) => {
              let target = employees.find(e => e.id === empId);
              if (!target) {
                try {
                  target = await api.getEmployeeById(empId);
                } catch (e) {
                  console.error('Failed to get employee details', e);
                }
              }
              if (target) setSelectedForRevision(target);
            }}
            onOpenHistoryForEmployee={async (empId) => {
              let target = employees.find(e => e.id === empId);
              if (!target) {
                try {
                  target = await api.getEmployeeById(empId);
                } catch (e) {
                  console.error('Failed to get employee details', e);
                }
              }
              if (target) setSelectedForHistory(target);
            }}
            onRetry={() => {
              loadInitialData();
              fetchEmployeesList(currentPage, filters);
            }}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeeList
            employees={employees}
            totalElements={totalElements}
            totalPages={totalPages}
            currentPage={currentPage}
            departments={departments}
            countries={countries}
            initialDeptFilter={filters.department}
            initialCountryFilter={filters.country}
            onPageChange={(page) => setCurrentPage(page)}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(0);
            }}
            onOpenRevision={(emp) => setSelectedForRevision(emp)}
            onOpenHistory={(emp) => setSelectedForHistory(emp)}
            onOpenEdit={(emp) => {
              setEmployeeToEdit(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onExportFiltered={() => handleExportCsv(true)}
            isExporting={isExporting}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogsView />
        )}
      </main>

      {/* Salary Revision Modal */}
      {selectedForRevision && (
        <SalaryRevisionModal
          employee={selectedForRevision}
          isOpen={!!selectedForRevision}
          onClose={() => setSelectedForRevision(null)}
          onSubmit={handleSalaryRevision}
        />
      )}

      {/* Salary History Drawer */}
      {selectedForHistory && (
        <SalaryHistoryDrawer
          employee={selectedForHistory}
          isOpen={!!selectedForHistory}
          onClose={() => setSelectedForHistory(null)}
          onOpenRevisionModal={(emp) => {
            setSelectedForHistory(null);
            setSelectedForRevision(emp);
          }}
        />
      )}

      {/* Employee Create / Edit Modal */}
      {isEmployeeModalOpen && (
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => {
            setIsEmployeeModalOpen(false);
            setEmployeeToEdit(null);
          }}
          onSubmitCreate={handleCreateEmployee}
          onSubmitUpdate={handleUpdateEmployee}
          employeeToEdit={employeeToEdit}
          departments={departments}
          countries={countries}
        />
      )}

    </div>
  );
};

export default App;
