# Product Requirements Document & High-Level System Architecture
**Project:** CompPulse — Enterprise Salary Management Tool  
**Author:** Diya Khandelwal  
**Target Persona:** HR Manager (Head of Total Rewards)  
**Date:** September 2026  
**Status:** Approved & Implemented  

---

## 1. Executive Summary & Product Objective
Modern enterprises require clear visibility into their global compensation structures to maintain market competitiveness, ensure departmental and geographic parity, and responsibly govern salary revisions. **CompPulse** is a specialized, end-to-end Salary Management platform designed explicitly for an **HR Manager persona**. It provides real-time compensation analytics, multi-criteria employee search, auditable salary revision workflows with live delta modeling, and historical compensation tracking across international entities.

---

## 2. Core User Persona
* **Persona Name:** Elena Vance, Head of People & Total Rewards (HR Manager)
* **Key Goals:**
  1. Understand organizational salary spend across departments and countries.
  2. Simulate and execute salary revisions with percentage increase calculations and reason capture.
  3. Inspect chronological revision histories to ensure fair compensation progression.
  4. Ensure compliance through an immutable audit trail of all profile and compensation changes.

---

## 3. Scope Boundary: Deliberate Decisions & Trade-Offs

The scope of this solution was intentionally refined following direct requirements alignment with recruiting leadership. The deliberate trade-offs are summarized below:

| Functional Area | Scope Decision | Product Rationale & Engineering Justification |
| :--- | :--- | :--- |
| **Payroll Processing** | ❌ **OUT OF SCOPE** (Deliberately Excluded) | Payroll processing deals with transactional disbursements, local statutory tax withholding (W-2, PAYE, TDS), and social security deductions (PF/ESI/401k). The prompt centers on **compensation management** (how the organization pays people and plans budgets), not payroll operations. Omitting payroll prevents regional tax engine bloat while retaining high analytical signal. |
| **Approval Workflow** | ❌ **OUT OF SCOPE** (Multi-Tier Hierarchies Excluded) | Multiple approval tiers (L1 Manager → L2 Director → VP Finance) were clarified as unnecessary. A single HR Manager persona was confirmed. Eliminating approval queue state machines allows a streamlined, frictionless UX while capturing approver identity in the audit trail. |
| **HRMS Integrations** | ❌ **OUT OF SCOPE** (External APIs Excluded) | Syncing with Workday, BambooHR, or ADP requires third-party API keys and sandbox network dependencies. Keeping the data layer self-contained in a relational SQL database ensures zero-config portability and testability. |
| **Advanced RBAC** | ❌ **OUT OF SCOPE** (Multi-Role Permissions Excluded) | Multiple user roles (Employee self-service, Finance view-only, Payroll clerk) are omitted. A unified HR Manager session simplifies access control while strictly enforcing rate limiting at the API Gateway. |
| **Authentication & Access Control** | ✅ **IN SCOPE** (Enterprise Login Portal) | Dedicated login screen with credential verification (`POST /api/auth/login`). Only authorized HR administrators receive tokens; unauthorized emails return 401 Unauthorized. Evaluator credentials (`elena.vance@company.com` / `Password123!`) are pre-filled for immediate testing. |
| **Multi-Currency Global Engine** | ✅ **IN SCOPE** (5 Major Currencies) | Real-time currency conversions across USD ($), EUR (€), GBP (£), INR (₹), and SGD (S$) dynamically re-computing macro KPIs, distribution bands, and individual salaries. |
| **Salary Revision History** | ✅ **IN SCOPE** (Included as High-Value Feature) | Although marked optional, maintaining a chronological revision timeline (with previous vs. new base, bonus, % change, reason, and notes) is essential for compensation governance and demonstrates end-to-end domain maturity. |
| **Audit Logging** | ✅ **IN SCOPE** (Included as High-Value Feature) | An immutable audit log records all modifications, capturing action types (`UPDATE_SALARY`, `CREATE_EMPLOYEE`), actor attribution, timestamps, and payload diffs for complete governance. |
| **Analytics & Reporting** | ✅ **IN SCOPE** (Focused Total Rewards Analytics) | Total annual payroll, headcount, median & mean salary, min/max spread, department expenditure, country distribution, and compensation band histograms with one-click CSV export. |

---

## 4. High-Level Architecture (HLD Blueprint)

Implemented directly in accordance with the whiteboard architectural design:

<p align="center">
  <img src="images/architecture_hld.png" alt="High-Level Design Whiteboard Architecture" width="850"/>
</p>

```
+-----------------------------------------------------------------------------------+
|                                 HR USER (CLIENT)                                  |
|                      React 19 + TypeScript (Vite + Vanilla CSS)                    |
+------------------------------------------+----------------------------------------+
                                           |  HTTPS / REST / JSON
                                           v
+-----------------------------------------------------------------------------------+
|                                API GATEWAY LAYER                                  |
|   • HR Persona Authentication & Credential Verification (/api/auth/login)         |
|   • Sliding Window Rate Limiting Filter (180 requests / minute / IP)              |
|   • CORS Configuration & Global Exception Handling Advice                         |
+------------------------------------------+----------------------------------------+
                                           |
    +------------------+-------------------+------------------+------------------+
    |                  |                                      |                  |
    v                  v                                      v                  v
+-----------+  +----------------------------+  +-------------------+  +--------------+
| Employee  |  | Data Fetching / Search /   |  |  Salary Updation  |  |    Report    |
|  Profile  |  | Audit Service              |  |      Service      |  |  Generation  |
|Management |  | • Multi-Attribute Search   |  | • Delta & % Calc  |  |   Service    |
| • CRUD    |  | • Dept / Country Filtering |  | • Revision Logs   |  | • KPIs & Dist|
| • Depts   |  | • Pagination & Sorting     |  | • History Timeln  |  | • Dept/Region|
| • Status  |  | • Immutable Audit Trail    |  | • Reason Tracking |  | • CSV Export |
+-----+-----+  +-------------+--------------+  +---------+---------+  +-------+------+
      |                      |                           |                    |
      +----------------------+-------------+-------------+--------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                             REPOSITORY & DATA LAYER                               |
|        Spring Data JPA • Hibernate ORM • Type-Safe Queries & Aggregations         |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                               RELATIONAL SQL DATABASE                             |
|  • Employees (id, code, names, dept, org, country, currency, base, bonus, status) |
|  • Salary Revisions (id, emp_id, prev_base, new_base, %_change, reason, date)     |
|  • Audit Logs (id, entity_type, entity_id, action, actor, diff_details, timestamp)|
|                                                                                   |
|  Default: Embedded H2 (Zero-Setup Local Dev) | Cloud: PostgreSQL (Render / Prod)  |
+-----------------------------------------------------------------------------------+
```

---

## 5. Technology Stack & Infrastructure Specifications

### Core Frameworks & Runtimes
* **Backend:** Java 21 / 24, Spring Boot 3.4.3, Gradle 8.12.1 (`build.gradle.kts`), Spring Data JPA, Hibernate 6, Jakarta Validation.
* **Frontend:** React 19, TypeScript, Vite, Vanilla CSS Design System with CSS Custom Properties, Lucide Icons.
* **Local Database:** Embedded H2 Database with in-memory persistence and web console (`/h2-console`).

### Render Cloud Infrastructure Specifications (`render.yaml`)

#### 1. Managed Database Specifications (`salary-management-db`)
* **Engine:** Managed PostgreSQL 16 (ACID-compliant relational store).
* **Database Catalog:** `salarydb` owned by role `salary_database_user`.
* **Allocation:** Free Tier (1 GB disk storage, 256 MB RAM) co-located in Oregon, USA (`region: oregon`).
* **Connection Pooling:** Spring Boot HikariCP pool (`spring.datasource.url=${SPRING_DATASOURCE_URL}`) with max 10 active connections.
* **Schema Evolution:** Hibernate 6 `ddl-auto=update` ensuring non-destructive schema evolution.
* **Database Indexing:** Compound and B-Tree indexes on `base_salary`, `department`, `country`, `email`, and `employee_code` ensuring sub-50ms execution on analytical aggregations.

#### 2. Backend Server Specifications (`salary-management-backend`)
* **Environment:** Containerized Docker Web Service (`env: docker`).
* **Multi-Stage Container:**
  * Build Stage: `eclipse-temurin:21-jdk-alpine` compiling clean Spring Boot fat JAR.
  * Runtime Stage: `eclipse-temurin:21-jre-alpine` running as non-root unprivileged `appuser:appgroup` (~160 MB container footprint).
* **Resources & Scaling:** 512 MB RAM / 0.1 vCPU (Render Free Tier allocation).
* **Port Binding:** Listens on dynamic `$PORT` injected by cloud orchestrator (defaults to 8080).
* **Health Probing:** HTTP `GET /api/employees` readiness probe before traffic admission.
* **Traffic Protection:** Sliding-window rate limiter filter enforcing 180 requests/minute per client IP.

#### 3. Frontend Static Server Specifications (`salary-management-frontend`)
* **Environment:** Static Site Service (`env: static`).
* **Build Pipeline:** `cd frontend && npm install && npm run build` via Vite and TypeScript compiler.
* **Asset Distribution:** Global Anycast Edge CDN serving pre-compressed Brotli/Gzip static bundles from `./frontend/dist`.
* **Routing Rules:** Catch-all URL rewrite `/* -> /index.html` to support client-side SPA routing.
* **Security & TLS:** Automated Let's Encrypt TLS 1.3 certificate provisioning with HTTPS enforcement.
* **Cloud Resilience Engine:** Client-side exponential retry and reconnect controls engineered to handle free-tier cloud container cold starts transparently.

---

## 6. Success Metrics & Verification
1. **Compilation & Type Safety:** Clean compilation for both Java backend (Gradle: `./gradlew bootJar` / `gradlew build`) and React TypeScript frontend (`tsc -b && vite build`).
2. **Deterministic Seed State:** Pre-populated realistic roster of 20 international profiles with historic revisions to enable instant demonstration.
3. **Responsive UI:** Fluid execution on desktop and mobile displays with sub-50ms frontend responsiveness and real-time revision delta previews.
4. **Automated Unit Test Suites:** 100% test pass rate across 39 automated tests — 23 backend tests (JUnit 5 / AssertJ) and 16 frontend tests (Node test runner) validating CRUD, mathematics, currency exchange rates, and credential verification.
5. **Production Cloud Resilience:** Automated reconnect & retry capability handling sleeping free-tier Docker containers on Render seamlessly.
