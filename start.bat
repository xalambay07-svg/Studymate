@echo off
chcp 65001 > nul
echo ========================================================
echo   📚 STUDYMATE - ACADEMIC COMPANION (CSE122)
echo   Đang khởi chạy máy chủ Web cục bộ trên cổng 3000...
echo ========================================================
echo.

start "" "http://localhost:3000/"
python -m http.server 3000
pause
