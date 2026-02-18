import { Router, Request, Response } from 'express';
import { OtpService } from '../services/otp.service';

export const authRoutes = Router();

/**
 * POST /api/auth/send-otp
 * Send OTP to phone number via SMS
 */
authRoutes.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const sanitizedPhone = phoneNumber.replace(/\D/g, '');

    if (sanitizedPhone.length !== 10) {
      return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    const { expiresAt } = await OtpService.sendOtp(phoneNumber);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber: sanitizedPhone,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: error.message || 'Failed to send OTP',
    });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and return auth token
 */
authRoutes.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    console.log('🔍 Verify OTP request received');
    const { phoneNumber, otp, name } = req.body;
    console.log(`📞 Phone: ${phoneNumber}, OTP: ${otp}, Name: ${name}`);

    if (!phoneNumber || !otp) {
      console.warn('⚠️ Missing phoneNumber or otp');
      return res.status(400).json({ error: 'Phone number and OTP are required' });
    }

    const sanitizedPhone = phoneNumber.replace(/\D/g, '');
    console.log(`✓ Sanitized phone: ${sanitizedPhone}`);

    if (sanitizedPhone.length !== 10) {
      console.warn(`⚠️ Invalid phone length: ${sanitizedPhone.length}`);
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Verify OTP
    console.log('🔐 Attempting to verify OTP...');
    const isValid = OtpService.verifyOtp(phoneNumber, otp);
    console.log(`✓ OTP verification result: ${isValid}`);

    if (!isValid) {
      console.warn('❌ OTP is invalid');
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    // OTP verified - create user session
    const user = {
      phoneNumber: sanitizedPhone,
      name: name || `User ${sanitizedPhone.slice(-4)}`,
      loginTime: new Date(),
    };

    console.log(`✅ User session created for ${sanitizedPhone}`);
    res.json({
      success: true,
      message: 'OTP verified successfully',
      user,
    });
  } catch (error: any) {
    console.error('❌ Verify OTP error:', error.message, error.stack);
    
    if (error.message.includes('expired')) {
      console.log('⏰ OTP expired error');
      return res.status(401).json({ error: error.message });
    }
    
    if (error.message.includes('Too many')) {
      console.log('🚫 Too many attempts error');
      return res.status(429).json({ error: error.message });
    }

    console.log(`⚠️ Generic error: ${error.message}`);
    res.status(401).json({
      error: error.message || 'OTP verification failed',
    });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP to phone number
 */
authRoutes.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const sanitizedPhone = phoneNumber.replace(/\D/g, '');

    if (sanitizedPhone.length !== 10) {
      return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }

    const { expiresAt } = await OtpService.sendOtp(phoneNumber);

    res.json({
      success: true,
      message: 'OTP resent successfully',
      phoneNumber: sanitizedPhone,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: error.message || 'Failed to resend OTP',
    });
  }
});

/**
 * GET /api/auth/otp-expiry/:phoneNumber
 * Get remaining expiry time for OTP
 */
authRoutes.get('/otp-expiry/:phoneNumber', (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.params;
    const expirySeconds = OtpService.getOtpExpiry(phoneNumber);

    res.json({
      phoneNumber: phoneNumber.replace(/\D/g, ''),
      expirySeconds,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to get OTP expiry',
    });
  }
});
