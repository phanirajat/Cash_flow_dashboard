import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// In-memory OTP store (in production, use a database)
const otpStore = new Map<string, { code: string; expiresAt: Date; attempts: number }>();

// Lazy initialize Twilio client
let client: any = null;

const getTwilioClient = () => {
  if (!client) {
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials not configured. Check your .env file.');
    }
    client = twilio(accountSid, authToken);
  }
  return client;
};

export class OtpService {
  /**
   * Generate a 6-digit OTP
   */
  static generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP via SMS using Twilio
   */
  static async sendOtp(phoneNumber: string): Promise<{ otp: string; expiresAt: Date }> {
    try {
      const sanitizedPhone = phoneNumber.replace(/\D/g, '');

      if (sanitizedPhone.length !== 10) {
        throw new Error('Phone number must be 10 digits');
      }

      // Format Indian phone number to E.164 format
      const formattedNumber = `+91${sanitizedPhone}`;

      // Generate OTP
      const otp = this.generateOtp();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      // Send SMS via Twilio
      const message = await getTwilioClient().messages.create({
        body: `Your Cash Flow Dashboard OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`,
        from: twilioPhoneNumber,
        to: formattedNumber,
      });

      console.log(`✅ SMS sent to ${formattedNumber} (Message SID: ${message.sid})`);

      // Store OTP
      otpStore.set(sanitizedPhone, {
        code: otp,
        expiresAt,
        attempts: 0,
      });

      // Auto-cleanup after expiry
      setTimeout(() => {
        otpStore.delete(sanitizedPhone);
      }, 5 * 60 * 1000);

      return { otp, expiresAt };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP
   */
  static verifyOtp(phoneNumber: string, otp: string): boolean {
    try {
      const sanitizedPhone = phoneNumber.replace(/\D/g, '');
      const storedData = otpStore.get(sanitizedPhone);

      if (!storedData) {
        throw new Error('No OTP found for this phone number');
      }

      if (new Date() > storedData.expiresAt) {
        otpStore.delete(sanitizedPhone);
        throw new Error('OTP has expired');
      }

      // Limit attempts to 3
      if (storedData.attempts >= 3) {
        otpStore.delete(sanitizedPhone);
        throw new Error('Too many failed attempts. Please request a new OTP');
      }

      const enteredOtp = otp.replace(/\D/g, '');

      if (enteredOtp !== storedData.code) {
        storedData.attempts++;
        throw new Error('Invalid OTP');
      }

      // OTP verified - clean up
      otpStore.delete(sanitizedPhone);
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear OTP for a phone number
   */
  static clearOtp(phoneNumber: string): void {
    const sanitizedPhone = phoneNumber.replace(/\D/g, '');
    otpStore.delete(sanitizedPhone);
  }

  /**
   * Get remaining time for OTP
   */
  static getOtpExpiry(phoneNumber: string): number {
    const sanitizedPhone = phoneNumber.replace(/\D/g, '');
    const storedData = otpStore.get(sanitizedPhone);

    if (!storedData) {
      return 0;
    }

    const secondsLeft = Math.max(0, Math.floor((storedData.expiresAt.getTime() - new Date().getTime()) / 1000));
    return secondsLeft;
  }
}
