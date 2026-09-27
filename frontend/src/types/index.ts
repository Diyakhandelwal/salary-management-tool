export interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  organization: string;
  country: string;
  currency: string;
  managerName?: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'ON_LEAVE' | 'TERMINATED';
  hireDate: string;
  baseSalary: number;
  variableBonus: number;
  totalCompensation: number;
  lastRevisionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryRevision {
  id: number;
  employeeId: number;
  previousBaseSalary: number;
  newBaseSalary: number;
  previousBonus: number;
  newBonus: number;
  percentageChange: number;
  effectiveDate: string;
  revisionReason: string;
  approvedBy: string;
  notes?: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  actor: string;
  summary: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface DepartmentAnalytics {
  department: string;
  employeeCount: number;
  totalExpenditure: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface CountryAnalytics {
  country: string;
  employeeCount: number;
  totalExpenditure: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface RoleAnalytics {
  role: string;
  employeeCount: number;
  averageSalary: number;
  minSalary: number;
  maxSalary: number;
}

export interface SalaryBand {
  bandLabel: string;
  minRange: number;
  maxRange: number;
  employeeCount: number;
  percentage: number;
}

export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  totalAnnualPayroll: number;
  averageSalary: number;
  medianSalary: number;
  minSalary: number;
  maxSalary: number;
  departmentCount: number;
  countryCount: number;
  departmentBreakdown: DepartmentAnalytics[];
  countryBreakdown: CountryAnalytics[];
  salaryDistribution: SalaryBand[];
}

export interface EmployeeCreateRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  organization: string;
  country: string;
  currency: string;
  managerName?: string;
  status: string;
  hireDate: string;
  baseSalary: number;
  variableBonus: number;
}

export interface EmployeeUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: string;
  organization: string;
  country: string;
  managerName?: string;
  status: string;
  hireDate?: string;
}

export interface SalaryRevisionRequest {
  newBaseSalary: number;
  newBonus: number;
  effectiveDate: string;
  revisionReason: string;
  notes?: string;
  approvedBy?: string;
}

export interface HRUser {
  id: number;
  name: string;
  email: string;
  role: string;
  title: string;
  organization: string;
  permissions: string[];
}
