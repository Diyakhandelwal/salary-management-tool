package com.salarymanagement.service;

import com.salarymanagement.dto.*;
import com.salarymanagement.model.Employee;
import com.salarymanagement.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final EmployeeRepository employeeRepository;

    public AnalyticsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public DashboardSummaryDTO getDashboardSummary() {
        List<Employee> allEmployees = employeeRepository.findAll();
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        long total = allEmployees.size();
        summary.setTotalEmployees(total);

        if (total == 0) {
            summary.setActiveEmployees(0);
            summary.setTotalAnnualPayroll(BigDecimal.ZERO);
            summary.setAverageSalary(BigDecimal.ZERO);
            summary.setMedianSalary(BigDecimal.ZERO);
            summary.setMinSalary(BigDecimal.ZERO);
            summary.setMaxSalary(BigDecimal.ZERO);
            summary.setDepartmentCount(0);
            summary.setCountryCount(0);
            summary.setDepartmentBreakdown(Collections.emptyList());
            summary.setCountryBreakdown(Collections.emptyList());
            summary.setSalaryDistribution(Collections.emptyList());
            return summary;
        }

        long activeCount = allEmployees.stream().filter(e -> "ACTIVE".equalsIgnoreCase(e.getStatus())).count();
        summary.setActiveEmployees(activeCount);

        List<BigDecimal> salaries = allEmployees.stream()
                .map(Employee::getBaseSalary)
                .filter(Objects::nonNull)
                .sorted()
                .toList();

        BigDecimal totalPayroll = salaries.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalAnnualPayroll(totalPayroll);

        BigDecimal avg = totalPayroll.divide(BigDecimal.valueOf(salaries.size()), 2, RoundingMode.HALF_UP);
        summary.setAverageSalary(avg);

        // Median calculation
        BigDecimal median;
        int size = salaries.size();
        if (size % 2 == 1) {
            median = salaries.get(size / 2);
        } else {
            BigDecimal mid1 = salaries.get((size / 2) - 1);
            BigDecimal mid2 = salaries.get(size / 2);
            median = mid1.add(mid2).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        }
        summary.setMedianSalary(median);
        summary.setMinSalary(salaries.get(0));
        summary.setMaxSalary(salaries.get(size - 1));

        Set<String> distinctDepts = allEmployees.stream().map(Employee::getDepartment).collect(Collectors.toSet());
        Set<String> distinctCountries = allEmployees.stream().map(Employee::getCountry).collect(Collectors.toSet());
        summary.setDepartmentCount(distinctDepts.size());
        summary.setCountryCount(distinctCountries.size());

        summary.setDepartmentBreakdown(getDepartmentAnalytics());
        summary.setCountryBreakdown(getCountryAnalytics());
        summary.setSalaryDistribution(calculateSalaryDistribution(salaries));

        return summary;
    }

    public List<DepartmentAnalyticsDTO> getDepartmentAnalytics() {
        List<Object[]> raw = employeeRepository.getDepartmentStats();
        List<DepartmentAnalyticsDTO> list = new ArrayList<>();
        for (Object[] row : raw) {
            String dept = (String) row[0];
            long count = ((Number) row[1]).longValue();
            BigDecimal total = row[2] != null ? new BigDecimal(row[2].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal avg = row[3] != null ? new BigDecimal(row[3].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal min = row[4] != null ? new BigDecimal(row[4].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal max = row[5] != null ? new BigDecimal(row[5].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            list.add(new DepartmentAnalyticsDTO(dept, count, total, avg, min, max));
        }
        list.sort(Comparator.comparing(DepartmentAnalyticsDTO::getTotalExpenditure).reversed());
        return list;
    }

    public List<CountryAnalyticsDTO> getCountryAnalytics() {
        List<Object[]> raw = employeeRepository.getCountryStats();
        List<CountryAnalyticsDTO> list = new ArrayList<>();
        for (Object[] row : raw) {
            String country = (String) row[0];
            long count = ((Number) row[1]).longValue();
            BigDecimal total = row[2] != null ? new BigDecimal(row[2].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal avg = row[3] != null ? new BigDecimal(row[3].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal min = row[4] != null ? new BigDecimal(row[4].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal max = row[5] != null ? new BigDecimal(row[5].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            list.add(new CountryAnalyticsDTO(country, count, total, avg, min, max));
        }
        list.sort(Comparator.comparing(CountryAnalyticsDTO::getEmployeeCount).reversed());
        return list;
    }

    public List<RoleAnalyticsDTO> getRoleAnalytics() {
        List<Object[]> raw = employeeRepository.getRoleStats();
        List<RoleAnalyticsDTO> list = new ArrayList<>();
        for (Object[] row : raw) {
            String role = (String) row[0];
            long count = ((Number) row[1]).longValue();
            BigDecimal avg = row[2] != null ? new BigDecimal(row[2].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal min = row[3] != null ? new BigDecimal(row[3].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal max = row[4] != null ? new BigDecimal(row[4].toString()).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            list.add(new RoleAnalyticsDTO(role, count, avg, min, max));
        }
        return list;
    }

    private List<SalaryBandDTO> calculateSalaryDistribution(List<BigDecimal> salaries) {
        if (salaries.isEmpty()) return Collections.emptyList();
        int total = salaries.size();

        long b1 = 0; // < 50k
        long b2 = 0; // 50k - 80k
        long b3 = 0; // 80k - 110k
        long b4 = 0; // 110k - 150k
        long b5 = 0; // 150k - 200k
        long b6 = 0; // 200k+

        for (BigDecimal s : salaries) {
            double val = s.doubleValue();
            if (val < 50000) b1++;
            else if (val < 80000) b2++;
            else if (val < 110000) b3++;
            else if (val < 150000) b4++;
            else if (val < 200000) b5++;
            else b6++;
        }

        List<SalaryBandDTO> bands = new ArrayList<>();
        bands.add(new SalaryBandDTO("< $50K", 0, 49999, b1, Math.round((b1 * 100.0 / total) * 10.0) / 10.0));
        bands.add(new SalaryBandDTO("$50K - $80K", 50000, 79999, b2, Math.round((b2 * 100.0 / total) * 10.0) / 10.0));
        bands.add(new SalaryBandDTO("$80K - $110K", 80000, 109999, b3, Math.round((b3 * 100.0 / total) * 10.0) / 10.0));
        bands.add(new SalaryBandDTO("$110K - $150K", 110000, 149999, b4, Math.round((b4 * 100.0 / total) * 10.0) / 10.0));
        bands.add(new SalaryBandDTO("$150K - $200K", 150000, 199999, b5, Math.round((b5 * 100.0 / total) * 10.0) / 10.0));
        bands.add(new SalaryBandDTO("$200K+", 200000, 1000000, b6, Math.round((b6 * 100.0 / total) * 10.0) / 10.0));

        return bands;
    }

    public byte[] exportSalaryReportCsv() {
        return exportSalaryReportCsv(null, null, null, null, null, null);
    }

    public byte[] exportSalaryReportCsv(String keyword, String department, String country, String status,
                                        BigDecimal minSalary, BigDecimal maxSalary) {
        List<Employee> list = employeeRepository.filterEmployees(keyword, department, country, status, minSalary, maxSalary);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8);

        writer.println("Employee Code,First Name,Last Name,Email,Job Title,Department,Organization,Country,Currency,Status,Hire Date,Base Salary,Variable Bonus,Total Compensation,Last Revision Date");

        for (Employee e : list) {
            writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%.2f,%.2f,\"%s\"%n",
                    e.getEmployeeCode(),
                    escapeCsv(e.getFirstName()),
                    escapeCsv(e.getLastName()),
                    e.getEmail(),
                    escapeCsv(e.getJobTitle()),
                    escapeCsv(e.getDepartment()),
                    escapeCsv(e.getOrganization()),
                    escapeCsv(e.getCountry()),
                    e.getCurrency(),
                    e.getStatus(),
                    e.getHireDate(),
                    e.getBaseSalary() != null ? e.getBaseSalary() : BigDecimal.ZERO,
                    e.getVariableBonus() != null ? e.getVariableBonus() : BigDecimal.ZERO,
                    e.getTotalCompensation() != null ? e.getTotalCompensation() : BigDecimal.ZERO,
                    e.getLastRevisionDate() != null ? e.getLastRevisionDate().toString() : ""
            );
        }
        writer.flush();
        return out.toByteArray();
    }

    private String escapeCsv(String str) {
        if (str == null) return "";
        return str.replace("\"", "\"\"");
    }
}
