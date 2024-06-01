import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  const mockSnapshot: RouterStateSnapshot =
    jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', [
      'toString',
    ]);

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserDatas',
    ]);
    authServiceSpy.getUserDatas.and.returnValue(of({ role: 'ADMIN' }));

    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AdminGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for an ADMIN role', (done) => {
    guard.canActivate(null!, mockSnapshot).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });

    expect(authService.getUserDatas).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login for a non-ADMIN role', (done) => {
    authService.getUserDatas.and.returnValue(of({ role: 'USER' }));

    guard.canActivate(null!, mockSnapshot).subscribe((result) => {
      expect(result).toBeFalse();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/extract');
      done();
    });

    expect(authService.getUserDatas).toHaveBeenCalled();
  });
});
