import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { Income } from '../models/income.model';
import { Expense } from '../models/expense.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CashFlowService {
  private authService = inject(AuthService);
  private incomeList = signal<Income[]>([]);
  private expenseList = signal<Expense[]>([]);

  incomes = this.incomeList.asReadonly();
  expenses = this.expenseList.asReadonly();

  totalIncome = computed(() =>
    this.incomeList().reduce((sum, income) => sum + income.amount, 0)
  );

  totalExpenses = computed(() =>
    this.expenseList().reduce((sum, expense) => sum + expense.amount, 0)
  );

  netProfit = computed(() => this.totalIncome() - this.totalExpenses());

  constructor() {
    // Whenever authentication state changes, reload data for current user
    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser) {
        this.loadFromLocalStorage();
      } else {
        // Clear data when logged out
        this.incomeList.set([]);
        this.expenseList.set([]);
      }
    });
  }

  addIncome(senderName: string, amount: number, date: Date): void {
    const income: Income = {
      id: this.generateId(),
      senderName,
      amount,
      date,
      createdAt: new Date(),
    };
    this.incomeList.update(incomes => [...incomes, income]);
    this.saveToLocalStorage();
  }

  addExpense(description: string, amount: number, date: Date): void {
    const expense: Expense = {
      id: this.generateId(),
      description,
      amount,
      date,
      createdAt: new Date(),
    };
    this.expenseList.update(expenses => [...expenses, expense]);
    this.saveToLocalStorage();
  }

  deleteIncome(id: string): void {
    this.incomeList.update(incomes => incomes.filter(income => income.id !== id));
    this.saveToLocalStorage();
  }

  deleteExpense(id: string): void {
    this.expenseList.update(expenses => expenses.filter(expense => expense.id !== id));
    this.saveToLocalStorage();
  }

  getIncomesByMonth(year: number, month: number): Income[] {
    return this.incomeList().filter(income => {
      const date = new Date(income.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }

  getExpensesByMonth(year: number, month: number): Expense[] {
    return this.expenseList().filter(expense => {
      const date = new Date(expense.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }

  getIncomesByYear(year: number): Income[] {
    return this.incomeList().filter(income => {
      const date = new Date(income.date);
      return date.getFullYear() === year;
    });
  }

  getExpensesByYear(year: number): Expense[] {
    return this.expenseList().filter(expense => {
      const date = new Date(expense.date);
      return date.getFullYear() === year;
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStorageKeys(): { incomeKey: string; expenseKey: string } {
    const currentUser = this.authService.currentUser();
    const phoneNumber = currentUser?.phoneNumber || 'guest';
    return {
      incomeKey: `cashflow_${phoneNumber}_incomes`,
      expenseKey: `cashflow_${phoneNumber}_expenses`,
    };
  }

  private saveToLocalStorage(): void {
    const { incomeKey, expenseKey } = this.getStorageKeys();
    localStorage.setItem(incomeKey, JSON.stringify(this.incomeList()));
    localStorage.setItem(expenseKey, JSON.stringify(this.expenseList()));
  }

  private loadFromLocalStorage(): void {
    const { incomeKey, expenseKey } = this.getStorageKeys();
    const incomes = localStorage.getItem(incomeKey);
    const expenses = localStorage.getItem(expenseKey);

    if (incomes) {
      const parsedIncomes = JSON.parse(incomes);
      this.incomeList.set(
        parsedIncomes.map((income: Income) => ({
          ...income,
          date: new Date(income.date),
          createdAt: new Date(income.createdAt),
        }))
      );
    } else {
      this.incomeList.set([]);
    }

    if (expenses) {
      const parsedExpenses = JSON.parse(expenses);
      this.expenseList.set(
        parsedExpenses.map((expense: Expense) => ({
          ...expense,
          date: new Date(expense.date),
          createdAt: new Date(expense.createdAt),
        }))
      );
    } else {
      this.expenseList.set([]);
    }
  }
}
