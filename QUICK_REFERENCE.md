# 🚀 Quick Reference - Real OTP Authentication

## 📋 Setup Checklist

- [ ] Get Twilio credentials (https://www.twilio.com/console)
- [ ] Run setup script: `setup.bat` (Windows) or `./setup.sh` (Mac/Linux)
- [ ] Edit `backend/.env` with Twilio credentials
- [ ] Run verification: `node verify-setup.js`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `npm start` (in new terminal)
- [ ] Test at http://localhost:4200

## 🔑 Twilio Credentials Checklist

You need 3 things from https://www.twilio.com/console:

```
TWILIO_ACCOUNT_SID = AC...      (25 chars)
TWILIO_AUTH_TOKEN = ...         (34 chars)
TWILIO_PHONE_NUMBER = +1...     (from "Phone Numbers" section)
```

The file to edit: `backend/.env`

## 🎯 OTP Authentication Flow

```
Phone Entry → Send OTP → SMS Sent → Enter OTP → Verify → Login
   (UI)       (API)     (Twilio)     (UI)      (API)    (Dashboard)
```

## 📍 Server Ports

| Service | Port | URL | Start Command |
|---------|------|-----|----------------|
| Backend | 3001 | http://localhost:3001 | `cd backend && npm run dev` |
| Frontend | 4200 | http://localhost:4200 | `npm start` |

## 🔧 API Endpoints

**All endpoints start with: `http://localhost:3001/api/auth/`**

### Send OTP
```bash
POST /send-otp
Body: { "phoneNumber": "9876543210" }
```

### Verify OTP
```bash
POST /verify-otp
Body: { "phoneNumber": "9876543210", "otp": "123456", "name": "John" }
```

### Resend OTP
```bash
POST /resend-otp
Body: { "phoneNumber": "9876543210" }
```

## 📂 Important Files

| Path | Purpose |
|------|---------|
| `backend/.env` | Twilio credentials (DO NOT COMMIT) |
| `backend/src/server.ts` | Express server |
| `backend/src/services/otp.service.ts` | OTP logic |
| `backend/src/routes/auth.routes.ts` | API endpoints |
| `src/app/services/auth.service.ts` | Frontend API calls |
| `OTP_SETUP_GUIDE.md` | Detailed setup guide |

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not running | `cd backend && npm run dev` |
| SMS not received | Verify phone number in Twilio console |
| CORS error | Check FRONTEND_URL in backend/.env |
| npm ERR | Run `cd backend && npm install` |
| `.env not found` | Copy: `cp backend/.env.example backend/.env` |

## 🧪 Demo Testing

During development, the OTP appears in the backend console:
```
📱 OTP for 9876543210: 123456 (Valid for 5 minutes)
```

## 📊 OTP Specifications

- **Length:** 6 digits
- **Validity:** 5 minutes
- **Attempts:** 3 allowed (then blocked)
- **Resend:** After 30 seconds
- **Storage:** In-memory (backend only)

## ✅ Security Features

- SMS-based (can't be intercepted)
- Server-side verification only
- Time-limited (5 minutes)
- Rate-limited (3 attempts)
- User data isolation by phone number

## 📞 Twilio Help

| Need | Link |
|------|------|
| Console | https://www.twilio.com/console |
| Documentation | https://www.twilio.com/docs |
| SMS API | https://www.twilio.com/docs/sms |
| Pricing | https://www.twilio.com/sms/pricing |

## 🎓 Next Steps

1. ✅ Setup backend
2. ✅ Configure Twilio
3. ✅ Start both servers
4. ✅ Test OTP flow
5. 📈 Deploy to production (use database instead of in-memory)

---

For more details, see **OTP_SETUP_GUIDE.md** 📚
