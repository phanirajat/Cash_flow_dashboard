import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-yearly-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './yearly-dashboard.component.html',
  styleUrl: './yearly-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearlyDashboardComponent {
  private cashFlowService = inject(CashFlowService);

  selectedYear = signal(new Date().getFullYear());
  currentYear = new Date().getFullYear();

  yearlyIncomeList = computed(() =>
    this.cashFlowService.getIncomesByYear(this.selectedYear())
  );

  yearlyExpenseList = computed(() =>
    this.cashFlowService.getExpensesByYear(this.selectedYear())
  );

  yearlyIncome = computed(() =>
    this.yearlyIncomeList().reduce((sum, income) => sum + income.amount, 0)
  );

  yearlyExpenses = computed(() =>
    this.yearlyExpenseList().reduce((sum, expense) => sum + expense.amount, 0)
  );

  yearlyProfit = computed(() => this.yearlyIncome() - this.yearlyExpenses());

  monthlyBreakdown = computed(() => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((monthName, monthIndex) => {
      const monthIncomes = this.cashFlowService.getIncomesByMonth(
        this.selectedYear(),
        monthIndex
      );
      const monthExpenses = this.cashFlowService.getExpensesByMonth(
        this.selectedYear(),
        monthIndex
      );

      const income = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
      const expenses = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      return {
        monthIndex,
        monthName,
        income,
        expenses,
        profit: income - expenses,
      };
    });
  });

  Math = Math;

  onYearChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedYear.set(Number(target.value));
  }
}
