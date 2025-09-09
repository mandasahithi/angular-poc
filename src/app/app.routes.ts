import {  Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { UsersComponent } from './users/users.component';
import { ShellLayoutComponent } from './shell-layout/shell-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: '', pathMatch: 'full', redirectTo: 'users' }
    ]
  },
  { path: '**', redirectTo: '' }
];
