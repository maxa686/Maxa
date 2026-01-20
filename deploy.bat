@echo off
echo.
echo 🚀 Запускаю деплой...
echo.

:: Переход в папку, где лежит этот скрипт
cd /d "%~dp0"

:: Проверить, есть ли изменения
git diff-index --quiet HEAD --
if %errorlevel% equ 0 (
    echo 🔹 Нет изменений. Завершаю.
    echo.
    pause
    exit /b
)

:: Добавить все изменения
git add .

:: Сделать коммит
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set commit_msg=Деплой: %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%
git commit -m "%commit_msg%"

:: Отправить в GitHub
git push origin main

:: Проверить, успешно ли всё
if %errorlevel% equ 0 (
    echo.
    echo ✅ Деплой завершён!
    echo 📦 Проверь: https://maxa686.github.io/Maxa
) else (
    echo.
    echo ❌ Ошибка при отправке!
    echo    Проверь подключение или токен.
)

echo.
pause
