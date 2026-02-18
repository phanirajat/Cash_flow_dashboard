import { Routes } from '@angular/router';
import { IncomeFormComponent } from './components/income-form/income-form.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { MonthlyDashboardComponent } from './components/monthly-dashboard/monthly-dashboard.component';
import { YearlyDashboardComponent } from './components/yearly-dashboard/yearly-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard/monthly', pathMatch: 'full' },
  { path: 'income', component: IncomeFormComponent },
  { path: 'expense', component: ExpenseFormComponent },
  { path: 'dashboard/monthly', component: MonthlyDashboardComponent },
  { path: 'dashboard/yearly', component: YearlyDashboardComponent },
];
