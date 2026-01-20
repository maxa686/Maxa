@echo off
chcp 65001 >nul
echo.
echo 🚀 Запускаю деплой...
echo.

:: Переход в папку скрипта
cd /d "%~dp0"

:: Проверяем, есть ли изменения
git diff-index --quiet HEAD --
if %errorlevel% == 0 (
    echo 🔹 Нет изменений. Завершаю.
    echo.
    pause
    exit /b
)

:: Добавляем все изменения
git add .

:: Делаем коммит с простым сообщением
git commit -m "Автодеплой: %date% %time:~0,5%"

:: Отправляем в GitHub
git push

:: Проверяем результат
if %errorlevel% == 0 (
    echo.
    echo ✅ Деплой завершён!
    echo 🌐 Проверь: https://maxa686.github.io/Maxa
) else (
    echo.
    echo ❌ Ошибка при отправке!
    echo    Проверь интернет или токен.
)

echo.
pause
