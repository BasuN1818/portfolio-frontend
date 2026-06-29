@echo off
echo ====================================================
echo   NB Studio Portfolio - Starting Frontend & Backend
echo ====================================================
echo.

:: Start Backend Server
echo Starting Backend Server on Port 5000...
start "NB Studio - Backend" cmd /k "cd %~dp0\backend && npm start"

:: Start Frontend Server
echo Starting Frontend (Vite) Server...
start "NB Studio - Frontend" cmd /k "cd %~dp0 && npm run dev"

echo.
echo Both servers are launching. Please keep their windows open!
echo.
pause
