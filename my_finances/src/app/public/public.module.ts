import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { PublicRoutes } from './public.routing';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule, PublicRoutes],
})
export class PublicModule {}
