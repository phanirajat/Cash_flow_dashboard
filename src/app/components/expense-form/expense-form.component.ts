import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormComponent {
  private fb = inject(FormBuilder);
  private cashFlowService = inject(CashFlowService);

  expenseForm = this.fb.group({
    description: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required],
  });

  expenseList = this.cashFlowService.expenses;

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const { description, amount, date } = this.expenseForm.value;
      this.cashFlowService.addExpense(
        description!,
        Number(amount),
        new Date(date!)
      );
      this.expenseForm.reset();
    }
  }

  deleteExpense(id: string): void {
    this.cashFlowService.deleteExpense(id);
  }
}
