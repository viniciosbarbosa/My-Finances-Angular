import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';

import { RouterModule } from '@angular/router';
import { FormatBrazilianCurrencyPipe } from './pipe/format-brazilian-currency.pipe';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ToolbarComponent, FormatBrazilianCurrencyPipe],
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterModule,
    MatSidenavModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    MatDialogModule,
  ],
  exports: [
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    ToolbarComponent,
    FormatBrazilianCurrencyPipe,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    MatDialogModule,
  ],
})
export class SharedModule {}
