@echo off
REM Cash Flow Dashboard - Setup Script for Windows
REM This script sets up the backend and prepares for running both frontend and backend

echo.
echo 🚀 Cash Flow Dashboard - Setup Script
echo ======================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend directory not found!
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend

if not exist "node_modules" (
    call npm install
    if %errorlevel% equ 0 (
        echo ✅ Backend dependencies installed successfully
    ) else (
        echo ❌ Error installing backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend node_modules already exist
)

REM Check if .env exists
if not exist ".env" (
    if exist ".env.example" (
        echo.
        echo ⚠️  .env file not found!
        echo.
        echo Creating .env from .env.example...
        copy .env.example .env
        echo ✅ .env created
        echo.
        echo 📝 Please edit backend\.env and add your Twilio credentials:
        echo    - TWILIO_ACCOUNT_SID
        echo    - TWILIO_AUTH_TOKEN
        echo    - TWILIO_PHONE_NUMBER
        echo.
        echo Then run: npm run dev
    )
) else (
    echo ✅ .env file exists
)

cd ..

echo.
echo ======================================
echo ✅ Setup Complete!
echo ======================================
echo.
echo 📋 Next Steps:
echo.
echo 1. Edit backend\.env with your Twilio credentials
echo    - Get credentials from https://www.twilio.com/console
echo.
echo 2. Start the backend ^(Terminal 1^):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the frontend ^(Terminal 2^):
echo    npm start
echo.
echo 4. Open http://localhost:4200 in your browser
echo.
echo 📚 For more details, see OTP_SETUP_GUIDE.md
echo.
pause
