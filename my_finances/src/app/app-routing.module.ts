import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './auth/guard/user.guard';
import { AdminGuard } from './auth/guard/admin.guard';

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
  {
    path: 'categories',
    loadChildren: () =>
      import('./private/categories/categories.module').then(
        (m) => m.CategoriesModule
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'movements',
    loadChildren: () =>
      import('./private/movements/movements.module').then(
        (m) => m.MovementsModule
      ),
    canActivate: [UserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
