package com.salarymanagement.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardSummaryDTO {
    private long totalEmployees;
    private long activeEmployees;
    private BigDecimal totalAnnualPayroll;
    private BigDecimal averageSalary;
    private BigDecimal medianSalary;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private long departmentCount;
    private long countryCount;
    private List<DepartmentAnalyticsDTO> departmentBreakdown;
    private List<CountryAnalyticsDTO> countryBreakdown;
    private List<SalaryBandDTO> salaryDistribution;

    public DashboardSummaryDTO() {}

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getActiveEmployees() { return activeEmployees; }
    public void setActiveEmployees(long activeEmployees) { this.activeEmployees = activeEmployees; }

    public BigDecimal getTotalAnnualPayroll() { return totalAnnualPayroll; }
    public void setTotalAnnualPayroll(BigDecimal totalAnnualPayroll) { this.totalAnnualPayroll = totalAnnualPayroll; }

    public BigDecimal getAverageSalary() { return averageSalary; }
    public void setAverageSalary(BigDecimal averageSalary) { this.averageSalary = averageSalary; }

    public BigDecimal getMedianSalary() { return medianSalary; }
    public void setMedianSalary(BigDecimal medianSalary) { this.medianSalary = medianSalary; }

    public BigDecimal getMinSalary() { return minSalary; }
    public void setMinSalary(BigDecimal minSalary) { this.minSalary = minSalary; }

    public BigDecimal getMaxSalary() { return maxSalary; }
    public void setMaxSalary(BigDecimal maxSalary) { this.maxSalary = maxSalary; }

    public long getDepartmentCount() { return departmentCount; }
    public void setDepartmentCount(long departmentCount) { this.departmentCount = departmentCount; }

    public long getCountryCount() { return countryCount; }
    public void setCountryCount(long countryCount) { this.countryCount = countryCount; }

    public List<DepartmentAnalyticsDTO> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(List<DepartmentAnalyticsDTO> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public List<CountryAnalyticsDTO> getCountryBreakdown() { return countryBreakdown; }
    public void setCountryBreakdown(List<CountryAnalyticsDTO> countryBreakdown) { this.countryBreakdown = countryBreakdown; }

    public List<SalaryBandDTO> getSalaryDistribution() { return salaryDistribution; }
    public void setSalaryDistribution(List<SalaryBandDTO> salaryDistribution) { this.salaryDistribution = salaryDistribution; }
}
