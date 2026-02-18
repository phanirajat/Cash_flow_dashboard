import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const API_URL = 'http://localhost:3001/api/auth';

export interface User {
  phoneNumber: string;
  name: string;
  loginTime: Date;
}

interface OtpResponse {
  success: boolean;
  message: string;
  phoneNumber: string;
  expiresAt: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  
  private currentUserSignal = signal<User | null>(null);
  private tempPhoneSignal = signal<string>('');
  private isOtpSentSignal = signal(false);
  private otpExpirySignal = signal<number>(0);
  
  currentUser = this.currentUserSignal.asReadonly();
  tempPhone = this.tempPhoneSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);
  isOtpSent = computed(() => this.isOtpSentSignal());
  otpExpiry = this.otpExpirySignal.asReadonly();

  constructor() {
    this.loadUserFromStorage();
    this.startExpiryTimer();
  }

  /**
   * Step 1: Send OTP to phone number via backend
   */
  async sendOtp(phoneNumber: string): Promise<void> {
    try {
      const sanitizedPhone = phoneNumber.replace(/\D/g, '');
      
      if (sanitizedPhone.length !== 10) {
        throw new Error('Phone number must be 10 digits');
      }

      const response = await firstValueFrom(
        this.http.post<OtpResponse>(`${API_URL}/send-otp`, {
          phoneNumber: sanitizedPhone,
        })
      );

      this.tempPhoneSignal.set(sanitizedPhone);
      this.isOtpSentSignal.set(true);
      
      // Calculate expiry (usually 5 minutes)
      const expiresAt = new Date(response.expiresAt);
      const secondsLeft = Math.floor((expiresAt.getTime() - new Date().getTime()) / 1000);
      this.otpExpirySignal.set(Math.max(0, secondsLeft));

      console.log(`📱 OTP sent to +91${sanitizedPhone}`);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      throw new Error(error.error?.error || error.message || 'Failed to send OTP');
    }
  }

  /**
   * Step 2: Verify OTP and complete login
   */
  async verifyOtpAndLogin(otp: string, name: string): Promise<void> {
    try {
      if (!this.isOtpSentSignal()) {
        throw new Error('No OTP request found. Please send OTP first.');
      }

      const phoneNumber = this.tempPhoneSignal();

      const response = await firstValueFrom(
        this.http.post<VerifyResponse>(`${API_URL}/verify-otp`, {
          phoneNumber,
          otp,
          name,
        })
      );

      // OTP verified successfully - create user session
      const user: User = {
        ...response.user,
        loginTime: new Date(response.user.loginTime),
      };

      this.currentUserSignal.set(user);
      this.saveUserToStorage(user);
      this.clearOtp();

      console.log(`✅ Login successful for ${user.name}`);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      const errorMsg = error.error?.error || error.message || 'Verification failed';
      
      if (error.status === 429) {
        throw new Error('Too many failed attempts. Please request a new OTP');
      }
      if (error.status === 401) {
        throw new Error(errorMsg);
      }
      
      throw new Error(errorMsg);
    }
  }

  /**
   * Resend OTP
   */
  async resendOtp(): Promise<void> {
    try {
      const tempPhone = this.tempPhoneSignal();
      if (!tempPhone) {
        throw new Error('Please enter phone number first');
      }

      const response = await firstValueFrom(
        this.http.post<OtpResponse>(`${API_URL}/resend-otp`, {
          phoneNumber: tempPhone,
        })
      );

      // Reset expiry timer
      const expiresAt = new Date(response.expiresAt);
      const secondsLeft = Math.floor((expiresAt.getTime() - new Date().getTime()) / 1000);
      this.otpExpirySignal.set(Math.max(0, secondsLeft));

      console.log(`📱 OTP resent to +91${tempPhone}`);
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      throw new Error(error.error?.error || error.message || 'Failed to resend OTP');
    }
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.clearOtp();
    localStorage.removeItem('currentUser');
    console.log('👋 Logged out');
  }

  private clearOtp(): void {
    this.tempPhoneSignal.set('');
    this.isOtpSentSignal.set(false);
    this.otpExpirySignal.set(0);
  }

  private startExpiryTimer(): void {
    setInterval(() => {
      const currentExpiry = this.otpExpirySignal();
      if (currentExpiry > 0) {
        this.otpExpirySignal.set(currentExpiry - 1);
      }
    }, 1000);
  }

  private saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.currentUserSignal.set({
          ...parsedUser,
          loginTime: new Date(parsedUser.loginTime),
        });
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }

  getStorageKey(phoneNumber: string): string {
    return `cashflow_${phoneNumber}`;
  }
}
