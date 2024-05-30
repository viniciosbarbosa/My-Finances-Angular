import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from './auth.service';
import { Login } from '../../public/model/login.model';
import { HttpBaseService } from '../../shared/service/http-base.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpBaseService: HttpBaseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Import HttpClientTestingModule
      providers: [AuthService, HttpBaseService],
    });
    service = TestBed.inject(AuthService);
    httpBaseService = TestBed.inject(HttpBaseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Verifica se não há requisições pendentes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login and set localStorage and subjects', () => {
      const loginParams: Login = {
        email: 'vinicios@teste.com',
        password: 'A1b@3dEf',
      };
      const mockResponse = {
        token: 'mockToken',
        user: {
          nome: 'vinicios',
          email: 'vinicios@teste.com',
          id: 1,
          role: 'USER',
        },
      };

      service.login(loginParams).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('Token')).toEqual('mockToken');
        expect(localStorage.getItem('User')).toEqual(
          JSON.stringify(mockResponse.user)
        );
        expect(service['subjectUsuario'].getValue()).toEqual(mockResponse.user);
        expect(service['subjectLogin'].getValue()).toEqual(true);
      });

      const req = httpTestingController.expectOne((req) =>
        req.url.includes('authentication')
      );
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse); // Simula a resposta da requisição
    });
  });

  describe('logout', () => {
    it('should logout and clear localStorage and subjects', () => {
      localStorage.setItem('Token', 'mockToken');
      localStorage.setItem(
        'User',
        JSON.stringify({
          nome: 'vinicios',
          email: 'vinicios@teste.com',
          id: 1,
          role: 'USER',
        })
      );

      service.logout();

      expect(localStorage.getItem('Token')).toBeFalsy();
      expect(localStorage.getItem('User')).toBeFalsy();
      expect(service['subjectUsuario'].getValue()).toEqual(null);
      expect(service['subjectLogin'].getValue()).toEqual(false);
    });
  });

  describe('isLogged', () => {
    it('should return true if there is a token in localStorage', () => {
      localStorage.setItem('Token', 'mockToken');

      const result = service.isLogged();

      expect(result).toEqual(true);
    });

    it('should return false if there is no token in localStorage', () => {
      localStorage.removeItem('Token');

      const result = service.isLogged();

      expect(result).toEqual(false);
    });
  });

  describe('getUserDatas', () => {
    it('should return user data from subject if available', () => {
      const mockUser = {
        nome: 'vinicios',
        email: 'vinicios@teste.com',
        id: 1,
        role: 'USER',
      };
      service['subjectUsuario'] = new BehaviorSubject<any>(mockUser);

      service.getUserDatas().subscribe((user) => {
        expect(user).toEqual(mockUser);
      });
    });

    it('should return user data from localStorage if subject is not available', () => {
      const mockUser = {
        nome: 'vinicios',
        email: 'vinicios@teste.com',
        id: 1,
        role: 'USER',
      };
      localStorage.setItem('User', JSON.stringify(mockUser));
      service['subjectUsuario'] = new BehaviorSubject<any>(null);

      service.getUserDatas().subscribe((user) => {
        expect(user).toEqual(mockUser);
      });
    });

    it('should return null if no user data is available', () => {
      localStorage.removeItem('User');
      service['subjectUsuario'] = new BehaviorSubject<any>(null);

      service.getUserDatas().subscribe((user) => {
        expect(user).toBeNull();
      });
    });
  });

  describe('setLoggedIn', () => {
    it('should set loggedIn subject with given state', () => {
      service.setLoggedIn(true);

      service.isLoggedIn$.subscribe((loggedIn) => {
        expect(loggedIn).toEqual(true);
      });
    });
  });
});
