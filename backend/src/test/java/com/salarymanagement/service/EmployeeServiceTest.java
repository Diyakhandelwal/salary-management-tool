package com.salarymanagement.service;

import com.salarymanagement.dto.EmployeeCreateRequest;
import com.salarymanagement.dto.EmployeeUpdateRequest;
import com.salarymanagement.model.Employee;
import com.salarymanagement.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private EmployeeService employeeService;

    private EmployeeCreateRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = new EmployeeCreateRequest();
        validRequest.setEmployeeCode("EMP-2001");
        validRequest.setFirstName("Alex");
        validRequest.setLastName("Mercer");
        validRequest.setEmail("alex.mercer@company.com");
        validRequest.setJobTitle("Staff Software Engineer");
        validRequest.setDepartment("Engineering");
        validRequest.setOrganization("Acme Global");
        validRequest.setCountry("United States");
        validRequest.setCurrency("USD");
        validRequest.setStatus("ACTIVE");
        validRequest.setHireDate(LocalDate.now().minusDays(5));
        validRequest.setBaseSalary(new BigDecimal("140000.00"));
        validRequest.setVariableBonus(new BigDecimal("20000.00"));
    }

    @Test
    @DisplayName("createEmployee: Successfully creates employee with computed totalCompensation")
    void createEmployee_success() {
        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> {
            Employee e = i.getArgument(0);
            e.setId(50L);
            return e;
        });

        Employee created = employeeService.createEmployee(validRequest);

        assertThat(created).isNotNull();
        assertThat(created.getEmployeeCode()).isEqualTo("EMP-2001");
        assertThat(created.getBaseSalary()).isEqualByComparingTo(new BigDecimal("140000.00"));
        assertThat(created.getVariableBonus()).isEqualByComparingTo(new BigDecimal("20000.00"));
        // Total compensation must be base + bonus
        assertThat(created.getTotalCompensation()).isEqualByComparingTo(new BigDecimal("160000.00"));
        assertThat(created.getStatus()).isEqualTo("ACTIVE");

        verify(employeeRepository).save(any(Employee.class));
        verify(auditService).logAction(eq("EMPLOYEE"), eq(50L), eq("CREATE_EMPLOYEE"), eq("HR Manager"), anyString(), anyString());
    }

    @Test
    @DisplayName("createEmployee: Edge Case - Future hire date must be ONBOARDING, throws if ACTIVE")
    void createEmployee_futureHireDate_throwsIfActive() {
        validRequest.setHireDate(LocalDate.now().plusDays(10));
        validRequest.setStatus("ACTIVE");

        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("future start date")
                .hasMessageContaining("future hires must be marked as 'ONBOARDING'");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    @DisplayName("createEmployee: Edge Case - Future hire date succeeds when status is ONBOARDING")
    void createEmployee_futureHireDate_succeedsWhenOnboarding() {
        validRequest.setHireDate(LocalDate.now().plusDays(10));
        validRequest.setStatus("ONBOARDING");

        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));

        Employee created = employeeService.createEmployee(validRequest);
        assertThat(created.getStatus()).isEqualTo("ONBOARDING");
    }

    @Test
    @DisplayName("createEmployee: Edge Case - Past hire date (>14 days) cannot remain ONBOARDING")
    void createEmployee_pastHireDate_throwsIfOnboarding() {
        validRequest.setHireDate(LocalDate.now().minusDays(30));
        validRequest.setStatus("ONBOARDING");

        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("start date")
                .hasMessageContaining("Status cannot remain 'ONBOARDING'");
    }

    @Test
    @DisplayName("createEmployee: Throws exception when employeeCode already exists")
    void createEmployee_throwsIfDuplicateCode() {
        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Employee code already exists");

        verify(employeeRepository, never()).save(any());
    }

    @Test
    @DisplayName("createEmployee: Throws exception when email already registered")
    void createEmployee_throwsIfDuplicateEmail() {
        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(true);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already registered");
    }

    @Test
    @DisplayName("createEmployee: Throws exception when starting base salary is <= 0")
    void createEmployee_throwsIfBaseSalaryZeroOrNegative() {
        validRequest.setBaseSalary(BigDecimal.ZERO);

        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Starting base salary must be greater than zero");
    }

    @Test
    @DisplayName("createEmployee: Throws exception when variable bonus is negative")
    void createEmployee_throwsIfBonusNegative() {
        validRequest.setVariableBonus(new BigDecimal("-500.00"));

        when(employeeRepository.existsByEmployeeCode("EMP-2001")).thenReturn(false);
        when(employeeRepository.existsByEmail("alex.mercer@company.com")).thenReturn(false);

        assertThatThrownBy(() -> employeeService.createEmployee(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Variable bonus cannot be negative");
    }

    @Test
    @DisplayName("deleteEmployee: Successfully deletes employee and logs audit record")
    void deleteEmployee_success() {
        Employee emp = new Employee();
        emp.setId(10L);
        emp.setEmployeeCode("EMP-10");
        emp.setFirstName("John");
        emp.setLastName("Doe");

        when(employeeRepository.findById(10L)).thenReturn(Optional.of(emp));

        employeeService.deleteEmployee(10L);

        verify(employeeRepository).delete(emp);
        verify(auditService).logAction(eq("EMPLOYEE"), eq(10L), eq("DELETE_EMPLOYEE"), eq("HR Manager"), anyString(), anyString());
    }

    @Test
    @DisplayName("deleteEmployee: Throws exception when employee not found")
    void deleteEmployee_notFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employeeService.deleteEmployee(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Employee not found with id: 99");

        verify(employeeRepository, never()).delete(any());
    }
}
