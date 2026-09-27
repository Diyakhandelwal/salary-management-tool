package com.salarymanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 101L);
        user.put("name", "Elena Vance");
        user.put("email", "elena.vance@company.com");
        user.put("role", "HR_MANAGER");
        user.put("title", "Head of People & Total Rewards");
        user.put("organization", "Acme Global Technologies");
        user.put("permissions", List.of("VIEW_SALARIES", "REVISE_SALARY", "GENERATE_REPORTS", "AUDIT_ACCESS"));
        return ResponseEntity.ok(user);
    }
}
