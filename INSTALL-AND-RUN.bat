@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo DS-TECHNOLOGIES - INSTALL AND RUN
 echo ==============================================

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed. Install Node.js 18+ first.
  pause
  exit /b 1
)

if not exist "backend\.env" (
  echo Creating backend\.env from example...
  copy /Y "backend\.env.example" "backend\.env" >nul
)

if not exist "backend\node_modules" (
  echo Installing backend packages...
  cd backend
  call npm install
  if errorlevel 1 goto :fail
  cd ..
)

if not exist "frontend\node_modules" (
  echo Installing frontend packages...
  cd frontend
  call npm install
  if errorlevel 1 goto :fail
  cd ..
)

echo.
echo [1/3] Seeding admin...
cd backend
call node seedAdmin.js
if errorlevel 1 goto :dbfail

echo [2/3] Seeding jobs...
call node seedJobs.js
if errorlevel 1 goto :dbfail

echo [3/3] Seeding employees and attendance...
call node seedEmployees.js
if errorlevel 1 goto :dbfail
call node seedAttendance.js
if errorlevel 1 goto :dbfail
cd ..

echo.
echo Starting backend and frontend in separate windows...
start "DS-TECHNOLOGIES BACKEND" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 2 /nobreak >nul
start "DS-TECHNOLOGIES FRONTEND" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Frontend: http://localhost:5173
 echo Backend : http://localhost:5000
 echo Admin   : admin@dstechnologies.com / admin123
 echo.
echo If MongoDB is not running, start MongoDB and run this file again.
pause
exit /b 0

:dbfail
cd ..
echo.
echo ERROR: MongoDB is not reachable or a seed failed.
echo Make sure MongoDB is running, then run INSTALL-AND-RUN.bat again.
pause
exit /b 1

:fail
echo.
echo ERROR: npm install failed. Check internet connection and npm output.
pause
exit /b 1
