# 🔬 Research Tracker (Professional Suite)

[![Tech Stack](https://img.shields.io/badge/Stack-Spring_Boot_%2B_Angular_21-blue.svg?style=for-the-badge&logo=spring)](https://github.com/obaidulsaiki/research-tracker)
[![License](https://img.shields.io/badge/Status-Internal_Development-orange.svg?style=for-the-badge)](https://github.com/obaidulsaiki/research-tracker)

A high-fidelity academic ecosystem designed for elite researchers. This platform streamlines the research lifecycle—from hypothesis tracking to professional publication—featuring real-time analytics and enterprise-grade export capabilities.

**Tech Stack**: Java Spring Boot, Angular, TypeScript, PostgreSQL, Electron

---

## 🚀 Key Feature Highlights

### 🏛️ Premium Intelligence Dashboard
- **Executive Overview**: Dynamic top-level metric engine tracking overall volume, Q1 Quality Markers, and aggregate success rates.
- **Glassmorphic UI**: Sophisticated design language with rich micro-animations and clean visual hierarchy.

### 📅 Global Deadlines & Conference Timeline
- **Milestone Tracker**: Visual timeline mapping submissions, notifications, camera-ready deadlines, and conference dates.
- **Paper Linkage & Checklists**: Directly associate research papers to conferences, seamlessly tracking required tasks (e.g. Copyright, Camera Ready, Payment). 

### 📊 Deep Analytics & Author Intelligence
- **Data-Driven Insights**: Granular visualizations of research distributions, status flows, and venue mapping.
- **Co-Author Network**: Advanced matrix tracking of collaboration frequency, individual author impact, and detailed contributor portfolios.

### � Research Archive (The Vault)
- **Advanced Filtering**: Live, signal-driven text search and multi-dimensional filtering across all research dimensions.
- **Status Workflows**: Smooth transitions for tracking states like `SUBMITTED`, `ACCEPTED`, `REJECTED`, or `PUBLISHED`.

### 🛡️ System Audit Log & Data Integrity
- **Mutation Tracking**: A comprehensive history tab logging every `CREATE`, `UPDATE`, and `DELETE` event to maintain total architectural traceability.
- **Autonomous Backup**: Set-and-forget file-based redundancy at fixed intervals (4h, 12h, 24h) directly on the host filesystem.

### 📄 Executive Export Engine
- **Professional PDF**: Submission-ready portfolios with academic badges (IF, Rank, Quartile).
- **Enterprise Excel & CSV**: Complex spreadsheet generation for deep analysis and universal data portability.

---

## 🛠️ Technical Architecture

### 🧱 Robust Backend (Spring Boot Core)
*Powering the research engine with security and speed.*
- **Core Strategy**: Spring Boot 3.4.x / Java 17
- **Data Layer**: Hibernate / JPA for PostgreSQL persistence.
- **Parsing Engine**: OpenCSV for high-performance data hydration.
- **Scheduling**: Spring @Scheduled tasks for autonomous backup management.

### ⚡ Reactive Frontend (Angular Signals & Nested Routing)
*A state-of-the-art interface built for precision.*
- **Version**: Angular Latest Standalone Architecture
- **State Management**: Reactive data flows via **Angular Signals**.
- **Navigation**: Clean, scalable **Nested Routing** architecture for seamless localized view updates without entire component re-renders.
- **Typography**: "Plus Jakarta Sans" & "Outfit" for premium readability.
- **Design System**: High-custom CSS utility layer for maximum aesthetic control.

---

## 📦 Core Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | `Spring Web` | RESTful API orchestration |
| | `Spring Data JPA` | Persistent storage management |
| | `Lombok` | Drastic reduction of boilerplate |
| | `OpenCSV` | Complex CSV processing engine |
| **Frontend** | `Angular core` | Reactive component architecture |
| | `RxJS` | Async stream management |
| | `read-excel-file` | On-the-fly Excel ingestion |
| **Desktop** | `Electron` | Native OS bridge (Win/Mac/Linux) |

---

## 📡 API Catalog (~29 REST Endpoints)

### 📄 Research Management (`/api/research`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieve the complete research archive |
| `GET` | `/{id}` | Fetch detailed data for a specific record |
| `POST` | `/` | Save a new paper or update existing item |
| `POST` | `/bulk` | Batch upload multiple records |
| `DELETE` | `/{id}` | Permanently remove a research record |
| `DELETE` | `/all` | Wipe all research records |
| `GET` | `/journal-lookup` | Auto-complete journal and conference venues |
| `POST` | `/check-duplicate` | Verify uniqueness of a paper |
| `GET` | `/analytics` | Real-time impact & distribution summary |
| `GET` | `/history` | Full system audit log history |
| `GET` | `/export` | Download standard data export |
| `GET` | `/export/excel` | Comprehensive Excel spreadsheet generation |
| `GET` | `/export/pdf` | Professional PDF portfolio layout |
| `POST` | `/import` | Bulk upload via file stream |

### 📅 Conference & Deadlines (`/api/conferences`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all active and upcoming conferences |
| `POST` | `/` | Add a new conference target |
| `PUT` | `/{id}` | Update existing conference dates |
| `DELETE` | `/{id}` | Remove a conference |
| `POST` | `/sync` | Force synchronize external dates |

### 📋 Checklist & Milestones (`/api/checklists` & `/api/milestones`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/{researchId}/toggle` | Toggle a camera-ready or publication checklist task |
| `GET` | `/{id}/checklist` | Fetch pending milestones for a specific paper |

### ⚙️ System Configuration (`/api/settings`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieve current backup intervals & preferences |
| `POST` | `/` | Update auto-backup status (Enable/Disable) |
| `POST` | `/trigger-backup` | Manual server-side backup execution |


---

## ⚙️ Development Ignition

### 1️⃣ Database Strategy
Ensure a PostgreSQL instance is running with a database named `research_tracker`.
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/research_tracker
spring.datasource.username=postgres
spring.datasource.password=your_secret_password
```

### 2️⃣ Start the Engine
```bash
# Backend (Server)
cd backend && ./mvnw spring-boot:run

# Frontend (Web UI)
cd frontend && npm install && npm start
```

### 3️⃣ Desktop Launch (Optional)
```bash
# Electron Wrapper
cd desktop && npm install && npm start
```

---
*Built with Precision for the Academic Community. Still evolving, ever-improving.*
