import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { UserGuard } from './user.guard';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('UserGuard', () => {
  let guard: UserGuard;
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
    authServiceSpy.getUserDatas.and.returnValue(of({ role: 'USER' }));

    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        UserGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(UserGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation for a USER role', (done) => {
    guard.canActivate(null!, mockSnapshot).subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });

    expect(authService.getUserDatas).toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should redirect to login for a non-USER role', (done) => {
    authService.getUserDatas.and.returnValue(of({ role: 'ADMIN' }));

    guard.canActivate(null!, mockSnapshot).subscribe((result) => {
      expect(result).toBeFalse();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      done();
    });

    expect(authService.getUserDatas).toHaveBeenCalled();
  });
});
