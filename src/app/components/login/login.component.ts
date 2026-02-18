import { Component, signal, inject, ChangeDetectionStrategy, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type LoginStep = 'phone' | 'otp';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  authService = inject(AuthService);
  private router = inject(Router);

  currentStep = signal<LoginStep>('phone');
  isLoading = signal(false);
  errorMessage = signal<string>('');
  canResendOtp = signal(false);
  resendCountdown = signal<number>(0);

  phoneForm: FormGroup = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });

  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    name: [''],
  });

  constructor() {
    // Auto-enable resend after 30 seconds
    effect(() => {
      const otpExpiry = this.authService.otpExpiry();
      if (otpExpiry > 0 && otpExpiry <= 30 && otpExpiry % 10 === 0) {
        this.canResendOtp.set(true);
      }
      
      // Show countdown at the end
      if (otpExpiry > 0 && otpExpiry <= 10) {
        this.resendCountdown.set(otpExpiry);
      }
    });
  }

  async sendOtp(): Promise<void> {
    if (!this.phoneForm.valid) {
      this.errorMessage.set('Please enter a valid 10-digit phone number');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { phoneNumber } = this.phoneForm.value;
      await this.authService.sendOtp(phoneNumber);
      
      this.currentStep.set('otp');
      this.otpForm.reset();
      this.canResendOtp.set(false);
      
      // Auto-focus OTP input
      setTimeout(() => {
        (document.getElementById('otpInput') as HTMLInputElement)?.focus();
      }, 100);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to send OTP');
      this.isLoading.set(false);
    }
  }

  async verifyOtpAndLogin(): Promise<void> {
    if (!this.otpForm.valid) {
      this.errorMessage.set('Please enter a valid 6-digit OTP');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { otp, name } = this.otpForm.value;
      await this.authService.verifyOtpAndLogin(otp, name);
      this.router.navigate(['/dashboard/monthly']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'OTP verification failed');
      this.isLoading.set(false);
    }
  }

  async resendOtp(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.resendOtp();
      this.otpForm.patchValue({ otp: '' });
      this.canResendOtp.set(false);
      this.errorMessage.set('');
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Failed to resend OTP');
    } finally {
      this.isLoading.set(false);
    }
  }

  changePhoneNumber(): void {
    this.currentStep.set('phone');
    this.phoneForm.reset();
    this.otpForm.reset();
    this.errorMessage.set('');
  }

  formatPhoneNumber(phone: string): string {
    const first3 = phone.slice(0, 3);
    const next3 = phone.slice(3, 6);
    const last4 = phone.slice(6);
    return `${first3}-${next3}-${last4}`;
  }

  get isOtpExpired(): boolean {
    return this.authService.otpExpiry() === 0 && this.authService.isOtpSent();
  }

  get formattedExpiry(): string {
    const seconds = this.authService.otpExpiry();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
