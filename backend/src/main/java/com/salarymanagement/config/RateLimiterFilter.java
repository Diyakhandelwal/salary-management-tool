package com.salarymanagement.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * API Gateway component: In-memory sliding window rate limiter
 * Enforces rate limiting per IP address as illustrated in the HLD.
 */
@Component
@Order(1)
public class RateLimiterFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 180;
    private final Map<String, RequestCounter> requestCounts = new ConcurrentHashMap<>();

    private static class RequestCounter {
        long windowStart;
        AtomicInteger count;

        RequestCounter(long windowStart) {
            this.windowStart = windowStart;
            this.count = new AtomicInteger(1);
        }
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Skip rate limiting for static assets or actuator/health
        String path = httpRequest.getRequestURI();
        if (path.startsWith("/h2-console") || "OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(httpRequest);
        long now = System.currentTimeMillis();

        RequestCounter counter = requestCounts.compute(clientIp, (key, existing) -> {
            if (existing == null || (now - existing.windowStart > 60000)) {
                return new RequestCounter(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        int currentCount = counter.count.get();
        int remaining = Math.max(0, MAX_REQUESTS_PER_MINUTE - currentCount);

        httpResponse.setHeader("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS_PER_MINUTE));
        httpResponse.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));
        httpResponse.setHeader("X-RateLimit-Reset", String.valueOf((counter.windowStart + 60000) / 1000));

        if (currentCount > MAX_REQUESTS_PER_MINUTE) {
            httpResponse.setStatus(429);
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write("{\"error\": \"Too Many Requests\", \"message\": \"Rate limit exceeded. Please try again later.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
