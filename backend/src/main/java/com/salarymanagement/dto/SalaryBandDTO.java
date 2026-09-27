package com.salarymanagement.dto;

public class SalaryBandDTO {
    private String bandLabel;
    private double minRange;
    private double maxRange;
    private long employeeCount;
    private double percentage;

    public SalaryBandDTO(String bandLabel, double minRange, double maxRange, long employeeCount, double percentage) {
        this.bandLabel = bandLabel;
        this.minRange = minRange;
        this.maxRange = maxRange;
        this.employeeCount = employeeCount;
        this.percentage = percentage;
    }

    public String getBandLabel() { return bandLabel; }
    public double getMinRange() { return minRange; }
    public double getMaxRange() { return maxRange; }
    public long getEmployeeCount() { return employeeCount; }
    public double getPercentage() { return percentage; }
}
