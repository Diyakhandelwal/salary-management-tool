package com.salarymanagement.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:h2:mem:salarydb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:sa}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String url = datasourceUrl;
        String user = username;
        String pass = password;

        // Auto-adapt cloud provider connection strings (e.g. Render, Railway)
        // that provide postgresql:// or postgres:// without the jdbc: prefix
        if (url != null && (url.startsWith("postgres://") || url.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(url);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    user = parts[0];
                    pass = parts[1];
                }
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                url = "jdbc:postgresql://" + uri.getHost() + ":" + port + uri.getPath();
                log.info("Auto-configured PostgreSQL JDBC connection for host: {}", uri.getHost());
            } catch (Exception e) {
                log.warn("Failed to parse URI from datasource url, falling back to prefix replacement: {}", e.getMessage());
                if (url.startsWith("postgres://")) {
                    url = "jdbc:postgresql://" + url.substring("postgres://".length());
                } else if (url.startsWith("postgresql://")) {
                    url = "jdbc:postgresql://" + url.substring("postgresql://".length());
                }
            }
        } else {
            log.info("Configured default datasource: {}", url.contains("h2:mem") ? "Embedded H2 (in-memory)" : url);
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(url);
        config.setUsername(user);
        config.setPassword(pass);
        return new HikariDataSource(config);
    }
}
