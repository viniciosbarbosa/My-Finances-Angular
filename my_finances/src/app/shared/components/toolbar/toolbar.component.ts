import { Router } from '@angular/router';
import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observer, take } from 'rxjs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  private authStateSubscription!: Subscription;

  loginState: boolean = false;

  ngOnInit(): void {
    this.showMenu();
    this.isLogged();
  }

  showMenu() {
    this.authStateSubscription = this.authService.isLoggedIn$.subscribe(
      (loggedIn: boolean) => {
        this.loginState = loggedIn;
      }
    );
  }

  isLogged(): void {
    this.loginState = this.authService.isLogged();
  }

  logout(): void {
    this.authService.logout();
    this.loginState = false;
    this.router.navigateByUrl('/login');
  }
}
