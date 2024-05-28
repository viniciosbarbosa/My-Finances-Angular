import { Injectable, Injector, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { Login } from 'src/app/public/model/login.model';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpBaseService {
  private subjectUsuario: BehaviorSubject<any> = new BehaviorSubject(null);

  private subjectLogin: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  private endpoint = 'authentication';

  private loggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(protected readonly inject: Injector) {
    super(inject);
  }

  login(params: Login): Observable<any> {
    return this.httpPost(this.endpoint, params).pipe(
      map((response) => {
        localStorage.setItem('Token', response.token);
        localStorage.setItem('User', JSON.stringify(response.user));
        this.subjectUsuario.next(response.user);
        this.subjectLogin.next(true);

        return response;
      })
    );
  }
  logout() {
    localStorage.removeItem('Token');
    localStorage.removeItem('User');
    this.subjectUsuario.next(null);
    this.subjectLogin.next(false);
  }

  isLogged(): boolean {
    const token = localStorage.getItem('Token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  setLoggedIn(state: boolean): void {
    this.loggedIn.next(state);
  }

  getUserDatas(): Observable<any> {
    if (this.subjectUsuario.value) {
      return of(this.subjectUsuario.value);
    } else {
      const userDatas = localStorage.getItem('User');
      if (userDatas) {
        this.subjectUsuario.next(JSON.parse(userDatas));

        return of(JSON.parse(userDatas));
      }

      return of(null);
    }
  }
}
