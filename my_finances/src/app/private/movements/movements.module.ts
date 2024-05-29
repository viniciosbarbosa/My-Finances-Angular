import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsComponent } from './page/movements.component';
import { MovementsRoutes } from './movements.routing';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MovementsComponent],
  imports: [CommonModule, MovementsRoutes, SharedModule],
})
export class MovementsModule {}
