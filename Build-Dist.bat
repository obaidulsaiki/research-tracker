@echo off
echo ==========================================
echo   🛠️ Research Tracker - Master Build
echo ==========================================
echo.

echo [1/3] Compiling Backend (Spring Boot)...
cd backend && call .\mvnw clean package -DskipTests && cd ..

echo.
echo [2/3] Compiling Frontend (Angular)...
cd frontend && call npm install && call npm run build:desktop && cd ..

echo.
echo [3/3] Packaging Desktop Application...
cd desktop && call npm install && call npm run package && cd ..

echo.
echo ==========================================
echo   ✅ Build Complete!
echo   Installer available in: desktop/dist/
echo ==========================================
pause
