import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Categories } from '../model/Categories';
import { MatDialog } from '@angular/material/dialog';
import { ModalCreateEditComponent } from '../components/modal-create-edit/modal-create-edit.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  tableCategoriesData: Categories[] = [];
  total = 1;
  loading = true;
  pageSize = 5;
  pageIndex = 1;
  message = '';

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private messageNz: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  callModalCategory(action: string, id?: string): void {
    let dialogWidth = '70vw';
    let dialogHeight = '50vh';

    if (window.innerWidth <= 500) {
      dialogWidth = '80vw';
      dialogHeight = '60vh';
    }

    const dialogRef = this.dialog.open(ModalCreateEditComponent, {
      data: { actionName: action, idCategory: id },
      width: dialogWidth,
      height: dialogHeight,
      disableClose: true,
      enterAnimationDuration: '300ms',
      exitAnimationDuration: '300ms',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result !== null) {
        this.getAllCategories();
        this.message = result;
      }
    });
  }

  getAllCategories(): void {
    this.categoriesService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Categories[]) => {
          this.loading = false;
          this.tableCategoriesData = response;
        },
        error: (error) => {
          this.loading = false;
          console.log(error);
        },
      });
  }

  deleteCategory(id: string): void {
    this.categoriesService
      .deleteCategory(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getAllCategories();
          this.messageNz.success(`Category has been deleted`, {
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
