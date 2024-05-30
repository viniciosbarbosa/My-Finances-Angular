import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './page/categories.component';

const routes: Routes = [{ path: '', component: CategoriesComponent }];

export const CategoriesRoutes = RouterModule.forChild(routes);
