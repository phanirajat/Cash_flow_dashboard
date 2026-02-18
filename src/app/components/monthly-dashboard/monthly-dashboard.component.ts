import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-monthly-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-dashboard.component.html',
  styleUrl: './monthly-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyDashboardComponent {
  private cashFlowService = inject(CashFlowService);

  selectedMonth = signal(this.getCurrentMonthString());
  
  currentYear = computed(() => new Date(this.selectedMonth()).getFullYear());
  currentMonthIndex = computed(() => new Date(this.selectedMonth()).getMonth());

  monthlyIncomeList = computed(() =>
    this.cashFlowService.getIncomesByMonth(this.currentYear(), this.currentMonthIndex())
  );

  monthlyExpenseList = computed(() =>
    this.cashFlowService.getExpensesByMonth(this.currentYear(), this.currentMonthIndex())
  );

  monthlyIncome = computed(() =>
    this.monthlyIncomeList().reduce((sum, income) => sum + income.amount, 0)
  );

  monthlyExpenses = computed(() =>
    this.monthlyExpenseList().reduce((sum, expense) => sum + expense.amount, 0)
  );

  monthlyProfit = computed(() => this.monthlyIncome() - this.monthlyExpenses());

  Math = Math;

  onMonthChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedMonth.set(target.value);
  }

  private getCurrentMonthString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
}
