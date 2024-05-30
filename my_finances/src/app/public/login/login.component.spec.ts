import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../../auth/services/auth.service';
import { LoginComponent } from './login.component';
import { Subject } from 'rxjs';
import { of } from 'rxjs';

// Importar os módulos do Angular Material necessários
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  const destroy$: Subject<void> = new Subject<void>();

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'login',
      'setLoggedIn',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.ngOnInit();
  });

  afterEach(() => {
    destroy$.next();
    destroy$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    expect(component.formLogin).toBeDefined();
    expect(component.formLogin.get('email')).toBeDefined();
    expect(component.formLogin.get('password')).toBeDefined();
  });

  it('should call login method on form submit', () => {
    const loginParams = {
      email: 'test@test.com',
      password: 'password',
    };
    component.formLogin.setValue(loginParams);

    const mockResponse = {
      user: { id: 1 },
    };

    authService.login.and.returnValue(of(mockResponse));

    component.login();

    expect(authService.login).toHaveBeenCalledWith(loginParams);
    expect(authService.setLoggedIn).toHaveBeenCalledWith(true);
    expect(router.navigate).toHaveBeenCalledWith(['/extract']);
  });

  it('should handle login error', () => {
    const loginParams = {
      email: 'test@test.com',
      password: 'password',
    };

    component.formLogin.setValue(loginParams);

    const mockError = new Error('Mocked Login Error'); // Create an error object

    authService.login.and.returnValue({
      pipe: () => ({
        subscribe: (error: any) => {
          Error('Login failed');
        },
      }),
    } as any);

    component.login();

    expect(authService.login).toHaveBeenCalledWith(loginParams);
    expect(authService.setLoggedIn).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    expect(component.destroy$.isStopped).toBeTruthy();
  });
});
