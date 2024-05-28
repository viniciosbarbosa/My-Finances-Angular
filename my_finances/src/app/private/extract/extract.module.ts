import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractComponent } from './page/extract.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExtractRoutes } from './extract.routing';

@NgModule({
  declarations: [ExtractComponent],
  imports: [CommonModule, ExtractRoutes, SharedModule],
})
export class ExtractModule {}
