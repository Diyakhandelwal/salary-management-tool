package com.salarymanagement.controller;

import com.salarymanagement.dto.SalaryRevisionRequest;
import com.salarymanagement.model.SalaryRevision;
import com.salarymanagement.service.SalaryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salaries")
public class SalaryController {

    private final SalaryService salaryService;

    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @PostMapping("/employees/{employeeId}/revise")
    public ResponseEntity<SalaryRevision> reviseSalary(
            @PathVariable Long employeeId,
            @Valid @RequestBody SalaryRevisionRequest request) {
        SalaryRevision revision = salaryService.reviseSalary(employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(revision);
    }

    @GetMapping("/employees/{employeeId}/history")
    public ResponseEntity<List<SalaryRevision>> getRevisionHistory(@PathVariable Long employeeId) {
        List<SalaryRevision> history = salaryService.getRevisionHistory(employeeId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/recent-revisions")
    public ResponseEntity<List<SalaryRevision>> getRecentRevisions() {
        return ResponseEntity.ok(salaryService.getRecentRevisions());
    }
}
