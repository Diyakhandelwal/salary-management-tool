package com.salarymanagement.service;

import com.salarymanagement.dto.EmployeeCreateRequest;
import com.salarymanagement.dto.EmployeeUpdateRequest;
import com.salarymanagement.model.Employee;
import com.salarymanagement.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final AuditService auditService;

    public EmployeeService(EmployeeRepository employeeRepository, AuditService auditService) {
        this.employeeRepository = employeeRepository;
        this.auditService = auditService;
    }

    @Transactional(readOnly = true)
    public Page<Employee> searchEmployees(String keyword, String department, String country, String status,
                                          BigDecimal minSalary, BigDecimal maxSalary,
                                          int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by("asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC,
                (sortBy == null || sortBy.isBlank()) ? "id" : sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return employeeRepository.searchEmployees(keyword, department, country, status, minSalary, maxSalary, pageable);
    }

    @Transactional(readOnly = true)
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
    }

    public Employee createEmployee(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + request.getEmployeeCode());
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        Employee emp = new Employee();
        emp.setEmployeeCode(request.getEmployeeCode().trim().toUpperCase());
        emp.setFirstName(request.getFirstName().trim());
        emp.setLastName(request.getLastName().trim());
        emp.setEmail(request.getEmail().trim().toLowerCase());
        emp.setJobTitle(request.getJobTitle().trim());
        emp.setDepartment(request.getDepartment().trim());
        emp.setOrganization(request.getOrganization().trim());
        emp.setCountry(request.getCountry().trim());
        emp.setCurrency(request.getCurrency() != null ? request.getCurrency().trim().toUpperCase() : "USD");
        emp.setManagerName(request.getManagerName());
        emp.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");
        emp.setHireDate(request.getHireDate());
        emp.setBaseSalary(request.getBaseSalary());
        emp.setVariableBonus(request.getVariableBonus() != null ? request.getVariableBonus() : BigDecimal.ZERO);
        emp.setLastRevisionDate(request.getHireDate());

        Employee saved = employeeRepository.save(emp);

        auditService.logAction(
                "EMPLOYEE",
                saved.getId(),
                "CREATE_EMPLOYEE",
                "HR Manager",
                "Created employee profile: " + saved.getFirstName() + " " + saved.getLastName() + " (" + saved.getEmployeeCode() + ")",
                "Base Salary: " + saved.getCurrency() + " " + saved.getBaseSalary() + ", Dept: " + saved.getDepartment()
        );

        return saved;
    }

    public Employee updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee emp = getEmployeeById(id);

        if (!emp.getEmail().equalsIgnoreCase(request.getEmail()) && employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        String oldDetails = "Dept: " + emp.getDepartment() + ", Role: " + emp.getJobTitle() + ", Status: " + emp.getStatus();

        emp.setFirstName(request.getFirstName().trim());
        emp.setLastName(request.getLastName().trim());
        emp.setEmail(request.getEmail().trim().toLowerCase());
        emp.setJobTitle(request.getJobTitle().trim());
        emp.setDepartment(request.getDepartment().trim());
        emp.setOrganization(request.getOrganization().trim());
        emp.setCountry(request.getCountry().trim());
        if (request.getManagerName() != null) emp.setManagerName(request.getManagerName().trim());
        if (request.getStatus() != null) emp.setStatus(request.getStatus().trim());
        if (request.getHireDate() != null) emp.setHireDate(request.getHireDate());

        Employee updated = employeeRepository.save(emp);

        String newDetails = "Dept: " + updated.getDepartment() + ", Role: " + updated.getJobTitle() + ", Status: " + updated.getStatus();

        auditService.logAction(
                "EMPLOYEE",
                updated.getId(),
                "UPDATE_PROFILE",
                "HR Manager",
                "Updated employee details for " + updated.getFirstName() + " " + updated.getLastName(),
                "Before: [" + oldDetails + "] | After: [" + newDetails + "]"
        );

        return updated;
    }

    public void deleteEmployee(Long id) {
        Employee emp = getEmployeeById(id);
        employeeRepository.delete(emp);

        auditService.logAction(
                "EMPLOYEE",
                id,
                "DELETE_EMPLOYEE",
                "HR Manager",
                "Deleted employee profile: " + emp.getFirstName() + " " + emp.getLastName() + " (" + emp.getEmployeeCode() + ")",
                "Final Salary: " + emp.getBaseSalary() + ", Dept: " + emp.getDepartment()
        );
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctDepartments() {
        return employeeRepository.findDistinctDepartments();
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctCountries() {
        return employeeRepository.findDistinctCountries();
    }
}
