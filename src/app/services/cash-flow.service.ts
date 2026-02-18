import { Injectable, signal, computed } from '@angular/core';
import { Income } from '../models/income.model';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class CashFlowService {
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
    this.loadFromLocalStorage();
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

  private saveToLocalStorage(): void {
    localStorage.setItem('incomes', JSON.stringify(this.incomeList()));
    localStorage.setItem('expenses', JSON.stringify(this.expenseList()));
  }

  private loadFromLocalStorage(): void {
    const incomes = localStorage.getItem('incomes');
    const expenses = localStorage.getItem('expenses');

    if (incomes) {
      const parsedIncomes = JSON.parse(incomes);
      this.incomeList.set(
        parsedIncomes.map((income: Income) => ({
          ...income,
          date: new Date(income.date),
          createdAt: new Date(income.createdAt),
        }))
      );
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
    }
  }
}
