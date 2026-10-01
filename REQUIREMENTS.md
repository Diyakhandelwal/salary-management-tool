# ACME Org — Salary Management Software
## One-Page Requirements & System Design Specification

### 1. Goal
Build employee salary management software for **ACME org**, an international enterprise with **10,000 employees** across multiple global regions. The primary objective is to replace tedious, error-prone spreadsheets with an intuitive, auditable web application that enables the organization's HR leadership to answer macro-level questions about how the organization compensates its workforce, simulate merit revisions, and maintain global pay governance.

---

### 2. User Persona
* **Target User:** **Elena Vance — Head of People & Total Rewards (HR Manager)**
* **Responsibilities:**
  * Monitoring organizational payroll distribution and budget allocations across departments and geographies.
  * Executing compensation reviews and merit revisions with real-time percentage simulations.
  * Maintaining pay equity and regulatory compliance through auditable modification records.
  * Generating executive reports and customized roster exports for Finance and C-suite reviews.

---

### 3. Scope & Core Features

| Feature Module | Capabilities |
| :--- | :--- |
| **Enterprise Authentication & Access Control** | • Dedicated login portal guarding workforce compensation data.<br>• Secure credential verification (`POST /api/auth/login`) with 401 Unauthorized rejection for invalid or altered emails.<br>• Pre-filled evaluator credentials (`elena.vance@company.com` / `Password123!`) for friction-free evaluation. |
| **Executive Analytics & Compensation Insights** | • Macro KPIs: Total Annual Payroll, Headcount, Average Salary, Median Salary, and Salary Range.<br>• Salary Band Distribution Histogram (`< $50K`, `$50K–$80K`, `$80K–$110K`, `$110K–$150K`, `$150K–$200K`, `$200K+`).<br>• Real-time Department & Country payroll rollups with average, min, and max compensation. |
| **Multi-Currency Global Switcher** | • Instant on-the-fly currency conversion across 5 operating currencies (USD, EUR, GBP, INR, SGD).<br>• Live conversion rates dynamically updating executive cards, distributions, and individual compensation rows. |
| **Employee Directory & Multi-Attribute Search** | • Fast paginated grid supporting 10,000+ employee records.<br>• Dynamic search across name, employee code (`EMP-...`), title, and email.<br>• Compound filtering by Department, Country, Employment Status, and Min/Max Salary range.<br>• Complete Employee Lifecycle CRUD (Create, Read, Update, Delete). |
| **Salary Revision Tool & Simulation** | • Live delta calculation: preview new base pay, total compensation, and exact percentage increase (+3%, +5%, +10%, custom).<br>• Structured revision justification tracking (Merit, Market Correction, Promotion, Internal Equity).<br>• Automatic timestamping and approver attribution. |
| **Contextual Salary Revision History** | • Chronological slide-out timeline drawer per employee showing compensation progression from hire date to present.<br>• Historical milestone markers with effective dates, previous vs. new base salary, and rationale. |
| **Filtered Report Generation (CSV Export)** | • On-demand export of compensation rosters into formatted CSV.<br>• Supports export of entire workforce (10,000 records) or filtered slices matching active search parameters. |
| **Immutable System Audit Trail** | • Forensic event logging for all data modifications (`CREATE_EMPLOYEE`, `UPDATE_SALARY`, `UPDATE_PROFILE`, `DELETE_EMPLOYEE`).<br>• Records authorized actor, exact UTC timestamp, summary, and payload modification diff. |

---

### 4. Deliberately Left Out & Product Reasoning

In alignment with recruiter guidance from Sandli Srivastava and senior product judgment, the following features are intentionally excluded to maintain high engineering quality on the core problem:

1. **Transactional Payroll Processing & Tax Withholding:**
   * *Reasoning:* Payroll disbursement involves bank clearinghouse integrations, local tax withholding (W-2, PAYE, TDS), and statutory deductions (401k, PF, ESI). The assessment prompt focuses strictly on **salary management and compensation insights**. Tax execution adds regional regulatory bloat without improving total rewards decision-making.
2. **Multi-Tier Approval State Machines:**
   * *Reasoning:* Recruiter explicitly clarified that multiple approval chains (L1 &rarr; L2 &rarr; Finance VP) are not required and a single HR Manager persona is sufficient. Eliminating multi-party queue overhead ensures immediate execution with complete single-actor auditability.
3. **Public Self-Registration & Multi-Tenant Identity Systems:**
   * *Reasoning:* The prompt explicitly designates a single target persona: *"HR Manager of the org"*. While an enterprise credential verification portal is implemented to secure the application against unauthorized emails, public sign-up flows, password recovery, and multi-tenant identity systems were excluded to prevent evaluation friction for hiring managers reviewing the tool.
4. **Third-Party HRMS Synchronization (Workday / BambooHR / ADP):**
   * *Reasoning:* External SOAP/REST sync introduces third-party sandbox dependencies and network flakiness. A self-contained, high-performance relational database provides full autonomy and deterministic evaluation.

---

### 5. Architectural & Technical Decisions

* **Backend:** Java 21, Spring Boot 3.4.3, Spring Data JPA / Hibernate 6, H2 in-memory relational database (PostgreSQL-ready for Render cloud deployment).
* **Build System:** Gradle (Kotlin DSL, `gradlew.bat` / `./gradlew`).
* **Frontend:** React 19, TypeScript, Vite, Vanilla CSS with curated warm white & slight yellow design tokens.
* **Testing & Quality Assurance:** 39 automated unit tests across backend (23 JUnit 5 tests) and frontend (16 Node test runner tests) with 100% pass rate.
* **Security & Performance:** Sliding-window rate limiting filter (180 req/min), database indexes on `baseSalary`, `department`, and `country`, and indexed search specifications for sub-50ms query execution across 10,000 records.
* **Cloud Resilience:** Client-side exponential retry and reconnect controls engineered to handle free-tier cloud container cold starts transparently.
