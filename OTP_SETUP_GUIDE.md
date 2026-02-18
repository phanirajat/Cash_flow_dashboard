# 🔐 Real OTP Authentication Setup Guide

Your Cash Flow Dashboard now has **real SMS-based OTP authentication** with Twilio. Here's how to set it up:

## 📁 Project Structure

```
Cash_flow_dashboard/
├── src/                    # Angular Frontend (port 4200)
├── backend/               # Express Backend (port 3001)
│   ├── src/
│   │   ├── server.ts
│   │   ├── services/otp.service.ts
│   │   └── routes/auth.routes.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
└── ...
```

## 🚀 Setup Steps

### Step 1: Get Twilio Credentials (5 minutes)

1. Visit https://www.twilio.com and create a free account
2. Go to https://www.twilio.com/console
3. Copy your **Account SID** and **Auth Token**
4. Get a **Phone Number** (or use your Twilio trial number)

> **Note:** Twilio trial accounts can only send SMS to verified phone numbers. Add your personal number to tested and verified numbers.

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- `express` - Web framework
- `twilio` - SMS service
- `dotenv` - Environment variables
- `cors` - Cross-origin requests
- `typescript`, `ts-node` - TypeScript support

### Step 3: Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

Replace with your actual Twilio credentials.

### Step 4: Start Both Servers

**Terminal 1 - Backend (Express + Twilio OTP):**
```bash
cd backend
npm run dev
```

You should see:
```
✅ Server running at http://localhost:3001
📱 Frontend URL: http://localhost:4200
🔐 OTP Authentication Service Active
```

**Terminal 2 - Frontend (Angular):**
```bash
npm start
```

You should see:
```
✅ Angular Live Development Server is listening on localhost, 4200
```

### Step 5: Test the Login Flow

1. Open http://localhost:4200 in your browser
2. Enter your verified phone number (the one registered in Twilio)
3. Click "Send OTP"
4. **Check your phone for SMS with OTP code**
5. Enter the 6-digit OTP in the form
6. Click "Verify & Login"
7. ✅ You should be logged in!

## 🔄 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│ User enters phone number                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ Frontend → Backend /api/auth/   │
    │            send-otp             │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ Backend → Twilio API            │
    │ Send 6-digit OTP via SMS        │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ User receives SMS with OTP      │
    │ (Real phone SMS notification)   │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ User enters OTP in form         │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ Frontend → Backend /api/auth/   │
    │            verify-otp           │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ Backend verifies OTP            │
    │ (5-min expiry, 3 attempts max)  │
    └──────────────┬──────────────────┘
                   │
                   ▼
    ┌─────────────────────────────────┐
    │ ✅ Login successful             │
    │ User redirected to dashboard    │
    │ Data isolated by phone number   │
    └─────────────────────────────────┘
```

## 🔐 Security Features

- ✅ **6-digit OTP** - Hard to guess
- ✅ **5-minute expiry** - Time-limited validity
- ✅ **3 attempt limit** - Prevent brute force attacks
- ✅ **SMS-based** - Can't be intercepted in browser
- ✅ **Server-side verification** - OTP never sent to frontend
- ✅ **CORS enabled** - Frontend can safely communicate
- ✅ **Unique per user** - Each phone number has isolated data

## 📊 API Endpoints

### Send OTP
```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210", "otp": "123456", "name": "John Doe"}'
```

### Resend OTP
```bash
curl -X POST http://localhost:3001/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "9876543210"}'
```

## 🧪 Testing Without Real SMS (Demo Mode)

If you just want to test the UI without waiting for SMS:

1. **Check server logs** - Backend logs the OTP code to the console
2. **In development** - The OTP is printed when `npm run dev` is running
3. Look for line like: `📱 OTP for 9876543210: 123456 (Valid for 5 minutes)`

## 🛑 Troubleshooting

### "Could not connect to http://localhost:3001"
- Make sure backend is running with `npm run dev`
- Check backend logs for errors
- Verify port 3001 is not in use

### "SMS not received"
- Verify phone number is Twilio verified number
- Check Twilio console for delivery status
- Use a different phone number
- Check SMS is not in spam folder

### "Invalid credentials"
- Double-check Account SID and Auth Token
- Copy-paste without extra spaces
- Verify .env file is in `backend/` folder

### "CORS error"
- Make sure `FRONTEND_URL=http://localhost:4200` in .env
- Restart backend after changing .env
- Check frontend is running on port 4200

### "Too many failed attempts"
- After 3 wrong OTP attempts, request new OTP
- Click "Send OTP" again

## 📈 Production Deployment

When deploying to production:

1. **Use secure environment variables** (not .env files)
   - Use platform secrets (Vercel, Heroku, AWS)
   - Never commit .env to git

2. **Use a database** instead of in-memory storage
   - MongoDB, PostgreSQL, Redis, etc.
   - Update `otp.service.ts` to use database

3. **Add rate limiting**
   - Prevent OTP spam attacks
   - Limit requests per IP/phone

4. **Configure CORS properly**
   - Set FRONTEND_URL to your production domain
   - Only allow requests from your frontend

5. **Add logging & monitoring**
   - Track OTP delivery status
   - Monitor failed attempts
   - Alert on suspicious activity

## 📚 Resources

- **Twilio Documentation**: https://www.twilio.com/docs
- **Express.js Guide**: https://expressjs.com
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Angular HttpClient**: https://angular.io/guide/http

## 🎯 Next Steps

✅ Backend and frontend are now integrated  
✅ OTP authentication is working  
✅ User data is isolated by phone number  

You can now:
1. **Add more users** - Each gets unique dashboard data
2. **Deploy to production** - Follow production guidelines above
3. **Customize OTP** - Change expiry time, length, message
4. **Store in database** - Replace in-memory storage with real DB

---

**Happy coding!** 🚀

If you have any questions, check the `backend/README.md` for more details.
