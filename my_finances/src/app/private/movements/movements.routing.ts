import { Routes, RouterModule } from '@angular/router';
import { MovementsComponent } from './page/movements.component';

const routes: Routes = [{ path: '', component: MovementsComponent }];

export const MovementsRoutes = RouterModule.forChild(routes);
