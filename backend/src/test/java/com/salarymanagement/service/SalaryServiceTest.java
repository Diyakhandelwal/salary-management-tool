package com.salarymanagement.service;

import com.salarymanagement.dto.SalaryRevisionRequest;
import com.salarymanagement.model.Employee;
import com.salarymanagement.model.SalaryRevision;
import com.salarymanagement.repository.EmployeeRepository;
import com.salarymanagement.repository.SalaryRevisionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalaryServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private SalaryRevisionRepository salaryRevisionRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private SalaryService salaryService;

    private Employee employee;

    @BeforeEach
    void setUp() {
        employee = new Employee();
        employee.setId(1L);
        employee.setEmployeeCode("EMP-1001");
        employee.setFirstName("Sarah");
        employee.setLastName("Connor");
        employee.setStatus("ACTIVE");
        employee.setCurrency("USD");
        employee.setBaseSalary(new BigDecimal("100000.00"));
        employee.setVariableBonus(new BigDecimal("15000.00"));
        employee.setTotalCompensation(new BigDecimal("115000.00"));
        employee.setHireDate(LocalDate.of(2023, 1, 15));
    }

    @Test
    @DisplayName("reviseSalary: Successfully applies compensation increase and updates percentage change")
    void reviseSalary_success_increase() {
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(new BigDecimal("120000.00"));
        request.setNewBonus(new BigDecimal("20000.00"));
        request.setEffectiveDate(LocalDate.of(2025, 4, 1));
        request.setRevisionReason("Annual Performance Review");
        request.setApprovedBy("Elena Vance");
        request.setNotes("Top tier performance");

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));
        when(salaryRevisionRepository.save(any(SalaryRevision.class))).thenAnswer(invocation -> {
            SalaryRevision r = invocation.getArgument(0);
            r.setId(10L);
            return r;
        });

        SalaryRevision result = salaryService.reviseSalary(1L, request);

        assertThat(result).isNotNull();
        assertThat(result.getPreviousBaseSalary()).isEqualByComparingTo(new BigDecimal("100000.00"));
        assertThat(result.getNewBaseSalary()).isEqualByComparingTo(new BigDecimal("120000.00"));
        // 20% increase
        assertThat(result.getPercentageChange()).isEqualTo(20.00);
        assertThat(result.getEffectiveDate()).isEqualTo(LocalDate.of(2025, 4, 1));
        assertThat(result.getApprovedBy()).isEqualTo("Elena Vance");

        // Verify employee state updated
        assertThat(employee.getBaseSalary()).isEqualByComparingTo(new BigDecimal("120000.00"));
        assertThat(employee.getVariableBonus()).isEqualByComparingTo(new BigDecimal("20000.00"));
        assertThat(employee.getLastRevisionDate()).isEqualTo(LocalDate.of(2025, 4, 1));

        verify(employeeRepository).save(employee);
        verify(auditService).logAction(eq("SALARY_REVISION"), eq(10L), eq("UPDATE_SALARY"), eq("Elena Vance"), anyString(), anyString());
    }

    @Test
    @DisplayName("reviseSalary: Throws exception when employee does not exist")
    void reviseSalary_throwsWhenEmployeeNotFound() {
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(new BigDecimal("110000.00"));

        when(employeeRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> salaryService.reviseSalary(999L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Employee not found with id: 999");

        verifyNoInteractions(salaryRevisionRepository);
    }

    @Test
    @DisplayName("reviseSalary: Throws exception when employee status is TERMINATED")
    void reviseSalary_throwsWhenEmployeeTerminated() {
        employee.setStatus("TERMINATED");
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(new BigDecimal("110000.00"));

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> salaryService.reviseSalary(1L, request))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Cannot revise compensation for a TERMINATED employee");

        verifyNoInteractions(salaryRevisionRepository);
    }

    @Test
    @DisplayName("reviseSalary: Throws exception when effective date precedes hire date")
    void reviseSalary_throwsWhenEffectiveDateBeforeHireDate() {
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(new BigDecimal("110000.00"));
        request.setEffectiveDate(LocalDate.of(2022, 1, 1)); // hireDate is 2023-01-15

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> salaryService.reviseSalary(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot precede the employee hire date");

        verifyNoInteractions(salaryRevisionRepository);
    }

    @Test
    @DisplayName("reviseSalary: Throws exception when new base salary is zero or negative")
    void reviseSalary_throwsWhenBaseSalaryZeroOrNegative() {
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(BigDecimal.ZERO);
        request.setEffectiveDate(LocalDate.of(2025, 1, 1));

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> salaryService.reviseSalary(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("New base salary must be greater than zero");

        request.setNewBaseSalary(new BigDecimal("-5000.00"));
        assertThatThrownBy(() -> salaryService.reviseSalary(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("New base salary must be greater than zero");
    }

    @Test
    @DisplayName("reviseSalary: Throws exception when new bonus is negative")
    void reviseSalary_throwsWhenBonusNegative() {
        SalaryRevisionRequest request = new SalaryRevisionRequest();
        request.setNewBaseSalary(new BigDecimal("120000.00"));
        request.setNewBonus(new BigDecimal("-100.00"));
        request.setEffectiveDate(LocalDate.of(2025, 1, 1));

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(employee));

        assertThatThrownBy(() -> salaryService.reviseSalary(1L, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("New variable bonus cannot be negative");
    }

    @Test
    @DisplayName("getRevisionHistory: Returns revision list ordered by effective date desc")
    void getRevisionHistory_success() {
        SalaryRevision r1 = new SalaryRevision();
        r1.setId(101L);
        r1.setEmployeeId(1L);
        r1.setEffectiveDate(LocalDate.of(2025, 1, 1));

        when(employeeRepository.existsById(1L)).thenReturn(true);
        when(salaryRevisionRepository.findByEmployeeIdOrderByEffectiveDateDesc(1L)).thenReturn(List.of(r1));

        List<SalaryRevision> history = salaryService.getRevisionHistory(1L);
        assertThat(history).hasSize(1);
        assertThat(history.get(0).getId()).isEqualTo(101L);
    }

    @Test
    @DisplayName("getRevisionHistory: Throws exception when employee does not exist")
    void getRevisionHistory_throwsWhenEmployeeNotFound() {
        when(employeeRepository.existsById(888L)).thenReturn(false);

        assertThatThrownBy(() -> salaryService.getRevisionHistory(888L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Employee not found with id: 888");
    }
}
