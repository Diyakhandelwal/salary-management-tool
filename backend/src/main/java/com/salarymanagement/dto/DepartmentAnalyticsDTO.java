package com.salarymanagement.dto;

import java.math.BigDecimal;

public class DepartmentAnalyticsDTO {
    private String department;
    private long employeeCount;
    private BigDecimal totalExpenditure;
    private BigDecimal averageSalary;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    public DepartmentAnalyticsDTO(String department, long employeeCount, BigDecimal totalExpenditure,
                                  BigDecimal averageSalary, BigDecimal minSalary, BigDecimal maxSalary) {
        this.department = department;
        this.employeeCount = employeeCount;
        this.totalExpenditure = totalExpenditure;
        this.averageSalary = averageSalary;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public String getDepartment() { return department; }
    public long getEmployeeCount() { return employeeCount; }
    public BigDecimal getTotalExpenditure() { return totalExpenditure; }
    public BigDecimal getAverageSalary() { return averageSalary; }
    public BigDecimal getMinSalary() { return minSalary; }
    public BigDecimal getMaxSalary() { return maxSalary; }
}
