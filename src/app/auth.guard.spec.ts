import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let routerSpy: { navigate: jasmine.Spy };

  // Declare executeGuard with tuple argument types
  const executeGuard = (...guardParameters: [ActivatedRouteSnapshot, RouterStateSnapshot]) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    routerSpy = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  });

  afterEach(() => {
    try { delete (globalThis as any).localStorage; } catch {}
  });

  it('allows activation when token exists (browser)', () => {
    (globalThis as any).localStorage = { getItem: jasmine.createSpy().and.returnValue('FAKE_TOKEN') };
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('redirects to /login when no token (browser)', () => {
    (globalThis as any).localStorage = { getItem: jasmine.createSpy().and.returnValue(null) };
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('allows activation on server (no localStorage)', () => {
    try { delete (globalThis as any).localStorage; } catch {}
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
    const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);
    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
