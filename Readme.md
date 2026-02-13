# Research Tracker

A comprehensive application designed for researchers to manage, track, and analyze their research contributions. This tool integrates a robust Spring Boot backend with a dynamic Angular frontend to provide a seamless experience for managing research papers, authors, and metadata.

## 🚀 Key Features

- **Advanced Research Management**: Full CRUD operations for tracking research papers with detailed metadata.
- **Smart Metadata Fetching**: Automatically fetch paper titles, authors, publishers, and publication years using DOIs via the **Crossref API**.
- **Data Import & Export**: Import existing research data from CSV files and export your progress for external use.
- **Analytics Dashboard**: Comprehensive visualizations and statistics to track research impact and trends.
- **Interactive Portfolio**: A dedicated portfolio view featuring a timeline of contributions and a showcase of key research outputs.
- **Change History**: Detailed logs of updates and modifications to research entries for full transparency.

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 4.0.2 / Java 17
- **Database**: PostgreSQL (managed via JPA/Hibernate)
- **Data Processing**: OpenCSV for robust CSV handling
- **Testing**: JUnit and Spring Boot Test

### Frontend
- **Framework**: Angular 21
- **State Management**: RxJS for reactive data handling
- **Styling**: Vanilla CSS for premium, custom-tailored designs
- **Performance**: Angular SSR (Server-Side Rendering) for optimized loading

## 📁 Project Structure

```text
research-tracker/
├── backend/           # Spring Boot Application
│   ├── src/main/java/ # Java source code (Controllers, Services, Entities)
│   └── pom.xml        # Maven configuration and dependencies
├── frontend/          # Angular Web Interface
│   ├── src/app/       # Angular components and services
│   └── package.json   # Node.js dependencies and scripts
├── desktop/           # Future desktop application (Placeholder)
├── docs/              # Project documentation and assets
└── Research Archive V-Obaidul.xlsx # Initial research data source
```

## ⚙️ Getting Started

### Prerequisites
- JDK 17+
- Node.js & npm (latest versions)
- PostgreSQL

### Running the Backend
1. Navigate to the `backend` directory.
2. Configure your database in `src/main/resources/application.properties`.
3. Run using Maven:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
