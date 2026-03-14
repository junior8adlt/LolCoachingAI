@echo off
title LolCoachingAI - Starting...
color 0B

echo.
echo  ========================================
echo    LolCoachingAI - AI Coaching Overlay
echo  ========================================
echo.

cd /d "%~dp0"

:: ── Check Node.js ──
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install it from https://nodejs.org
    pause
    exit /b 1
)

:: ── Check Python ──
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Python not found. Backend AI coaching will not be available.
    echo           The overlay will still work with local analysis.
    echo.
    goto :skip_backend
)

:: ── Install npm dependencies if needed ──
if not exist "node_modules" (
    echo [SETUP] Installing npm dependencies...
    call npm install
    echo.
)

:: ── Setup Python venv and install deps if needed ──
if not exist "backend\venv" (
    echo [SETUP] Creating Python virtual environment...
    python -m venv backend\venv
    echo [SETUP] Installing Python dependencies...
    call backend\venv\Scripts\pip install -r backend\requirements.txt -q
    echo.
)

:: ── Load .env if exists ──
if exist ".env" (
    for /f "usebackq tokens=1,* delims==" %%a in (".env") do (
        set "%%a=%%b"
    )
)

:: ── Start Backend ──
echo [START] Starting Python backend on port 8420...
start /b "" cmd /c "backend\venv\Scripts\python backend\main.py > backend.log 2>&1"
timeout /t 2 /noq >nul

:skip_backend

:: ── Start Frontend + Electron ──
echo [START] Starting Electron overlay...
echo.
echo  ----------------------------------------
echo   Press F1 in-game to toggle the overlay
echo   Right-click tray icon for options
echo   Close this window to stop everything
echo  ----------------------------------------
echo.

call npm run dev

:: ── Cleanup: kill backend when Electron closes ──
echo.
echo [STOP] Shutting down...
taskkill /f /im python.exe /fi "WINDOWTITLE eq *backend*" >nul 2>&1
for /f "tokens=5" %%p in ('netstat -aon ^| findstr :8420 ^| findstr LISTENING') do (
    taskkill /f /pid %%p >nul 2>&1
)
echo [DONE] LolCoachingAI stopped.
