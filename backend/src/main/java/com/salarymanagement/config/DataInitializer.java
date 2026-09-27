package com.salarymanagement.config;

import com.salarymanagement.dto.EmployeeCreateRequest;
import com.salarymanagement.dto.SalaryRevisionRequest;
import com.salarymanagement.model.Employee;
import com.salarymanagement.repository.EmployeeRepository;
import com.salarymanagement.service.EmployeeService;
import com.salarymanagement.service.SalaryService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(EmployeeRepository employeeRepository,
                                          EmployeeService employeeService,
                                          SalaryService salaryService) {
        return args -> {
            if (employeeRepository.count() > 0) {
                return; // already seeded
            }

            // Seed realistic corporate employees across departments and countries
            List<Object[]> seedList = List.of(
                    new Object[]{"EMP-1001", "Alex", "Chen", "alex.chen@acmeglobal.com", "Principal Architect", "Engineering", "United States", "USD", "Sarah Jenkins", "2021-03-15", "185000", "25000"},
                    new Object[]{"EMP-1002", "Priya", "Sharma", "priya.sharma@acmeglobal.com", "Lead Backend Engineer", "Engineering", "India", "USD", "Alex Chen", "2022-01-10", "125000", "15000"},
                    new Object[]{"EMP-1003", "Marcus", "Vance", "marcus.vance@acmeglobal.com", "Senior DevOps Engineer", "Engineering", "United States", "USD", "Alex Chen", "2022-06-01", "145000", "18000"},
                    new Object[]{"EMP-1004", "Sophie", "Dubois", "sophie.dubois@acmeglobal.com", "Staff Frontend Engineer", "Engineering", "Germany", "USD", "Alex Chen", "2021-11-20", "138000", "16000"},
                    new Object[]{"EMP-1005", "David", "Miller", "david.miller@acmeglobal.com", "VP of Product", "Product", "United States", "USD", "Elena Vance", "2020-05-18", "195000", "35000"},
                    new Object[]{"EMP-1006", "Aisha", "Khan", "aisha.khan@acmeglobal.com", "Senior Product Manager", "Product", "United Kingdom", "USD", "David Miller", "2022-08-15", "130000", "15000"},
                    new Object[]{"EMP-1007", "Liam", "O'Connor", "liam.oconnor@acmeglobal.com", "Lead Product Designer", "Product", "United Kingdom", "USD", "David Miller", "2023-02-01", "118000", "12000"},
                    new Object[]{"EMP-1008", "Jessica", "Taylor", "jessica.taylor@acmeglobal.com", "Chief Marketing Officer", "Marketing", "United States", "USD", "Elena Vance", "2020-02-10", "190000", "30000"},
                    new Object[]{"EMP-1009", "Mateo", "Hernandez", "mateo.hernandez@acmeglobal.com", "Growth Marketing Director", "Marketing", "United States", "USD", "Jessica Taylor", "2021-09-01", "140000", "20000"},
                    new Object[]{"EMP-1010", "Ananya", "Patel", "ananya.patel@acmeglobal.com", "Senior Content Strategist", "Marketing", "India", "USD", "Mateo Hernandez", "2023-04-10", "78000", "8000"},
                    new Object[]{"EMP-1011", "Lucas", "Weber", "lucas.weber@acmeglobal.com", "VP of Global Sales", "Sales", "Germany", "USD", "Elena Vance", "2019-11-01", "175000", "55000"},
                    new Object[]{"EMP-1012", "Olivia", "Smith", "olivia.smith@acmeglobal.com", "Enterprise Account Executive", "Sales", "United States", "USD", "Lucas Weber", "2022-03-01", "110000", "40000"},
                    new Object[]{"EMP-1013", "Rajesh", "Verma", "rajesh.verma@acmeglobal.com", "Sales Engineer Lead", "Sales", "Singapore", "USD", "Lucas Weber", "2022-10-15", "128000", "22000"},
                    new Object[]{"EMP-1014", "Charlotte", "Brown", "charlotte.brown@acmeglobal.com", "Head of Talent Acquisition", "Human Resources", "United Kingdom", "USD", "Elena Vance", "2021-07-01", "115000", "12000"},
                    new Object[]{"EMP-1015", "Ethan", "Johnson", "ethan.johnson@acmeglobal.com", "Senior HR Business Partner", "Human Resources", "United States", "USD", "Charlotte Brown", "2022-11-01", "98000", "10000"},
                    new Object[]{"EMP-1016", "Mei", "Ling", "mei.ling@acmeglobal.com", "People Operations Analyst", "Human Resources", "Singapore", "USD", "Charlotte Brown", "2023-06-12", "68000", "7000"},
                    new Object[]{"EMP-1017", "Thomas", "Mueller", "thomas.mueller@acmeglobal.com", "Director of Finance & Planning", "Finance", "Germany", "USD", "Elena Vance", "2020-08-01", "165000", "25000"},
                    new Object[]{"EMP-1018", "Chloe", "Davies", "chloe.davies@acmeglobal.com", "Senior Financial Analyst", "Finance", "United Kingdom", "USD", "Thomas Mueller", "2022-04-18", "95000", "10000"},
                    new Object[]{"EMP-1019", "Arjun", "Nair", "arjun.nair@acmeglobal.com", "Staff Security Engineer", "Engineering", "India", "USD", "Alex Chen", "2022-05-15", "142000", "18000"},
                    new Object[]{"EMP-1020", "Hannah", "Schneider", "hannah.schneider@acmeglobal.com", "UI/UX Researcher", "Product", "Germany", "USD", "Liam O'Connor", "2023-09-01", "88000", "9000"}
            );

            for (Object[] row : seedList) {
                EmployeeCreateRequest req = new EmployeeCreateRequest();
                req.setEmployeeCode((String) row[0]);
                req.setFirstName((String) row[1]);
                req.setLastName((String) row[2]);
                req.setEmail((String) row[3]);
                req.setJobTitle((String) row[4]);
                req.setDepartment((String) row[5]);
                req.setOrganization("Acme Global Technologies");
                req.setCountry((String) row[6]);
                req.setCurrency((String) row[7]);
                req.setManagerName((String) row[8]);
                req.setStatus("ACTIVE");
                req.setHireDate(LocalDate.parse((String) row[9]));
                req.setBaseSalary(new BigDecimal((String) row[10]));
                req.setVariableBonus(new BigDecimal((String) row[11]));

                Employee emp = employeeService.createEmployee(req);

                // Add historical salary revisions for select employees to showcase the revision history feature!
                if ("EMP-1001".equals(emp.getEmployeeCode())) {
                    SalaryRevisionRequest rev = new SalaryRevisionRequest();
                    rev.setNewBaseSalary(new BigDecimal("185000"));
                    rev.setNewBonus(new BigDecimal("25000"));
                    rev.setEffectiveDate(LocalDate.now().minusMonths(3));
                    rev.setRevisionReason("Annual Performance Merit & Architecture Leadership");
                    rev.setApprovedBy("Elena Vance (HR Manager)");
                    rev.setNotes("Promoted from Staff to Principal Architect after leading cloud migration.");
                    salaryService.reviseSalary(emp.getId(), rev);
                } else if ("EMP-1002".equals(emp.getEmployeeCode())) {
                    SalaryRevisionRequest rev = new SalaryRevisionRequest();
                    rev.setNewBaseSalary(new BigDecimal("125000"));
                    rev.setNewBonus(new BigDecimal("15000"));
                    rev.setEffectiveDate(LocalDate.now().minusMonths(6));
                    rev.setRevisionReason("Market Adjustment");
                    rev.setApprovedBy("Elena Vance (HR Manager)");
                    rev.setNotes("Benchmarking against top tier tech market rates in region.");
                    salaryService.reviseSalary(emp.getId(), rev);
                } else if ("EMP-1004".equals(emp.getEmployeeCode())) {
                    SalaryRevisionRequest rev = new SalaryRevisionRequest();
                    rev.setNewBaseSalary(new BigDecimal("142000"));
                    rev.setNewBonus(new BigDecimal("18000"));
                    rev.setEffectiveDate(LocalDate.of(2025, 11, 15));
                    rev.setRevisionReason("Annual Performance Merit & Role Leveling");
                    rev.setApprovedBy("Elena Vance (HR Manager)");
                    rev.setNotes("Closed FY2025 cycle performance increase.");
                    salaryService.reviseSalary(emp.getId(), rev);
                } else if ("EMP-1008".equals(emp.getEmployeeCode())) {
                    SalaryRevisionRequest rev = new SalaryRevisionRequest();
                    rev.setNewBaseSalary(new BigDecimal("190000"));
                    rev.setNewBonus(new BigDecimal("30000"));
                    rev.setEffectiveDate(LocalDate.now().minusMonths(2));
                    rev.setRevisionReason("Executive Compensation Review");
                    rev.setApprovedBy("Elena Vance (HR Manager)");
                    rev.setNotes("Quarterly board review of leadership compensation package.");
                    salaryService.reviseSalary(emp.getId(), rev);
                }
            }
        };
    }
}
