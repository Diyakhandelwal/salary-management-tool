package com.salarymanagement.dto;

import java.math.BigDecimal;

public class CountryAnalyticsDTO {
    private String country;
    private long employeeCount;
    private BigDecimal totalExpenditure;
    private BigDecimal averageSalary;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;

    public CountryAnalyticsDTO(String country, long employeeCount, BigDecimal totalExpenditure,
                               BigDecimal averageSalary, BigDecimal minSalary, BigDecimal maxSalary) {
        this.country = country;
        this.employeeCount = employeeCount;
        this.totalExpenditure = totalExpenditure;
        this.averageSalary = averageSalary;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
    }

    public String getCountry() { return country; }
    public long getEmployeeCount() { return employeeCount; }
    public BigDecimal getTotalExpenditure() { return totalExpenditure; }
    public BigDecimal getAverageSalary() { return averageSalary; }
    public BigDecimal getMinSalary() { return minSalary; }
    public BigDecimal getMaxSalary() { return maxSalary; }
}
