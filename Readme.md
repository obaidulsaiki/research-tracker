# 🔬 Academic Research Tracker (Premium Edition)

A high-performance, visually stunning ecosystem designed for modern researchers. This application simplifies the complexity of managing research pipelines—from initial hypothesis tracking to final publication—featuring professional-grade analytics and executive export capabilities.

---

## 🌟 Premium Features & Capabilities

### 🏛️ Exhibition-Grade Dashboard
Our "Premium 3.0" interface focuses on high-impact visual hierarchy and executive summaries.
- **Hero Impact Summary**: Large metric cards tracking **Total Projects**, **Published Works**, **Accepted Papers**, and **Active In-Progress** initiatives.
- **Deep Indigo & Electric Blue Theme**: A sophisticated color palette inspired by modern academic publishing.
- **Micro-Animations & Glassmorphism**: Smooth UI transitions and blurred translucent panels for a premium feel.

### 📄 Executive PDF Export (Exhibition Edition)
Generate professional, submission-ready portfolio reports with a single click.
- **Portrait-Optimized Layout**: Calibrated A4 Portrait design (680px width) ensures standard, top-to-bottom reading flow.
- **Pill Badge Metadata System**: 
    - **Venue Badges**: Highlighted with soft-pink pins (📍) for conference/journal names.
    - **IF & RANK Badges**: Color-coded badges for Impact Factor and Journal Quartile (Q1-Q4).
- **Status Accent Bars**: Visual indicators for research progress (Published, Accepted, Running, etc.).

### 🔍 Smart Research Pipeline
- **Unified Status Workflow**: A logical progression tracking your research lifecycle:
  `PUBLISHED` > `ACCEPTED` > `RUNNING` (Submitted) > `WORKING` > `HYPOTHESIS` > `REJECTED` > `WITHDRAWN`.
- **Intelligent Sorting**: Research items are prioritized by weight, ensuring your most impactful work is always showcased first.
- **DOI Metadata Integration**: Automatic fetching of citation metadata via Crossref API integration.

### 📊 Advanced Analytics & Tracking
- **Interactive Distribution Charts**: Visualize your research spread across different document types and publishers.
- **Collaborator Proximity**: Dedicated tracking of investigators and co-author stats.
- **Normalized Filtering**: Sophisticated database exploration with case-insensitive, normalized filtering for document types and publishers.

---

## 🛠️ Technical Deep Dive

### High-Performance Frontend
- **Framework**: Angular 21 (Signals Architecture)
- **Typography**: "Plus Jakarta Sans" & "Outfit" for cinematic readability.
- **Performance**: Reactive data flows using Angular Signals for zero-latency UI updates.
- **Print Engine**: Dedicated internal CSS injection for high-fidelity PDF rendering.

### Robust Backend Infrastructure
- **Framework**: Spring Boot 4.x / Java 17
- **Database**: PostgreSQL with Hibernate/JPA.
- **Data Security**: Secure service-level logic for research metrics and history logs.
- **Interoperability**: Advanced CSV/Excel processing engine with smart duplicate detection.

---

## 📁 Architectural Overview

```text
research-tracker/
├── backend/            # Executive Spring Boot Engine
│   ├── src/main/java/  # Services, Controllers, Entities, Repositories
│   └── src/resources/  # Database & Spring configuration
├── frontend/           # Premium Angular Interface
│   ├── src/app/        # Domain-driven components (Dashboard, Tabs, Modals)
│   ├── src/services/   # Reactive data providers & API clients
│   └── src/styles.css  # Global design system & animations
├── desktop/            # Native Desktop Shell (Electron Integration WIP)
└── docs/               # Technical designs & project walkthroughs
```

---

## 🚀 Getting Started

### 1. Database Configuration (PostgreSQL)
Create a database named `research_tracker` and update the `backend/src/main/resources/application.properties` file:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/research_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Backend Ignition
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm start
```
🔗 **Access**: `http://localhost:4200`

---

## 📝 Research Workflow Recommendation
1. **Import Context**: Start by importing your existing `Research Archive` CSV via the "Upload" button in the Dashboard.
2. **Metadata Sync**: Add new papers using their DOI for automatic metadata population.
3. **Executive Portfolio**: Use the "Export PDF" feature under the Download tab to generate your high-impact academic resume.

---
*Developed for the modern researcher who values both precision and presentation.*
