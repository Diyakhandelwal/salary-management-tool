package com.salarymanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SalaryRevisionRequest {

    @NotNull(message = "New base salary is required")
    @PositiveOrZero(message = "Salary must be non-negative")
    private BigDecimal newBaseSalary;

    @PositiveOrZero(message = "Bonus must be non-negative")
    private BigDecimal newBonus;

    @NotNull(message = "Effective date is required")
    private LocalDate effectiveDate;

    @NotBlank(message = "Revision reason is required")
    private String revisionReason; // Annual Merit Review, Promotion, Market Adjustment, Retention, Cost of Living

    private String notes;

    private String approvedBy = "HR Manager";

    public SalaryRevisionRequest() {}

    public BigDecimal getNewBaseSalary() { return newBaseSalary; }
    public void setNewBaseSalary(BigDecimal newBaseSalary) { this.newBaseSalary = newBaseSalary; }

    public BigDecimal getNewBonus() { return newBonus; }
    public void setNewBonus(BigDecimal newBonus) { this.newBonus = newBonus; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public String getRevisionReason() { return revisionReason; }
    public void setRevisionReason(String revisionReason) { this.revisionReason = revisionReason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getApprovedBy() { return approvedBy; }
    public void setApprovedBy(String approvedBy) { this.approvedBy = approvedBy; }
}
