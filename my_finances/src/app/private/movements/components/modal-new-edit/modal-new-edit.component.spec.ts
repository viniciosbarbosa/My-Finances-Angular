import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalNewEditComponent } from './modal-new-edit.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService } from './../../../categories/service/categories.service';
import { MovimentsService } from './../../service/moviments.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';
import { FormatBrazilianCurrencyPipe } from 'src/app/shared/pipe/format-brazilian-currency.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ModalNewEditComponent', () => {
  let component: ModalNewEditComponent;
  let fixture: ComponentFixture<ModalNewEditComponent>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let movimentsService: jasmine.SpyObj<MovimentsService>;
  let messageService: jasmine.SpyObj<NzMessageService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ModalNewEditComponent>>;

  beforeEach(() => {
    const categoriesServiceSpy = jasmine.createSpyObj('CategoriesService', [
      'getCategories',
    ]);
    const movimentsServiceSpy = jasmine.createSpyObj('MovimentsService', [
      'postMoviment',
      'putMoviment',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('NzMessageService', [
      'success',
    ]);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ModalNewEditComponent, FormatBrazilianCurrencyPipe],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: CategoriesService, useValue: categoriesServiceSpy },
        { provide: MovimentsService, useValue: movimentsServiceSpy },
        { provide: NzMessageService, useValue: messageServiceSpy },
        FormatBrazilianCurrencyPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNewEditComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(
      CategoriesService
    ) as jasmine.SpyObj<CategoriesService>;
    movimentsService = TestBed.inject(
      MovimentsService
    ) as jasmine.SpyObj<MovimentsService>;
    messageService = TestBed.inject(
      NzMessageService
    ) as jasmine.SpyObj<NzMessageService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ModalNewEditComponent>
    >;

    categoriesService.getCategories.and.returnValue(of([]));
    movimentsService.postMoviment.and.returnValue(of({}));
    movimentsService.putMoviment.and.returnValue(of({}));

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form on init', () => {
    component.ngOnInit();
    expect(component.movimentForm).toBeDefined();
  });

  it('should fetch categories on init', () => {
    component.ngOnInit();
    expect(categoriesService.getCategories).toHaveBeenCalled();
  });

  it('should call verifyFormChanges on form value changes', () => {
    spyOn(component, 'verifyFormChanges');
    component.ngOnInit();
    component.movimentForm.patchValue({ nome: 'Test' });
    expect(component.verifyFormChanges).toHaveBeenCalled();
  });

  it('should update form with movement data', () => {
    const mockMoviment = {
      nome: 'Test',
      categoriaId: '1',
      pago: true,
      data: '01/01/2020',
      valor: '1',
      tipo: 'receita',
    };

    component.updateCategoryForm(mockMoviment);
    expect(component.movimentForm.value.nome).toBe('Test');
    expect(component.movimentForm.value.categoriaId).toBe('1');
    expect(component.movimentForm.value.pago).toBe(true);
    expect(component.movimentForm.value.data).toEqual(new Date(2020, 0, 1));

    expect(component.movimentForm.value.tipo).toBe('receita');
  });

  it('should call saveInfo and postMoviment when no movementData', () => {
    component.ngOnInit();
    component.infoData = { actionName: 'Create', movementData: null };
    component.saveInfo();
    expect(movimentsService.postMoviment).toHaveBeenCalled();
  });

  it('should call saveInfo and putMoviment when there is movementData', () => {
    component.ngOnInit();
    component.infoData = { actionName: 'Edit', movementData: { id: 1 } };
    component.saveInfo();
    expect(movimentsService.putMoviment).toHaveBeenCalled();
  });

  it('should close dialog on save', () => {
    component.ngOnInit();
    component.infoData = { actionName: 'Create', movementData: null };
    component.saveInfo();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call message.success on save', () => {
    component.ngOnInit();
    component.infoData = { actionName: 'Create', movementData: null };
    component.saveInfo();
    expect(messageService.success).toHaveBeenCalled();
  });

  it('should set changeReported to false if form is dirty', () => {
    component.ngOnInit();
    component.movimentForm.patchValue({ nome: 'Test' });
    expect(component.changeReported).toBe(false);
  });

  it('should set changeReported to false if form is pristine', () => {
    component.ngOnInit();
    expect(component.changeReported).toBe(false);
  });

  afterEach(() => {
    component.ngOnDestroy();
  });
});
