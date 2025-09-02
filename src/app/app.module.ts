import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  // AppComponent is standalone and should be bootstrapped with bootstrapApplication in main.ts.
  imports: [
    BrowserModule,
    DashboardComponent,
    UsersComponent
  ]
})
export class AppModule {}
