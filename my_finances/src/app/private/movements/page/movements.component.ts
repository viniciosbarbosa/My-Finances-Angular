import { ModalNewEditComponent } from './../components/modal-new-edit/modal-new-edit.component';
import { MovimentsService } from './../service/moviments.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Moviment } from '../model/movement.model';
import { MatDialog } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.scss'],
})
export class MovementsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  tableMovimentsData: Moviment[] = [];
  total = 1;
  loading = true;
  pageSize = 5;
  pageIndex = 1;
  message = '';

  constructor(
    private movimentsService: MovimentsService,
    private dialog: MatDialog,
    private messageNz: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllMoviments();
  }

  getAllMoviments(): void {
    this.movimentsService
      .getMoviments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.tableMovimentsData = response;
          this.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
        },
      });
  }

  callModalMoviment(actionName: string, movementData?: Moviment) {
    let dialogWidth = '60vw';
    let dialogHeight = '80vh';

    if (window.innerWidth <= 500) {
      dialogWidth = '90vw';
      dialogHeight = '80vh';
    }

    const dialogRef = this.dialog.open(ModalNewEditComponent, {
      data: { actionName: actionName, movementData: movementData },
      width: dialogWidth,
      height: dialogHeight,
      disableClose: false,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== null) {
        this.getAllMoviments();
        this.message = result;
      }
    });
  }

  deleteCategory(id: string) {
    this.movimentsService.deleteMoviment(id).subscribe({
      next: () => {
        this.getAllMoviments();
        this.messageNz.success(`Moviment has been deleted`, {
          nzDuration: 1000,
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
