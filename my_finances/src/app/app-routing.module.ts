import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './auth/guard/user.guard';

const routes: Routes = [
  { path: '', redirectTo: 'extract', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('./public/public.module').then((m) => m.PublicModule),
  },
  {
    path: 'extract',
    loadChildren: () =>
      import('./private/extract/extract.module').then((m) => m.ExtractModule),
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
