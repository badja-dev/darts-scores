@echo off
echo ========================================
echo   Starting Darts Scores - Frontend
echo ========================================
echo.
cd frontend
echo Installing dependencies (if needed)...
call npm install
echo.
echo Starting frontend server...
echo Your browser should open automatically.
echo If not, go to: http://localhost:5173
echo.
echo Keep this window open while using the app!
echo.
call npm run dev
pause
