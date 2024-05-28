import { Router } from '@angular/router';
import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  userLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLogged();
  }

  isLogged(): void {
    this.authService
      .isLogged()
      .pipe(take(1))
      .subscribe({
        next(response) {
          console.log(response, typeof response);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
