import {
  Employee,
  SalaryRevision,
  AuditLog,
  DashboardSummary,
  RoleAnalytics,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  SalaryRevisionRequest,
  HRUser,
} from '../types';
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) {
    return 'http://localhost:8080/api';
  }
  let url = envUrl.trim();
  // If Render passed an internal service name without domain (e.g. salary-management-backend-ec7l)
  if (!url.includes('.') && !url.includes('localhost')) {
    url = `${url}.onrender.com`;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
}

const API_BASE_URL = getApiBaseUrl();
const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-HR-User-Role': 'HR_MANAGER',
};

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || errorBody.error || `HTTP error ${res.status}`);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export const api = {
  // Employee endpoints
  async getEmployees(params?: {
    keyword?: string;
    department?: string;
    country?: string;
    status?: string;
    minSalary?: number;
    maxSalary?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: string;
  }): Promise<{ content: Employee[]; totalPages: number; totalElements: number; number: number }> {
    const query = new URLSearchParams();
    if (params?.keyword) query.set('keyword', params.keyword);
    if (params?.department) query.set('department', params.department);
    if (params?.country) query.set('country', params.country);
    if (params?.status) query.set('status', params.status);
    if (params?.minSalary !== undefined && params.minSalary > 0) query.set('minSalary', params.minSalary.toString());
    if (params?.maxSalary !== undefined && params.maxSalary > 0) query.set('maxSalary', params.maxSalary.toString());
    if (params?.page !== undefined) query.set('page', params.page.toString());
    if (params?.size !== undefined) query.set('size', params.size.toString());
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.sortDirection) query.set('sortDirection', params.sortDirection);

    const res = await fetch(`${API_BASE_URL}/employees?${query.toString()}`, {
      headers: defaultHeaders,
    });
    return handleResponse(res);
  },

  async getAllEmployees(): Promise<Employee[]> {
    const res = await fetch(`${API_BASE_URL}/employees/all`, {
      headers: defaultHeaders,
    });
    return handleResponse<Employee[]>(res);
  },

  async getEmployeeById(id: number): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      headers: defaultHeaders,
    });
    return handleResponse<Employee>(res);
  },

  async createEmployee(data: EmployeeCreateRequest): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
    return handleResponse<Employee>(res);
  },

  async updateEmployee(id: number, data: EmployeeUpdateRequest): Promise<Employee> {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
    return handleResponse<Employee>(res);
  },

  async deleteEmployee(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: defaultHeaders,
    });
    return handleResponse<void>(res);
  },

  async getDepartments(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/employees/departments`, {
      headers: defaultHeaders,
    });
    return handleResponse<string[]>(res);
  },

  async getCountries(): Promise<string[]> {
    const res = await fetch(`${API_BASE_URL}/employees/countries`, {
      headers: defaultHeaders,
    });
    return handleResponse<string[]>(res);
  },

  // Salary revision endpoints
  async reviseSalary(employeeId: number, data: SalaryRevisionRequest): Promise<SalaryRevision> {
    const res = await fetch(`${API_BASE_URL}/salaries/employees/${employeeId}/revise`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });
    return handleResponse<SalaryRevision>(res);
  },

  async getSalaryHistory(employeeId: number): Promise<SalaryRevision[]> {
    const res = await fetch(`${API_BASE_URL}/salaries/employees/${employeeId}/history`, {
      headers: defaultHeaders,
    });
    return handleResponse<SalaryRevision[]>(res);
  },

  async getRecentRevisions(): Promise<SalaryRevision[]> {
    const res = await fetch(`${API_BASE_URL}/salaries/recent-revisions`, {
      headers: defaultHeaders,
    });
    return handleResponse<SalaryRevision[]>(res);
  },

  // Analytics endpoints
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: defaultHeaders,
    });
    return handleResponse<DashboardSummary>(res);
  },

  async getRoleAnalytics(): Promise<RoleAnalytics[]> {
    const res = await fetch(`${API_BASE_URL}/analytics/roles`, {
      headers: defaultHeaders,
    });
    return handleResponse<RoleAnalytics[]>(res);
  },

  getCsvExportUrl(filters?: {
    keyword?: string;
    department?: string;
    country?: string;
    status?: string;
    minSalary?: number;
    maxSalary?: number;
  }): string {
    const query = new URLSearchParams();
    if (filters?.keyword) query.set('keyword', filters.keyword);
    if (filters?.department) query.set('department', filters.department);
    if (filters?.country) query.set('country', filters.country);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.minSalary !== undefined && filters.minSalary > 0) query.set('minSalary', filters.minSalary.toString());
    if (filters?.maxSalary !== undefined && filters.maxSalary > 0) query.set('maxSalary', filters.maxSalary.toString());

    const qs = query.toString();
    return qs ? `${API_BASE_URL}/analytics/export/csv?${qs}` : `${API_BASE_URL}/analytics/export/csv`;
  },

  // Audit Logs endpoints
  async getAuditLogs(page = 0, size = 15): Promise<{ content: AuditLog[]; totalPages: number; totalElements: number }> {
    const res = await fetch(`${API_BASE_URL}/audit-logs?page=${page}&size=${size}`, {
      headers: defaultHeaders,
    });
    return handleResponse(res);
  },

  // Auth / Persona
  async getHRProfile(): Promise<HRUser> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: defaultHeaders,
    });
    return handleResponse<HRUser>(res);
  },
};
