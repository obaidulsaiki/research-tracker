@echo off
echo ==========================================
echo   🚀 Research Tracker - One-Click Launch
echo ==========================================
echo.
echo [NOTE] Ensure PostgreSQL is running in the background.
echo.

echo [1/3] Starting Backend Engine...
start /b cmd /c "cd backend && .\mvnw spring-boot:run"

echo [2/3] Starting Frontend Dev Server...
start /b cmd /c "cd frontend && npm start"

echo [3/3] Launching Desktop Shell...
echo.
echo The application is waking up... 
echo It may take a few moments for the dashboard to appear.
echo.

cd desktop && npm start

echo.
echo ==========================================
echo   Application Session Ended.
echo ==========================================
pause

