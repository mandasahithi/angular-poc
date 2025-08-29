import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let routerSpy: { navigate: jasmine.Spy };
  let guard: AuthGuard;

  beforeEach(() => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' } // default; tests override when needed
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    try { delete (globalThis as any).localStorage; } catch {}
  });

  it('allows activation when token exists (browser)', () => {
    (globalThis as any).localStorage = { getItem: jasmine.createSpy().and.returnValue('FAKE_TOKEN') };
    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('redirects to /login when no token (browser)', () => {
    (globalThis as any).localStorage = { getItem: jasmine.createSpy().and.returnValue(null) };
    const result = guard.canActivate();
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('allows activation on server (no localStorage)', () => {
    try { delete (globalThis as any).localStorage; } catch {}
    // reconfigure PLATFORM_ID to 'server' for this case
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    const result = guard.canActivate();
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
