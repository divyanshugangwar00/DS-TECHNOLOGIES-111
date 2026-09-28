@echo off
setlocal
cd /d "%~dp0"
if not exist "backend\node_modules" (
  echo Backend dependencies not found. Run INSTALL-AND-RUN.bat first.
  pause
  exit /b 1
)
if not exist "frontend\node_modules" (
  echo Frontend dependencies not found. Run INSTALL-AND-RUN.bat first.
  pause
  exit /b 1
)
start "DS-TECHNOLOGIES BACKEND" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start "DS-TECHNOLOGIES FRONTEND" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Frontend: http://localhost:5173
echo Backend : http://localhost:5000
