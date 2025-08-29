import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    // Allow server render; only check localStorage in the browser
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const token = localStorage.getItem('auth_token');
    if (token) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
