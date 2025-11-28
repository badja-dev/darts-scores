@echo off
echo ========================================
echo   Starting Darts Scores - Backend
echo ========================================
echo.
cd backend
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting backend server...
echo Keep this window open while using the app!
echo.
call npm start
pause
