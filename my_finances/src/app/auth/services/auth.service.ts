import { Injectable, Injector, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Login } from 'src/app/public/model/login.model';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpBaseService {
  private subjectUsuario: BehaviorSubject<any> = new BehaviorSubject(null);

  private subjectLogin: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  private endpoint = 'authentication';

  constructor(protected readonly inject: Injector) {
    super(inject);
  }

  login(params: Login): Observable<any> {
    return this.httpPost(this.endpoint, params).pipe(
      map((response) => {
        sessionStorage.setItem('Token', response.token);
        sessionStorage.setItem('User', JSON.stringify(response.user));
        this.subjectUsuario.next(response.user);
        this.subjectLogin.next(true);

        return response;
      })
    );
  }
  logout() {
    sessionStorage.removeItem('Token');
    sessionStorage.removeItem('User');
    this.subjectUsuario.next(null);
    this.subjectLogin.next(false);
  }

  isLogged(): Observable<boolean> {
    const token = sessionStorage.getItem('Token');
    if (token) {
      this.subjectLogin.next(true);
    }

    return this.subjectLogin.asObservable();
  }

  getUserDatas(): Observable<any> {
    const userDatas = sessionStorage.getItem('User');
    if (userDatas) {
      this.subjectUsuario.next(JSON.parse(userDatas));
    }

    return this.subjectUsuario;
  }
}
