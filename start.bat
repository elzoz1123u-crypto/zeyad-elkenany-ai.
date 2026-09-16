@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is required. & pause & exit /b 1)
if not exist node_modules npm install
npm start
pause
