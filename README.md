# CompPulse — Enterprise Salary Management Tool
### Technical Assessment & Product Requirements Specification

[![Java](https://img.shields.io/badge/Java-21%20%2F%2024-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Gradle](https://img.shields.io/badge/Gradle-8.12.1-02303A.svg?logo=gradle)](https://gradle.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An end-to-end, full-stack **Salary & Total Rewards Management Tool** designed for **ACME org** (an organization with 10,000 employees across multiple global regions). Built with **Java 21 / Spring Boot 3 & Gradle** on the backend and **React 19 / TypeScript / Vite** on the frontend.

---

## 🎯 1. Product Requirements Document (PRD)

### Problem Statement
Currently, ACME org’s HR team manages salary data for **10,000 employees across multiple countries**, with everything managed via offline spreadsheets, which is tedious, prone to human calculation errors, and lacks real-time visibility. 

The HR leadership requires web-based software to manage workforce compensation data and be able to immediately answer macro-level questions about **how the organization pays its people**.

### Primary User Persona
* **Target User:** **Elena Vance — Head of People & Total Rewards (HR Manager)**
* **Persona Responsibilities:**
  * Monitoring organizational payroll allocation and budget distributions across global regions and departments.
  * Modeling and executing salary merit revisions with real-time percentage simulations.
  * Reviewing individual compensation histories and maintaining organizational pay equity.
  * Generating filtered compensation rosters and audit trails for executive and finance reviews.

---

## 🏗️ 2. High-Level Architecture (HLD)

The system was engineered in direct accordance with the submitted architectural whiteboard specification:

<p align="center">
  <img src="docs/images/architecture_hld.png" alt="High-Level Design Whiteboard Architecture" width="850"/>
</p>

### Architecture Mapping & Component Breakdown

| Whiteboard Specification Node | Implemented Component | Technical Responsibility |
| :--- | :--- | :--- |
| **HR User** | **Client Layer (React 19 + TypeScript)** | Web UI featuring executive compensation metrics, employee directory, revision modals, and audit logs. |
| **API Gateway** | **Spring Filters & Security** | Enforces authenticated HR Persona session (`X-HR-Persona: Elena Vance`), CORS policies, and sliding-window rate limiting (180 req/min). |
| **Employee Profile Management** | **Employee Service & Controller** | Complete employee lifecycle CRUD, departmental cost centers, geographic locations, and profile metadata. |
| **Data Fetching / Search / Audit Service** | **Search Specification & Audit Service** | Compound multi-attribute search queries, pagination, salary range filters, and immutable forensic audit logging. |
| **Salary Updation Service** | **Salary Service & Revision Controller** | Real-time percentage bump simulations (`+%`), base/bonus calculation, and chronological revision history tracking. |
| **Report Generation Service** | **Analytics Service & Exporter** | Dynamic salary distribution band histograms, regional/department rollups, and filtered RFC-compliant CSV roster exports. |
| **Repository Layer** | **Spring Data JPA / Hibernate 6** | Indexed database repositories (`EmployeeRepository`, `SalaryRevisionRepository`, `AuditLogRepository`). |
| **DB - SQL** | **Relational SQL Database (H2 / Postgres)** | Stores employee info, department, organization, current salary, manager, and revision history with indexed queries. |

---

## 📋 3. Scope Decisions & Deliberate Trade-Offs

Per the recruiter's explicit requirements review and product scoping, deliberate architectural boundaries were established:

| Feature / Domain | Scope Status | Product Reasoning & Trade-off |
| :--- | :---: | :--- |
| **Salary Management & Insights** | ✅ **In Scope** | Core objective: replacing spreadsheets with live compensation analytics, band distributions, and revision tooling. |
| **Salary Revision History** | ✅ **In Scope** | Essential for governance: chronological timeline of adjustments (+%), effective dates, and reasons. |
| **Filtered Report Generation** | ✅ **In Scope** | Direct HR requirement: one-click CSV download of all employees or active search filters (department, country, salary range). |
| **Audit & Compliance Trail** | ✅ **In Scope** | Immutable event logging for pay revisions and employee lifecycle changes (`CREATE`, `UPDATE`, `DELETE`). |
| **Rate Limiting Gateway** | ✅ **In Scope** | Sliding window rate limiting (180 req/min) implemented to protect reporting APIs at scale. |
| **Transactional Payroll Processing** | ❌ **Excluded** | Focused on *compensation management* rather than payroll runs (tax withholdings, W-2/TDS, bank transfers). Adding payroll tax engines introduces regional tax code bloat without aiding compensation decision-making. |
| **Multi-Tier Approval State Machines** | ❌ **Excluded** | Single HR Manager persona confirmed by recruiter. Eliminates complex multi-party queue overhead while ensuring instant revision execution and accountability. |
| **Third-Party HRMS Integrations** | ❌ **Excluded** | Syncing with Workday/BambooHR requires sandbox credentials and adds external network flakiness. An autonomous relational SQL database provides deterministic evaluation. |
| **Multi-User Login / Public Identity Gateway** | ❌ **Excluded** | The assignment explicitly defines a single target persona (*HR Manager*). Adding login/registration/password-reset screens introduces evaluation friction without contributing to solving the 10,000-employee Excel replacement problem. Elena Vance operates under an authenticated enterprise session with direct compliance access. |

> The official standalone requirements specification is also committed in [`REQUIREMENTS.md`](REQUIREMENTS.md).

---

## 💡 4. Core Features & Capabilities

1. **Executive Compensation Dashboard:**
   * Real-time Macro KPIs: Total Annual Payroll, Active Headcount, Mean & Median Base Salary, Min/Max Spread.
   * Salary Band Distribution Histogram: Categorized into `< $50K`, `$50K–$80K`, `$80K–$110K`, `$110K–$150K`, `$150K–$200K`, `$200K+`.
   * Department & Country Rollups: Instant drill-downs into department payroll allocations and regional workforce costs (US, UK, Germany, India, Singapore).
2. **Employee Directory & Multi-Criteria Search:**
   * High-speed paginated grid supporting 10,000+ employee records.
   * Search across name, employee code (`EMP-xxxx`), job title, and email.
   * Multi-attribute filters: Department, Country, Status (`ACTIVE`, `ON_LEAVE`, `TERMINATED`), and Min/Max Salary range.
3. **Salary Revision & Merit Simulation Tool:**
   * Live delta calculation: preview new base salary, total compensation, and exact percentage bump (`+3%`, `+5%`, `+10%`, custom).
   * Structured justification: Merit, Market Correction, Promotion, Retention, Cost of Living.
4. **Contextual Revision History Drawer:**
   * Chronological slide-out timeline per employee displaying their entire career pay trajectory.
5. **Filtered CSV Report Generation:**
   * Download compensation rosters matching current active filters directly to CSV for offline modeling in Excel or Google Sheets.
6. **System Audit & Compliance Log:**
   * Discrete access via header utility button or footer link to review immutable audit events, actors, timestamps, and modification diffs.

---

## 🚀 5. Quick Start (Local Development)

### Prerequisites
* **Java 21 or 24** (`java -version`)
* **Gradle Wrapper** (`gradlew.bat` / `./gradlew` included)
* **Node.js 20+** & **npm** (`node -v`, `npm -v`)

### 1. Start the Backend (Spring Boot 3 & Gradle)
```bash
cd backend

# Windows:
.\gradlew.bat bootRun

# Linux / macOS:
./gradlew bootRun
```
* **API Service:** `http://localhost:8080`
* **H2 Database Console:** `http://localhost:8080/h2-console`  
  * JDBC URL: `jdbc:h2:mem:salarydb`  
  * Username: `sa` | Password: *(blank)*

### 2. Start the Frontend (React 19, TypeScript & Vite)
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* **Web UI:** `http://localhost:5173`

---

## 🐳 6. Running with Docker Compose

Launch the full-stack system in isolated containers:
```bash
docker compose up --build
```
* **Frontend:** `http://localhost:3000`
* **Backend:** `http://localhost:8080`

---

## 📡 7. REST API Reference Summary

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/employees` | `GET` | Paginated search with multi-criteria filters (`keyword`, `department`, `country`, `status`, `minSalary`, `maxSalary`) |
| `/api/employees/{id}` | `GET` | Retrieve single employee profile |
| `/api/employees` | `POST` | Create new employee profile with initial compensation package |
| `/api/employees/{id}` | `PUT` | Update employee profile details |
| `/api/employees/{id}` | `DELETE` | Delete employee record (generates audit entry) |
| `/api/salaries/employees/{id}/revise` | `POST` | Execute salary revision, compute percentage delta, and record history |
| `/api/salaries/employees/{id}/history` | `GET` | Retrieve chronological revision history for an employee |
| `/api/salaries/recent-revisions` | `GET` | Retrieve latest organization-wide compensation revisions |
| `/api/analytics/dashboard` | `GET` | Calculate macro KPIs, distribution bands, and department/country rollups |
| `/api/analytics/export/csv` | `GET` | Stream filtered compensation roster as an RFC-compliant CSV |
| `/api/audit-logs` | `GET` | Retrieve paginated compliance audit trail |
| `/api/auth/me` | `GET` | Retrieve current HR Manager persona context |

---

## 👥 Author
* **Diya Khandelwal** — Candidate Submission for Technical Assessment (September 2026).
