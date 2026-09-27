package com.salarymanagement.service;

import com.salarymanagement.dto.SalaryRevisionRequest;
import com.salarymanagement.model.Employee;
import com.salarymanagement.model.SalaryRevision;
import com.salarymanagement.repository.EmployeeRepository;
import com.salarymanagement.repository.SalaryRevisionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class SalaryService {

    private final EmployeeRepository employeeRepository;
    private final SalaryRevisionRepository salaryRevisionRepository;
    private final AuditService auditService;

    public SalaryService(EmployeeRepository employeeRepository,
                         SalaryRevisionRepository salaryRevisionRepository,
                         AuditService auditService) {
        this.employeeRepository = employeeRepository;
        this.salaryRevisionRepository = salaryRevisionRepository;
        this.auditService = auditService;
    }

    public SalaryRevision reviseSalary(Long employeeId, SalaryRevisionRequest request) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + employeeId));

        if ("TERMINATED".equalsIgnoreCase(employee.getStatus())) {
            throw new IllegalStateException("Cannot revise compensation for a TERMINATED employee (" + employee.getEmployeeCode() + ").");
        }

        if (request.getEffectiveDate() != null && employee.getHireDate() != null) {
            if (request.getEffectiveDate().isBefore(employee.getHireDate())) {
                throw new IllegalArgumentException("Salary revision effective date (" + request.getEffectiveDate() +
                        ") cannot precede the employee hire date (" + employee.getHireDate() + ").");
            }
        }

        if (request.getNewBaseSalary() == null || request.getNewBaseSalary().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("New base salary must be greater than zero.");
        }
        if (request.getNewBonus() != null && request.getNewBonus().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("New variable bonus cannot be negative.");
        }

        BigDecimal prevBase = employee.getBaseSalary();
        BigDecimal prevBonus = employee.getVariableBonus() != null ? employee.getVariableBonus() : BigDecimal.ZERO;
        BigDecimal newBase = request.getNewBaseSalary();
        BigDecimal newBonus = request.getNewBonus() != null ? request.getNewBonus() : BigDecimal.ZERO;

        // Calculate percentage change based on base salary
        Double percentageChange = 0.0;
        if (prevBase != null && prevBase.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal diff = newBase.subtract(prevBase);
            percentageChange = diff.multiply(BigDecimal.valueOf(100))
                    .divide(prevBase, 2, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        SalaryRevision revision = new SalaryRevision();
        revision.setEmployeeId(employee.getId());
        revision.setPreviousBaseSalary(prevBase);
        revision.setNewBaseSalary(newBase);
        revision.setPreviousBonus(prevBonus);
        revision.setNewBonus(newBonus);
        revision.setPercentageChange(percentageChange);
        revision.setEffectiveDate(request.getEffectiveDate());
        revision.setRevisionReason(request.getRevisionReason());
        revision.setApprovedBy(request.getApprovedBy() != null ? request.getApprovedBy() : "HR Manager");
        revision.setNotes(request.getNotes());

        SalaryRevision savedRevision = salaryRevisionRepository.save(revision);

        // Update employee's current salary and revision date
        employee.setBaseSalary(newBase);
        employee.setVariableBonus(newBonus);
        employee.setLastRevisionDate(request.getEffectiveDate());
        employeeRepository.save(employee);

        // Audit log
        auditService.logAction(
                "SALARY_REVISION",
                savedRevision.getId(),
                "UPDATE_SALARY",
                revision.getApprovedBy(),
                "Salary revision for " + employee.getFirstName() + " " + employee.getLastName() + " (" + employee.getEmployeeCode() + ")",
                String.format("Base: %s %s -> %s %s (%+.2f%%) | Reason: %s | Effective: %s",
                        employee.getCurrency(), prevBase, employee.getCurrency(), newBase, percentageChange,
                        revision.getRevisionReason(), revision.getEffectiveDate())
        );

        return savedRevision;
    }

    @Transactional(readOnly = true)
    public List<SalaryRevision> getRevisionHistory(Long employeeId) {
        // verify employee exists
        if (!employeeRepository.existsById(employeeId)) {
            throw new IllegalArgumentException("Employee not found with id: " + employeeId);
        }
        return salaryRevisionRepository.findByEmployeeIdOrderByEffectiveDateDesc(employeeId);
    }

    @Transactional(readOnly = true)
    public List<SalaryRevision> getRecentRevisions() {
        return salaryRevisionRepository.findTop10ByOrderByCreatedAtDesc();
    }
}
