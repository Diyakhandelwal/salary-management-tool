package com.salarymanagement.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class AuthControllerTest {

    private final AuthController authController = new AuthController();

    @Test
    @DisplayName("getCurrentUser: Returns Elena Vance HR profile with permissions")
    void getCurrentUser_returnsElenaProfile() {
        ResponseEntity<Map<String, Object>> response = authController.getCurrentUser();

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("name")).isEqualTo("Elena Vance");
        assertThat(body.get("email")).isEqualTo("elena.vance@company.com");
        assertThat(body.get("role")).isEqualTo("HR_MANAGER");
        assertThat(body.get("title")).isEqualTo("Head of People & Total Rewards");
        assertThat(body.get("organization")).isEqualTo("Acme Global Technologies");

        @SuppressWarnings("unchecked")
        List<String> permissions = (List<String>) body.get("permissions");
        assertThat(permissions).contains("VIEW_SALARIES", "REVISE_SALARY", "GENERATE_REPORTS", "AUDIT_ACCESS");
    }

    @Test
    @DisplayName("login: Successfully returns session token and authenticated user profile for authorized credentials")
    void login_returnsTokenAndProfile() {
        Map<String, String> credentials = Map.of(
                "email", "elena.vance@company.com",
                "password", "Password123!"
        );

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = (ResponseEntity<Map<String, Object>>) authController.login(credentials);

        assertThat(response.getStatusCode().value()).isEqualTo(200);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("email")).isEqualTo("elena.vance@company.com");
        assertThat(body.get("role")).isEqualTo("HR_MANAGER");
        assertThat(body.get("token")).isNotNull();
        assertThat(body.get("token").toString()).startsWith("comp-pulse-session-token-");
    }

    @Test
    @DisplayName("login: Rejects unauthorized email with 401 Unauthorized")
    void login_rejectsUnauthorizedEmail() {
        Map<String, String> credentials = Map.of(
                "email", "unknown.user@otherdomain.com",
                "password", "Password123!"
        );

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = (ResponseEntity<Map<String, Object>>) authController.login(credentials);

        assertThat(response.getStatusCode().value()).isEqualTo(401);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("error")).isEqualTo("Unauthorized");
        assertThat(body.get("message").toString()).contains("restricted to authorized HR administrators");
    }

    @Test
    @DisplayName("login: Rejects invalid password with 401 Unauthorized")
    void login_rejectsInvalidPassword() {
        Map<String, String> credentials = Map.of(
                "email", "elena.vance@company.com",
                "password", "WrongPassword999!"
        );

        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = (ResponseEntity<Map<String, Object>>) authController.login(credentials);

        assertThat(response.getStatusCode().value()).isEqualTo(401);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("error")).isEqualTo("Unauthorized");
    }

    @Test
    @DisplayName("login: Rejects empty or null credentials body with 401 Unauthorized")
    void login_rejectsEmptyBody() {
        @SuppressWarnings("unchecked")
        ResponseEntity<Map<String, Object>> response = (ResponseEntity<Map<String, Object>>) authController.login(null);

        assertThat(response.getStatusCode().value()).isEqualTo(401);
        Map<String, Object> body = response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("error")).isEqualTo("Unauthorized");
        assertThat(body.get("message").toString()).contains("Work email address is required");
    }
}
