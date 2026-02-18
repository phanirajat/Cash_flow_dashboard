import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string>('');

  loginForm: FormGroup = this.fb.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    name: [''],
  });

  onSubmit(): void {
    if (!this.loginForm.valid) {
      this.errorMessage.set('Please fill in all required fields correctly');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const { phoneNumber, name } = this.loginForm.value;
      this.authService.login(phoneNumber, name);
      this.router.navigate(['/dashboard/monthly']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Login failed. Please try again.');
      this.isLoading.set(false);
    }
  }
}
