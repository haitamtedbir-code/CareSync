@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Installe Node.js 22 ou superieur, puis relance ce fichier.
  pause
  exit /b 1
)
node server.mjs --open
if errorlevel 1 pause
