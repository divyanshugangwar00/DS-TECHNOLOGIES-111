@echo off
taskkill /FI "WINDOWTITLE eq DS-TECHNOLOGIES BACKEND*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq DS-TECHNOLOGIES FRONTEND*" /T /F >nul 2>&1
echo DS-TECHNOLOGIES development windows stopped.
pause
