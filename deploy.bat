@echo off
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

:: Делаем коммит с датой и временем
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set msg=Автодеплой: %datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%
git commit -m "%msg%"

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
