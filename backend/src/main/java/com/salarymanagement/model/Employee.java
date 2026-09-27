package com.salarymanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_code", columnList = "employeeCode", unique = true),
    @Index(name = "idx_emp_dept", columnList = "department"),
    @Index(name = "idx_emp_country", columnList = "country")
})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee code is required")
    @Column(nullable = false, unique = true, length = 32)
    private String employeeCode;

    @NotBlank(message = "First name is required")
    @Column(nullable = false, length = 64)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Column(nullable = false, length = 64)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true, length = 128)
    private String email;

    @NotBlank(message = "Job title is required")
    @Column(nullable = false, length = 128)
    private String jobTitle;

    @NotBlank(message = "Department is required")
    @Column(nullable = false, length = 64)
    private String department;

    @NotBlank(message = "Organization is required")
    @Column(nullable = false, length = 128)
    private String organization;

    @NotBlank(message = "Country is required")
    @Column(nullable = false, length = 64)
    private String country;

    @NotBlank(message = "Currency is required")
    @Column(nullable = false, length = 8)
    private String currency;

    @Column(length = 128)
    private String managerName;

    @Column(nullable = false, length = 32)
    private String status = "ACTIVE"; // ACTIVE, ON_LEAVE, TERMINATED

    @NotNull(message = "Hire date is required")
    private LocalDate hireDate;

    @NotNull(message = "Base salary is required")
    @PositiveOrZero(message = "Base salary must be non-negative")
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal baseSalary;

    @PositiveOrZero(message = "Variable bonus must be non-negative")
    @Column(precision = 14, scale = 2)
    private BigDecimal variableBonus = BigDecimal.ZERO;

    @Column(precision = 14, scale = 2)
    private BigDecimal totalCompensation;

    private LocalDate lastRevisionDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Employee() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        recalculateTotalCompensation();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
        recalculateTotalCompensation();
    }

    public void recalculateTotalCompensation() {
        BigDecimal base = this.baseSalary != null ? this.baseSalary : BigDecimal.ZERO;
        BigDecimal bonus = this.variableBonus != null ? this.variableBonus : BigDecimal.ZERO;
        this.totalCompensation = base.add(bonus);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public BigDecimal getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(BigDecimal baseSalary) {
        this.baseSalary = baseSalary;
        recalculateTotalCompensation();
    }

    public BigDecimal getVariableBonus() {
        return variableBonus;
    }

    public void setVariableBonus(BigDecimal variableBonus) {
        this.variableBonus = variableBonus;
        recalculateTotalCompensation();
    }

    public BigDecimal getTotalCompensation() {
        return totalCompensation;
    }

    public void setTotalCompensation(BigDecimal totalCompensation) {
        this.totalCompensation = totalCompensation;
    }

    public LocalDate getLastRevisionDate() {
        return lastRevisionDate;
    }

    public void setLastRevisionDate(LocalDate lastRevisionDate) {
        this.lastRevisionDate = lastRevisionDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
