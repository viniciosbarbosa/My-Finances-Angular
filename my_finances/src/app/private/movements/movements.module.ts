import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsComponent } from './page/movements.component';
import { MovementsRoutes } from './movements.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusPipe } from './pipe/status.pipe';
import { ModalNewEditComponent } from './components/modal-new-edit/modal-new-edit.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormatBrazilianCurrencyPipe } from 'src/app/shared/pipe/format-brazilian-currency.pipe';

@NgModule({
  declarations: [MovementsComponent, StatusPipe, ModalNewEditComponent],
  imports: [
    CommonModule,
    MovementsRoutes,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideNgxMask(), FormatBrazilianCurrencyPipe],
})
export class MovementsModule {}
