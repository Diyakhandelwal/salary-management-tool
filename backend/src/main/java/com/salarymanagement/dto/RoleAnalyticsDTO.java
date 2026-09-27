package com.salarymanagement.dto;

import java.math.BigDecimal;

public class RoleAnalyticsDTO {
    private String role;
    private long employeeCount;
    private BigDecimal averageSalary;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    public RoleAnalyticsDTO(String role, long employeeCount, BigDecimal averageSalary, BigDecimal minSalary, BigDecimal maxSalary) {
        this.role = role;
        this.employeeCount = employeeCount;
        this.averageSalary = averageSalary;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public String getRole() { return role; }
    public long getEmployeeCount() { return employeeCount; }
    public BigDecimal getAverageSalary() { return averageSalary; }
    public BigDecimal getMinSalary() { return minSalary; }
    public BigDecimal getMaxSalary() { return maxSalary; }
}
