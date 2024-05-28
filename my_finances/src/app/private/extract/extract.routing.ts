import { Routes, RouterModule } from '@angular/router';
import { ExtractComponent } from './page/extract.component';

const routes: Routes = [{ path: '', component: ExtractComponent }];

export const ExtractRoutes = RouterModule.forChild(routes);
