package com.salarymanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_revisions", indexes = {
    @Index(name = "idx_rev_employee", columnList = "employeeId"),
    @Index(name = "idx_rev_date", columnList = "effectiveDate")
})
public class SalaryRevision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long employeeId;

    @Column(precision = 14, scale = 2)
    private BigDecimal previousBaseSalary;

    @NotNull
    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal newBaseSalary;

    @Column(precision = 14, scale = 2)
    private BigDecimal previousBonus;

    @Column(precision = 14, scale = 2)
    private BigDecimal newBonus;

    @Column
    private Double percentageChange;

    @NotNull
    @Column(nullable = false)
    private LocalDate effectiveDate;

    @Column(length = 128)
    private String revisionReason; // Annual Merit Review, Promotion, Market Adjustment, Retention, etc.

    @Column(length = 128)
    private String approvedBy = "HR Manager";

    @Column(length = 512)
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public SalaryRevision() {
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public BigDecimal getPreviousBaseSalary() {
        return previousBaseSalary;
    }

    public void setPreviousBaseSalary(BigDecimal previousBaseSalary) {
        this.previousBaseSalary = previousBaseSalary;
    }

    public BigDecimal getNewBaseSalary() {
        return newBaseSalary;
    }

    public void setNewBaseSalary(BigDecimal newBaseSalary) {
        this.newBaseSalary = newBaseSalary;
    }

    public BigDecimal getPreviousBonus() {
        return previousBonus;
    }

    public void setPreviousBonus(BigDecimal previousBonus) {
        this.previousBonus = previousBonus;
    }

    public BigDecimal getNewBonus() {
        return newBonus;
    }

    public void setNewBonus(BigDecimal newBonus) {
        this.newBonus = newBonus;
    }

    public Double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(Double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public LocalDate getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(LocalDate effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getRevisionReason() {
        return revisionReason;
    }

    public void setRevisionReason(String revisionReason) {
        this.revisionReason = revisionReason;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
