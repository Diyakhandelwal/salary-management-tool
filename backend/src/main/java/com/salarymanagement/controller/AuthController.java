package com.salarymanagement.controller;

import org.springframework.http.HttpStatus;
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
        if (credentials == null || !credentials.containsKey("email") || credentials.get("email") == null || credentials.get("email").isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Work email address is required to sign in."
            ));
        }

        String email = credentials.get("email").trim().toLowerCase();
        String password = credentials.get("password");

        // Validate authorized credentials for HR Management access
        boolean isAuthorizedEmail = "elena.vance@company.com".equals(email) || "elena.vance@acmeglobal.com".equals(email);
        boolean isPasswordValid = password != null && (
                "Password123!".equals(password) || "Password123".equals(password) || "password123".equals(password)
        );

        if (!isAuthorizedEmail || !isPasswordValid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Unauthorized",
                    "message", "Invalid work email or password. Access is restricted to authorized HR administrators (elena.vance@company.com)."
            ));
        }

        Map<String, Object> response = new HashMap<>(getElenaProfile());
        response.put("email", email);
        response.put("token", "comp-pulse-session-token-" + System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}
