# 🔬 Research Tracker (Professional Suite)

[![Tech Stack](https://img.shields.io/badge/Stack-Spring_Boot_%2B_Angular_21-blue.svg?style=for-the-badge&logo=spring)](https://github.com/obaidulsaiki/research-tracker)
[![License](https://img.shields.io/badge/Status-Internal_Development-orange.svg?style=for-the-badge)](https://github.com/obaidulsaiki/research-tracker)

A high-fidelity academic ecosystem designed for elite researchers. This platform streamlines the research lifecycle—from hypothesis tracking to professional publication—featuring real-time analytics and enterprise-grade export capabilities.

---

## 🚀 Key Feature Highlights

### 🏛️ Premium Intelligence Dashboard
Our **Next-Gen Interface** focuses on executive summaries and high-impact visual hierarchy.
- **Dynamic Metric Engine**: Real-time tracking of **Total Projects**, **Q1 Quality Markers**, and **Publication Success Rates**.
- **Interactive Analytics**: Data-driven insights into your research distribution across journals and conferences.
- **Glassmorphic UI**: Sophisticated design with light/dark theme support and premium micro-animations.

### 🛡️ Autonomous Data Integrity
- **Scheduled Auto-Backup**: Set-and-forget file-based redundancy. Choose between **4h**, **12h**, or **24h** intervals.
- **Instant Snapshot**: One-click manual backup trigger to secure your database immediately.
- **Automatic Sync**: Ensures your research archive is always safe on the server filesystem.

### 📄 Executive Export Engine
- **Professional PDF**: Submission-ready portfolios with academic badges (IF, Rank, Quartile).
- **Enterprise Excel**: Complex spreadsheet generation for deep data analysis.
- **Portable CSV**: Universal data compatibility for research sharing.

### 🌍 Optimized Public Scholar Profile
- **Clean Aesthetics**: A curated, high-performance view for public showcasing.
- **Privacy Centric**: Selective visibility controls (Public vs. Internal).
- **Refined Branding**: Elegant presentation without development versioning or unnecessary noise.

---

## 🛠️ Technical Architecture

### 🧱 Robust Backend (Spring Boot Core)
*Powering the research engine with security and speed.*
- **Core Strategy**: Spring Boot 3.4.x / Java 17
- **Data Layer**: Hibernate / JPA for PostgreSQL persistence.
- **Parsing Engine**: OpenCSV for high-performance data hydration.
- **Scheduling**: Spring @Scheduled tasks for autonomous backup management.

### ⚡ Reactive Frontend (Angular Signals)
*A state-of-the-art interface built for precision.*
- **Version**: Angular 21 (Latest standalone architecture)
- **State Management**: Reactive data flows via **Angular Signals**.
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

## 📡 API Catalog (REST Endpoints)

### 📄 Research Management (`/api/research`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Retrieve the complete research archive |
| `GET` | `/{id}` | Fetch detailed data for a specific record |
| `POST` | `/` | Save a new paper or update existing item |
| `DELETE` | `/{id}` | Permanently remove a research record |
| `GET` | `/analytics` | Real-time impact & distribution summary |
| `GET` | `/export` | Download database as `research_portfolio.csv` |
| `POST` | `/import` | Bulk upload via CSV file stream |

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
