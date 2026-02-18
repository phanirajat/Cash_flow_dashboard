# 💰 Cash Flow Dashboard with OTP Authentication

A complete business **expense & income tracking application** with **real SMS-based OTP authentication** using Twilio.

## ✨ Features

### Dashboard Features
✅ **Income Tracking** - Add income with sender name, amount, and date  
✅ **Expense Tracking** - Add expenses with description, amount, and date  
✅ **Monthly Dashboard** - View monthly income, expenses, and net profit  
✅ **Yearly Dashboard** - View annual summaries with month-by-month breakdown  
✅ **Data Persistence** - All data stored locally (per user)  
✅ **INR Currency** - Support for Indian Rupee (₹)  

### Authentication Features
✅ **Phone-based OTP** - Secure login with SMS verification  
✅ **Real SMS Delivery** - Twilio integration for actual SMS  
✅ **6-digit OTP** - Randomly generated per request  
✅ **5-minute expiry** - Time-limited security  
✅ **3 attempt limit** - Brute-force protection  
✅ **User Isolation** - Each phone number has separate data  

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 16+
- Twilio account (free at https://www.twilio.com)

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Twilio credentials
```

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### 4. Access Application
Open http://localhost:4200 in your browser

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_REFERENCE.md** | Quick lookup & checklists |
| **OTP_SETUP_GUIDE.md** | Detailed setup instructions |
| **IMPLEMENTATION_SUMMARY.md** | Architecture & implementation |
| **backend/README.md** | Backend-specific documentation |

## 🏗️ Architecture

### Frontend (Angular 21)
- **Framework:** Angular 21 (standalone components)
- **State Management:** Signals + Computed
- **Change Detection:** OnPush
- **Port:** 4200

### Backend (Express.js)
- **Framework:** Express.js
- **Authentication:** Twilio SMS OTP
- **OTP Storage:** In-memory (can be upgraded to database)
- **Port:** 3001

### Database
- **Current:** Browser localStorage (user-specific keys)
- **Production:** Recommended to use MongoDB, PostgreSQL, or Redis

## 📂 Project Structure

```
cash-flow-dashboard/
├── src/                              # Angular Frontend
│   ├── app/
│   │   ├── services/
│   │   │   ├── auth.service.ts      # OTP backend integration
│   │   │   └── cash-flow.service.ts # Transaction state
│   │   ├── components/
│   │   │   ├── login/               # OTP 2-step login
│   │   │   ├── income-form/         # Add income entries
│   │   │   ├── expense-form/        # Add expense entries
│   │   │   ├── monthly-dashboard/   # Monthly view
│   │   │   └── yearly-dashboard/    # Yearly view
│   │   ├── guards/
│   │   │   └── auth.guard.ts        # Route protection
│   │   └── ...
│   └── main.ts
├── backend/                          # Express Backend
│   ├── src/
│   │   ├── server.ts                # Express setup
│   │   ├── services/
│   │   │   └── otp.service.ts      # Twilio OTP logic
│   │   └── routes/
│   │       └── auth.routes.ts      # API endpoints
│   ├── package.json
│   └── .env                         # Twilio credentials
├── OTP_SETUP_GUIDE.md
├── IMPLEMENTATION_SUMMARY.md
├── QUICK_REFERENCE.md
└── setup.bat / setup.sh
```

## 🔐 Authentication Flow

```
User Phone Input → Generate OTP → Send via SMS → User Receives SMS
     ↓                                                    ↓
Verify Phone Format                          User Enters OTP in Form
     ↓                                                    ↓
Verify OTP ← Backend ← Check Expiry & Attempts ← OTP Submission
     ↓
Login Successful → Dashboard → Isolated User Data
```

## 🎯 API Endpoints

**Base:** `http://localhost:3001/api/auth/`

```
POST /send-otp           - Send OTP via SMS
POST /verify-otp         - Verify OTP and login
POST /resend-otp         - Resend OTP
GET  /otp-expiry/:phone  - Get OTP expiry time
```

## 🧪 Testing

### With Real SMS
1. Get Twilio credentials
2. Configure backend/.env
3. Run backend and frontend
4. Enter verified phone number
5. Receive real SMS with OTP

### Demo Mode (Development)
OTP appears in backend console logs during development.

## 📊 Transaction Data

### Income Entry
- Sender Name (required)
- Amount in ₹ (required)
- Date (required)

### Expense Entry
- Description (required)
- Amount in ₹ (required)
- Date (required)

### Dashboards
- **Monthly:** Filter by month-year, view month-specific totals
- **Yearly:** Filter by year, view year-specific totals with monthly breakdown

## 🔒 Security

- ✅ OTP verified server-side only
- ✅ SMS-based delivery (can't be intercepted)
- ✅ Time-limited OTP (5 minutes)
- ✅ Rate limited (3 attempts)
- ✅ Per-user data isolation
- ✅ CORS protected
- ✅ Secure production recommendations included

## 🚀 Deployment

### Frontend Deployment
```bash
ng build --configuration production
# Deploy dist/ folder to Netlify, Vercel, or AWS S3
```

### Backend Deployment
Recommendations:
- Heroku, Railway, or Render for Node.js
- Use environment secrets for credentials
- Configure CORS for production domain
- Replace in-memory storage with database
- Enable proper logging and monitoring

## 🆘 Troubleshooting

### Backend won't start
```bash
cd backend
npm install
# Check .env file exists with Twilio credentials
npm run dev
```

### SMS not received
- Verify phone number in Twilio console
- Check number is international format (+91...)
- Trial accounts limited to verified numbers

### CORS errors
- Ensure FRONTEND_URL in backend/.env matches frontend URL
- Restart backend server

See **QUICK_REFERENCE.md** or **OTP_SETUP_GUIDE.md** for more help.

## 📞 Support Resources

- **Twilio:** https://www.twilio.com/console
- **Angular:** https://angular.io
- **Express:** https://expressjs.com

## 📝 Development Commands

```bash
# Frontend Development
npm start              # Start Angular dev server
npm run build         # Build for production
npm test              # Run tests

# Backend Development
cd backend
npm run dev           # Start with auto-reload
npm start             # Production start
npm run build         # TypeScript compilation
```

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Ready to Get Started?

1. **First time?** → Read **QUICK_REFERENCE.md**
2. **Need setup help?** → Follow **OTP_SETUP_GUIDE.md**
3. **Want to understand it?** → Check **IMPLEMENTATION_SUMMARY.md**
4. **Backend questions?** → See **backend/README.md**

---

**Built with Angular 21 + Express.js + Twilio 🚀**

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
