# Cash Flow Dashboard - Backend Setup

This is the Node.js/Express backend for the Cash Flow Dashboard with **Twilio SMS OTP authentication**.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn
- Twilio account (free trial available at https://www.twilio.com)

### Installation

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Twilio Credentials**

   a) Get Twilio credentials:
   - Sign up at https://www.twilio.com/console
   - Get your **Account SID** and **Auth Token** from the dashboard
   - Get a **Twilio Phone Number** (or use your trial number starting with +1)

   b) Create `.env` file:
   ```bash
   cp .env.example .env
   ```

   c) Edit `.env` and add your Twilio credentials:
   ```
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:4200
   ```

### Running the Backend

#### Development Mode (with auto-reload)
```bash
npm run dev
```

#### Production Mode
```bash
npm run build
npm start
```

The backend will start on **http://localhost:3001**

## 📱 API Endpoints

### 1. Send OTP
**POST** `/api/auth/send-otp`

Request:
```json
{
  "phoneNumber": "9876543210"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "9876543210",
  "expiresAt": "2026-02-18T12:05:00.000Z"
}
```

### 2. Verify OTP & Login
**POST** `/api/auth/verify-otp`

Request:
```json
{
  "phoneNumber": "9876543210",
  "otp": "123456",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "user": {
    "phoneNumber": "9876543210",
    "name": "John Doe",
    "loginTime": "2026-02-18T12:00:00.000Z"
  }
}
```

### 3. Resend OTP
**POST** `/api/auth/resend-otp`

Request:
```json
{
  "phoneNumber": "9876543210"
}
```

### 4. Get OTP Expiry
**GET** `/api/auth/otp-expiry/:phoneNumber`

Response:
```json
{
  "phoneNumber": "9876543210",
  "expirySeconds": 245
}
```

## 🔐 OTP Features

- ✅ **6-digit OTP** generated per request
- ✅ **5-minute expiry** time
- ✅ **3 attempt limit** before OTP becomes invalid
- ✅ **Real SMS delivery** via Twilio
- ✅ **Auto-cleanup** of expired OTPs
- ✅ **CORS enabled** for frontend communication

## 🧪 Testing with Twilio Trial

Twilio trial accounts can only send SMS to **verified phone numbers**. To test:

1. Add your personal phone number to Twilio verified numbers
2. Use that number when testing the OTP flow
3. You'll receive a real SMS with the OTP code

**Or** - Use the Twilio Test Credentials (deprecated, but works for demo):
- Use test number: +1 (415) 555-0123
- The OTP will appear in your Twilio console

## 🛠️ Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account ID | `ACxxxxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token | `xxxxxxxxxxxxxxxxxxxxx` |
| `TWILIO_PHONE_NUMBER` | Your Twilio Phone Number | `+1234567890` |
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:4200` |

## 📊 OTP Storage

Currently uses **in-memory storage** (suitable for development). For production, integrate:
- MongoDB
- PostgreSQL
- Redis
- AWS DynamoDB

## 🚨 Common Issues

### "TWILIO_ACCOUNT_SID is undefined"
- Check `.env` file exists and is in the `backend` directory
- Restart the server after changing `.env`
- Use `npm run dev` for development

### "Could not find account"
- Verify Twilio credentials are correct
- Account SID and Auth Token must match

### "SMS not received"
- Trial accounts can only send to verified numbers
- Verify your phone number in Twilio console
- Check SMS is not being filtered to spam

### "CORS error from frontend"
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Default is `http://localhost:4200`

## 📝 Logging

The backend logs:
- OTP generation and sending
- SMS delivery status (Message SID)
- Verification attempts
- Errors and failures

Examples:
```
✅ SMS sent to +919876543210 (Message SID: SMxxxxxxxxxxxxxxxx)
OTP verified successfully
Error sending OTP: Invalid phone number format
```

## 🔗 Integration with Frontend

The Angular frontend automatically calls these endpoints at:
- `http://localhost:3001/api/auth/send-otp`
- `http://localhost:3001/api/auth/verify-otp`
- `http://localhost:3001/api/auth/resend-otp`

Make sure both servers are running:
```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Backend
cd backend
npm run dev
```

## 📚 Twilio Resources

- [Twilio Console](https://www.twilio.com/console)
- [Twilio Node.js SDK Docs](https://www.twilio.com/docs/libraries/node)
- [SMS API Reference](https://www.twilio.com/docs/sms/send-messages)
- [Twilio Pricing](https://www.twilio.com/sms/pricing)

---

Happy coding! 🎉
