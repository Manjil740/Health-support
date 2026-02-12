cls

@echo off
REM Startup script for HealthGuard - runs both backend and frontend on Windows

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ========================================
echo   HealthGuard - Healthcare Platform
echo ========================================
echo.

if not exist "backend" (
    echo Error: Backend directory not found
    pause
    exit /b 1
)

if not exist "app" (
    echo Error: Frontend directory not found
    pause
    exit /b 1
)

REM Setup backend
echo Setting up backend...
cd backend

if not exist "myenv" (
    echo Creating Python virtual environment...
    python -m venv myenv
)

call myenv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -q -r requirements.txt

echo [32mBackend ready[0m
echo.

REM Start backend
echo Starting backend server (port 8000)...
start "HealthGuard Backend" python app.py

REM Wait for backend to start
timeout /t 2 /nobreak > nul

REM Setup frontend
echo Setting up frontend...
cd ..\app

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo [32mFrontend ready[0m
echo.

REM Start frontend
echo Starting frontend server (port 5173)...
start "HealthGuard Frontend" cmd /k npm run dev

echo.
echo ========================================
echo Application started successfully!
echo ========================================
echo.
echo Frontend:  http://localhost:5173
echo Backend:   http://localhost:8000
echo Health:    http://localhost:8000/api/health/
echo.
echo Press any key to continue...
pause
