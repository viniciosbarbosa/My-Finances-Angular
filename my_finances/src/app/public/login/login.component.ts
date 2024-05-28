import { AuthService } from './../../auth/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../model/login.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  formLogin!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.formInit();
  }

  formInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      password: [
        '',

        Validators.compose([Validators.required, Validators.minLength(7)]),
      ],
    });
  }

  login() {
    const params: Login = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
    };

    params.email = params.email.toLocaleLowerCase();

    this.authService
      .login(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          if (response.user?.id) {
            this.router.navigate(['/extract']);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
