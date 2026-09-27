package com.salarymanagement.controller;

import com.salarymanagement.dto.CountryAnalyticsDTO;
import com.salarymanagement.dto.DashboardSummaryDTO;
import com.salarymanagement.dto.DepartmentAnalyticsDTO;
import com.salarymanagement.dto.RoleAnalyticsDTO;
import com.salarymanagement.service.AnalyticsService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentAnalyticsDTO>> getDepartmentAnalytics() {
        return ResponseEntity.ok(analyticsService.getDepartmentAnalytics());
    }

    @GetMapping("/countries")
    public ResponseEntity<List<CountryAnalyticsDTO>> getCountryAnalytics() {
        return ResponseEntity.ok(analyticsService.getCountryAnalytics());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleAnalyticsDTO>> getRoleAnalytics() {
        return ResponseEntity.ok(analyticsService.getRoleAnalytics());
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportSalaryReportCsv(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary) {
        byte[] csvBytes = analyticsService.exportSalaryReportCsv(keyword, department, country, status, minSalary, maxSalary);
        String deptPrefix = (department != null && !department.isBlank()) ? department.toLowerCase().replaceAll("[^a-z0-9]", "_") + "_" : "";
        String filename = "salary_report_" + deptPrefix + System.currentTimeMillis() + ".csv";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }
}
