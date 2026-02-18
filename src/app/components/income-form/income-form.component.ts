import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './income-form.component.html',
  styleUrl: './income-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeFormComponent {
  private fb = inject(FormBuilder);
  private cashFlowService = inject(CashFlowService);

  incomeForm = this.fb.group({
    senderName: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required],
  });

  incomeList = this.cashFlowService.incomes;

  onSubmit(): void {
    if (this.incomeForm.valid) {
      const { senderName, amount, date } = this.incomeForm.value;
      this.cashFlowService.addIncome(
        senderName!,
        Number(amount),
        new Date(date!)
      );
      this.incomeForm.reset();
    }
  }

  deleteIncome(id: string): void {
    this.cashFlowService.deleteIncome(id);
  }
}
