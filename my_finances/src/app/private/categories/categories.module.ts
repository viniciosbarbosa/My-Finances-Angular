import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesComponent } from './page/categories.component';
import { CategoriesRoutes } from './categories.routing';
import { ModalCreateEditComponent } from './components/modal-create-edit/modal-create-edit.component';

@NgModule({
  declarations: [CategoriesComponent, ModalCreateEditComponent],
  imports: [CommonModule, CategoriesRoutes, SharedModule],
})
export class CategoriesModule {}
