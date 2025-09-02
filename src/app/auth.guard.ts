import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Allow server rendering; only check localStorage in the browser
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('auth_token');
  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
