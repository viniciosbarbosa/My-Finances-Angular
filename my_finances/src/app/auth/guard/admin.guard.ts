import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const url = state.url;

    return this.authService.getUserDatas().pipe(
      map((response) => {
        if (response?.role === 'ADMIN') {
          return true;
        } else if (response?.role === 'USER') {
          this.router.navigateByUrl('/extract');
          return false;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
