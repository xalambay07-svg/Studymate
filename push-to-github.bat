@echo off
chcp 65001 > nul
echo ========================================================
echo   STUDYMATE - TỰ ĐỘNG ĐẨY TOÀN BỘ CODE LÊN GITHUB
echo   Tài khoản: xalambay07-svg / Studymate
echo ========================================================
echo.
echo Đang tải lên toàn bộ thư mục (pages, css, js, assets)...
echo.
git push --force origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   [THÀNH CÔNG RỰC RỠ!]
    echo   Toàn bộ website đã được tải lên GitHub thành công!
    echo   Website sẽ hoạt động tại:
    echo   https://xalambay07-svg.github.io/Studymate/
    echo ========================================================
) else (
    echo [LƯU Ý] Nếu có cửa sổ popup hiện lên trên màn hình,
    echo bạn hãy bấm "Sign in with your browser" để cấp quyền nhé!
)
echo.
pause
