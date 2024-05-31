import { Categories } from './../../../categories/model/Categories';
import { CategoriesService } from './../../../categories/service/categories.service';
import { MovimentsService } from './../../service/moviments.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject, takeUntil } from 'rxjs';
import { Moviment } from '../../model/movement.model';

@Component({
  selector: 'app-modal-new-edit',
  templateUrl: './modal-new-edit.component.html',
  styleUrls: ['./modal-new-edit.component.scss'],
})
export class ModalNewEditComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  movimentForm!: FormGroup;
  changeReported: boolean = false;
  infoData: any;
  title: string = '';
  categories: Array<Categories> = [];

  paycheckStatus = [
    { value: true, descricao: 'Pago' },
    { value: false, descricao: 'Pendente' },
  ];

  typeMoviments = [{ value: 'receita' }, { value: 'despesa' }];

  constructor(
    private movimentsService: MovimentsService,
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    public matDialogRef: MatDialogRef<ModalNewEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.createForm();
    this.getDataAndVerify();
  }

  createForm(): void {
    this.movimentForm = this.formBuilder.group({
      nome: ['', Validators.required],
      categoriaId: ['', Validators.required],
      pago: [true, Validators.required],
      data: [new Date(), Validators.required],
      valor: ['', Validators.required],
      tipo: ['despesa', Validators.required],
    });

    this.movimentForm.valueChanges.subscribe(() => {
      this.verifyFormChanges();
    });
  }

  verifyFormChanges(): void {
    this.changeReported = Object.keys(this.movimentForm.controls).some(
      (key) => this.movimentForm.get(key)?.dirty
    );
  }

  getDataAndVerify(): void {
    this.infoData = this.data;
    this.title = this.infoData.actionName;

    if (
      this.infoData.movementData !== null &&
      this.infoData.movementData !== undefined
    ) {
      this.updateCategoryForm(this.infoData.movementData);
    }
  }

  getCategories() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log(this.categories);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateCategoryForm(moviment: Moviment): void {
    const dataFormatada = moviment.data.split('/');

    this.movimentForm.patchValue({
      nome: moviment.nome,
      categoriaId: moviment.categoriaId.toString(),
      pago: moviment.pago,
      data: new Date(+dataFormatada[2], +dataFormatada[1], +dataFormatada[0]),
      tipo: moviment.tipo,
      valor: parseFloat(moviment.valor),
    });
  }

  closeDialog(data?: any): void {
    this.matDialogRef.close(data);
  }

  saveInfo(): void {
    if (
      this.infoData.movementData !== null &&
      this.infoData.movementData !== undefined
    ) {
      const params = {
        nome: this.movimentForm.value.nome,
        categoriaId: this.movimentForm.value.categoriaId,
        pago: this.movimentForm.value.pago,
        data: this.movimentForm.value.data,
        valor: this.movimentForm.value.valor,
        tipo: this.movimentForm.value.tipo,
      };

      this.movimentsService
        .postMoviment(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.closeDialog(response);
            this.message.success(`Moviment has been created`, {
              nzDuration: 1000,
            });
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      const params = {
        nome: this.movimentForm.value.nome,
        categoriaId: this.movimentForm.value.categoriaId,
        pago: this.movimentForm.value.pago,
        data: this.movimentForm.value.data,
        valor: this.movimentForm.value.valor,
        tipo: this.movimentForm.value.tipo,
        id: this.infoData.movementData.id,
      };

      this.movimentsService
        .putMoviment(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.closeDialog(response);
            this.message.success(`Moviment has been updated`, {
              nzDuration: 1000,
            });
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
