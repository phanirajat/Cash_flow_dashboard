import { Routes } from '@angular/router';
import { IncomeFormComponent } from './components/income-form/income-form.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { MonthlyDashboardComponent } from './components/monthly-dashboard/monthly-dashboard.component';
import { YearlyDashboardComponent } from './components/yearly-dashboard/yearly-dashboard.component';
import LoginComponent from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'income', component: IncomeFormComponent, canActivate: [authGuard] },
  { path: 'expense', component: ExpenseFormComponent, canActivate: [authGuard] },
  { path: 'dashboard/monthly', component: MonthlyDashboardComponent, canActivate: [authGuard] },
  { path: 'dashboard/yearly', component: YearlyDashboardComponent, canActivate: [authGuard] },
];
