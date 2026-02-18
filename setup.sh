#!/bin/bash

# Cash Flow Dashboard - Setup Script
# This script sets up the backend and prepares for running both frontend and backend

echo "🚀 Cash Flow Dashboard - Setup Script"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend

if [ ! -d "node_modules" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Error installing backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend node_modules already exist"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo ""
        echo "⚠️  .env file not found!"
        echo ""
        echo "Creating .env from .env.example..."
        cp .env.example .env
        echo "✅ .env created"
        echo ""
        echo "📝 Please edit backend/.env and add your Twilio credentials:"
        echo "   - TWILIO_ACCOUNT_SID"
        echo "   - TWILIO_AUTH_TOKEN"
        echo "   - TWILIO_PHONE_NUMBER"
        echo ""
        echo "Then run: npm run dev"
    fi
else
    echo "✅ .env file exists"
fi

cd ..

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit backend/.env with your Twilio credentials"
echo "   - Get credentials from https://www.twilio.com/console"
echo ""
echo "2. Start the backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (Terminal 2):"
echo "   npm start"
echo ""
echo "4. Open http://localhost:4200 in your browser"
echo ""
echo "📚 For more details, see OTP_SETUP_GUIDE.md"
echo ""
