import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsComponent } from './page/movements.component';
import { MovementsRoutes } from './movements.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusPipe } from './pipe/status.pipe';
import { ModalNewEditComponent } from './components/modal-new-edit/modal-new-edit.component';

@NgModule({
  declarations: [MovementsComponent, StatusPipe, ModalNewEditComponent],
  imports: [CommonModule, MovementsRoutes, SharedModule],
})
export class MovementsModule {}
