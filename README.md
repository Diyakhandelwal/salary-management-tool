# CompPulse — Enterprise Salary Management Tool

[![Java](https://img.shields.io/badge/Java-21%20%2F%2024-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Gradle](https://img.shields.io/badge/Gradle-8.12.1-02303A.svg?logo=gradle)](https://gradle.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

An end-to-end, full-stack **Salary & Total Rewards Management Tool** designed for an **HR Manager persona**. Built with **Java / Spring Boot 3** on the backend and **React / TypeScript** on the frontend, featuring executive compensation analytics, multi-criteria employee search, live revision percentage calculators, chronological salary history timelines, and immutable audit logging.

---

## 📸 System Highlights & Architecture

Built in direct accordance with the High-Level Design (HLD) architecture specification:

```
[HR User] ──> [API Gateway (Auth + Rate Limiter)]
                     │
       ┌─────────────┼─────────────┬─────────────┐
       ▼             ▼             ▼             ▼
 [Employee     [Search / Data  [Salary       [Report /
  Profile       Fetching &      Updation      Analytics
  Management]   Audit Service]  Service]      Service]
       │             │             │             │
       └─────────────┴──────┬──────┴─────────────┘
                            ▼
                  [Repository Layer (JPA)]
                            ▼
                  [SQL Database (H2 / Postgres)]
```

### Key Modules & Capabilities:
1. **Executive Compensation Analytics:**
   - Real-time KPIs: Total Annual Payroll, Active Headcount, Mean & Median Base Salary, Min/Max Spread.
   - Interactive Visualizations: Salary distribution brackets/histogram (<$50K to $200K+), Department budget allocation, Geographic expenditure across 5 operating regions (US, UK, India, Germany, Singapore).
   - One-Click CSV Roster Export.
2. **Employee Directory & Multi-Criteria Search:**
   - Instant search across name, employee code (`EMP-xxxx`), job title, and email.
   - Filter chips by Department, Country, Status, and Min/Max Salary range slider.
   - Sortable table with active status badges.
3. **Salary Revision & Compensation Modeling:**
   - Real-time delta calculations: percentage bump (`+%`) and dollar change.
   - Revision reason tagging (Annual Merit, Promotion, Market Benchmark, Retention, Cost of Living).
   - Approval recording under the single HR Manager persona (*Elena Vance*).
4. **Chronological Revision History Timeline:**
   - Slide-out drawer displaying an employee's full compensation journey from initial offer to current revision.
5. **Audit & Compliance Trail:**
   - Immutable log capturing all employee creation, profile edits, salary revisions, actor IDs, timestamps, and modification diffs.
6. **API Gateway Simulation:**
   - In-memory sliding window rate limiting (180 requests/min per IP) returning `429 Too Many Requests` on abuse.
   - Authenticated HR Persona token simulation (`X-HR-User-Role`).

---

## 📋 One-Page Requirements & Scope Trade-Offs

Per the recruiter's explicit requirements review, deliberate scope boundaries were documented before development:

| Feature | Scope Status | Rationale |
| :--- | :--- | :--- |
| **Payroll Processing** | ❌ **Excluded** | Focused on compensation planning rather than operational payroll runs, tax withholdings, and disbursement. |
| **Multi-Tier Approvals** | ❌ **Excluded** | Single HR Manager persona confirmed by recruiter; avoids unnecessary queue state machines. |
| **HRMS Integrations** | ❌ **Excluded** | Self-contained SQL database avoids third-party sandbox dependencies. |
| **Advanced RBAC** | ❌ **Excluded** | Single HR Manager persona sufficient. |
| **Salary Revision History** | ✅ **Included** | High-value capability showing compensation trajectory over time. |
| **Audit Trail** | ✅ **Included** | Enterprise compliance requirement for logging pay changes. |

> Detailed documentation is available in [`docs/REQUIREMENTS_AND_ARCHITECTURE.md`](docs/REQUIREMENTS_AND_ARCHITECTURE.md) and inside the running application under the **HLD & PRD Spec** tab.

---

## 🚀 Quick Start (Local Development)

### Prerequisites:
- **Java 21 or 24** (`java -version`)
- **Gradle 8+** or the included Gradle Wrapper (`gradlew.bat` / `./gradlew`)
- **Node.js 20+** & **npm** (`node -v`, `npm -v`)

### 1. Start the Spring Boot Backend (Gradle):
```bash
cd backend
# Windows:
.\gradlew.bat bootRun

# Linux / macOS:
./gradlew bootRun
```
* Backend runs at: `http://localhost:8080`
* H2 Database Web Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:salarydb`, User: `sa`, Password: *empty*)
* Seed data: The backend automatically seeds 20 realistic global employee profiles and historical revisions on initial boot!

### 2. Start the React TypeScript Frontend:
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* Frontend runs at: `http://localhost:5173`

---

## 🐳 Running with Docker & Docker Compose

To launch both backend and frontend in isolated containers with a single command:

```bash
docker compose up --build
```
* Frontend accessible at: `http://localhost:3000`
* Backend API accessible at: `http://localhost:8080`

---

## ☁️ Deployment Guide (Render Free Cloud Hosting)

This repository includes a ready-to-deploy [`render.yaml`](render.yaml) blueprint.

### Option A: One-Click Render Blueprint
1. Push this repository to GitHub.
2. Log in to [Render.com](https://render.com).
3. Click **New +** -> **Blueprint**.
4. Select your repository. Render will automatically detect `render.yaml` and provision:
   - Backend Web Service (Docker / Java 21)
   - Frontend Static Site (Vite build)
5. Click **Apply**.

### Option B: Manual Free Web Service Setup on Render
1. **Backend Web Service:**
   - **Environment:** Docker
   - **Root Directory:** `backend`
   - **Docker Context:** `./backend`
   - **Port:** `8080`
   - **Health Check Path:** `/api/auth/me`
2. **Frontend Static Site:**
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variable:** `VITE_API_URL=https://<your-backend-service>.onrender.com/api`

---

## 📡 REST API Reference Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/employees` | `GET` | Paginated employee search with multi-criteria filters |
| `/api/employees/{id}` | `GET` | Retrieve single employee profile |
| `/api/employees` | `POST` | Create new employee with starting compensation |
| `/api/employees/{id}` | `PUT` | Update employee profile details |
| `/api/employees/{id}` | `DELETE` | Delete employee profile (audited) |
| `/api/salaries/employees/{id}/revise` | `POST` | Execute salary revision, compute delta %, and append history |
| `/api/salaries/employees/{id}/history` | `GET` | Get chronological salary revision timeline for employee |
| `/api/salaries/recent-revisions` | `GET` | Get top 10 organization-wide recent salary adjustments |
| `/api/analytics/dashboard` | `GET` | Retrieve executive compensation KPIs, distribution bands, and breakdowns |
| `/api/analytics/export/csv` | `GET` | Download full compensation roster as CSV file |
| `/api/audit-logs` | `GET` | Retrieve paginated compliance audit trail |
| `/api/auth/me` | `GET` | Retrieve current HR Manager persona session |

---

## 👥 Contributors & Author
* **Diya Khandelwal** — Candidate Submission for Technical Assessment (September 2026).
