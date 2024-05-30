// toolbar.component.spec.ts

import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http'; // Importe o HttpClientModule

import { ToolbarComponent } from './toolbar.component';
import { AuthService } from './../../../auth/services/auth.service';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component.menu).toEqual([
      { descricao: 'Extract', rota: 'extract', role: 'USER' },
      { descricao: 'Movements', rota: 'movements', role: 'USER' },
      { descricao: 'Categories', rota: 'categories', role: 'ADMIN' },
    ]);
    expect(component.menuFilter).toEqual([]);
    expect(component.loginState).toBeFalse();
  });

  it('should call menuByUserRole when user logs in as ADMIN', fakeAsync(() => {
    const user = { role: 'ADMIN' };
    spyOn(authService, 'getUserDatas').and.returnValue(of(user));

    component.showMenu();
    tick();

    expect(component.menuFilter).toEqual([
      { descricao: 'Categories', rota: 'categories', role: 'ADMIN' },
    ]);
  }));

  it('should call menuByUserRole when user logs in as USER', fakeAsync(() => {
    spyOn(authService, 'getUserDatas').and.returnValue(of({ role: 'USER' }));

    component.showMenu();
    tick();

    expect(component.menuFilter).toEqual([
      { descricao: 'Extract', rota: 'extract', role: 'USER' },
      { descricao: 'Movements', rota: 'movements', role: 'USER' },
    ]);
  }));

  it('should call logout method and navigate to /login', () => {
    spyOn(authService, 'logout').and.stub();
    spyOn(router, 'navigateByUrl').and.stub();

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(component.loginState).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should call isLogged method on initialization', () => {
    spyOn(authService, 'isLogged').and.returnValue(true);
    component.ngOnInit();
    expect(component.loginState).toBeTrue();
  });
});
