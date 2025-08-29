import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)   // ✅ this enables <router-outlet>
  ]
};
