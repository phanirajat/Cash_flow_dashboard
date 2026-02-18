import { Injectable, signal, computed } from '@angular/core';

export interface User {
  phoneNumber: string;
  name: string;
  loginTime: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  
  currentUser = this.currentUserSignal.asReadonly();
  isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor() {
    this.loadUserFromStorage();
  }

  login(phoneNumber: string, name: string): void {
    // Validate phone number (10 digits)
    const sanitizedPhone = phoneNumber.replace(/\D/g, '');
    
    if (sanitizedPhone.length !== 10) {
      throw new Error('Phone number must be 10 digits');
    }

    const user: User = {
      phoneNumber: sanitizedPhone,
      name: name || `User ${sanitizedPhone.slice(-4)}`,
      loginTime: new Date(),
    };

    this.currentUserSignal.set(user);
    this.saveUserToStorage(user);
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
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
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  getStorageKey(phoneNumber: string): string {
    return `cashflow_${phoneNumber}`;
  }
}
