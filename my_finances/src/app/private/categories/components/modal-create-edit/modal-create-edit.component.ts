import { CategoriesService } from './../../service/categories.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { Categories } from '../../model/Categories';

@Component({
  selector: 'app-modal-create-edit',
  templateUrl: './modal-create-edit.component.html',
  styleUrls: ['./modal-create-edit.component.scss'],
})
export class ModalCreateEditComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  categoryForm!: FormGroup;
  changeReported: boolean = false;
  infoData: any;
  title: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    public matDialogRef: MatDialogRef<ModalCreateEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}

  ngOnInit(): void {
    this.getDataAndVerify();
    this.createForm();
  }

  getDataAndVerify(): void {
    this.infoData = this.data;

    this.title = this.infoData.actionName;

    if (
      this.infoData.idCategory !== null &&
      this.infoData.idCategory !== undefined
    ) {
      this.getCategoryById(this.infoData.idCategory);
    }
  }

  getCategoryById(id: string) {
    this.categoriesService
      .getCategoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.updateCategoryForm(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  createForm(): void {
    this.categoryForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.categoryForm.valueChanges.subscribe(() => {
      this.verifyFormChanges();
    });
  }

  updateCategoryForm(catogory: Categories): void {
    this.categoryForm.patchValue({
      nome: catogory.nome,
      descricao: catogory.descricao,
      id: catogory.id,
    });
  }

  closeModal(): void {
    this.matDialogRef.close();
  }

  verifyFormChanges(): void {
    this.changeReported = Object.keys(this.categoryForm.controls).some(
      (key) => this.categoryForm.get(key)?.dirty
    );
  }

  closeDialog(data?: any): void {
    this.matDialogRef.close(data);
  }

  saveInfo(): void {
    if (
      this.infoData.idCategory !== null &&
      this.infoData.idCategory !== undefined
    ) {
      const params = {
        nome: this.categoryForm.value.nome,
        descricao: this.categoryForm.value.descricao,
        id: this.infoData.idCategory,
      };

      this.categoriesService
        .putCategory(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.closeDialog(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      const params = {
        nome: this.categoryForm.value.nome,
        descricao: this.categoryForm.value.descricao,
      };

      this.categoriesService
        .postCategory(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.closeDialog(response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
