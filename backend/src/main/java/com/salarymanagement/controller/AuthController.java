package com.salarymanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private Map<String, Object> getElenaProfile() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", 101L);
        user.put("name", "Elena Vance");
        user.put("email", "elena.vance@company.com");
        user.put("role", "HR_MANAGER");
        user.put("title", "Head of People & Total Rewards");
        user.put("organization", "Acme Global Technologies");
        user.put("permissions", List.of("VIEW_SALARIES", "REVISE_SALARY", "GENERATE_REPORTS", "AUDIT_ACCESS"));
        return user;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        return ResponseEntity.ok(getElenaProfile());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>(getElenaProfile());
        if (credentials != null && credentials.containsKey("email") && credentials.get("email") != null && !credentials.get("email").isBlank()) {
            response.put("email", credentials.get("email").trim());
        }
        response.put("token", "comp-pulse-session-token-" + System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
