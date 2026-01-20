@echo off
echo.
echo 🚀 Запускаю деплой...
echo.

:: Переход в папку, где лежит этот скрипт
cd /d "%~dp0"

:: Добавить все изменения
git add .

:: Проверить, есть ли что коммитить
if %errorlevel% neq 0 goto error

:: Сделать коммит
git commit -m "Деплой: %date% %time%"

:: Проверить, был ли коммит (если нет изменений — не пушим)
if %errorlevel% equ 1 exit /b

:: Отправить в GitHub
git push origin main

echo.
echo ✅ Деплой завершён!
echo 📦 Проверь: https://maxa686.github.io/Maxa
echo.
pause
exit /b

:error
echo.
echo ❌ Ошибка при добавлении файлов
pause
