import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { ModalCreateEditComponent } from './modal-create-edit.component';
import { CategoriesService } from '../../service/categories.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { takeUntil } from 'rxjs/operators';

describe('ModalCreateEditComponent', () => {
  let component: ModalCreateEditComponent;
  let fixture: ComponentFixture<ModalCreateEditComponent>;
  let matDialogRefSpy: jasmine.SpyObj<MatDialogRef<ModalCreateEditComponent>>;
  let categoriesServiceSpy: jasmine.SpyObj<CategoriesService>;
  let messageServiceSpy: jasmine.SpyObj<NzMessageService>;

  const dialogData = {
    actionName: 'create',
    idCategory: null,
  };

  beforeEach(waitForAsync(() => {
    const matDialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    const categoriesServiceSpyObj = jasmine.createSpyObj('CategoriesService', [
      'postCategory',
      'putCategory',
      'getCategoryById',
    ]);
    const messageServiceSpyObj = jasmine.createSpyObj('NzMessageService', [
      'success',
    ]);

    TestBed.configureTestingModule({
      declarations: [ModalCreateEditComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: CategoriesService, useValue: categoriesServiceSpyObj },
        { provide: NzMessageService, useValue: messageServiceSpyObj },
        FormBuilder,
      ],
    }).compileComponents();

    matDialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<ModalCreateEditComponent>
    >;
    categoriesServiceSpy = TestBed.inject(
      CategoriesService
    ) as jasmine.SpyObj<CategoriesService>;
    messageServiceSpy = TestBed.inject(
      NzMessageService
    ) as jasmine.SpyObj<NzMessageService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should save new category on saveInfo if idCategory does not exist', () => {
    const params = {
      nome: 'New Category',
      descricao: 'New Description',
    };

    categoriesServiceSpy.postCategory.and.returnValue(of({}));
    messageServiceSpy.success.and.callThrough();

    // Set form values and make sure it is valid
    component.categoryForm.patchValue(params);
    expect(component.categoryForm.valid).toBeTruthy();

    // Call saveInfo
    component.saveInfo();

    // Expectations
    expect(categoriesServiceSpy.postCategory).toHaveBeenCalledWith(params);
    expect(matDialogRefSpy.close).toHaveBeenCalled();
    expect(messageServiceSpy.success).toHaveBeenCalledWith(
      'Category has been created',
      { nzDuration: 1000 }
    );
  });

  it('should initialize form with empty values and title if idCategory does not exist', () => {
    component.ngOnInit();

    expect(component.infoData.actionName).toEqual('create');
    expect(component.title).toEqual('create');
    expect(component.categoryForm.value.nome).toEqual('');
    expect(component.categoryForm.value.descricao).toEqual('');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on closeModal', () => {
    matDialogRefSpy.close.and.callThrough();

    component.closeModal();

    expect(matDialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close dialog with data on closeDialog', () => {
    const dummyData = { message: 'Success' };

    component.closeDialog(dummyData);

    expect(matDialogRefSpy.close).toHaveBeenCalledWith(dummyData);
  });

  it('should update category on saveInfo if idCategory exists', () => {
    const params = {
      nome: 'Updated Category',
      descricao: 'Updated Description',
      id: '1',
    };
    categoriesServiceSpy.putCategory.and.returnValue(of({}));
    messageServiceSpy.success.and.callThrough();

    component.categoryForm.patchValue(params);
    component.infoData = { actionName: 'update', idCategory: '1' };
    component.saveInfo();

    expect(categoriesServiceSpy.putCategory).toHaveBeenCalledWith(params);
    expect(matDialogRefSpy.close).toHaveBeenCalled();
    expect(messageServiceSpy.success).toHaveBeenCalledWith(
      'Category has been updated',
      { nzDuration: 1000 }
    );
  });

  it('should unsubscribe from observables on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should call getCategoryById and update the form on success', () => {
    const mockCategory = { nome: 'Category 1', descricao: 'Description 1' };
    categoriesServiceSpy.getCategoryById.and.returnValue(of(mockCategory));
    spyOn(component, 'updateCategoryForm');

    component.getCategoryById('1');

    expect(categoriesServiceSpy.getCategoryById).toHaveBeenCalledWith('1');
    expect(component.updateCategoryForm).toHaveBeenCalledWith(mockCategory);
  });

  it('should handle error if getCategoryById fails', () => {
    const error = { message: 'Error occurred' };
    categoriesServiceSpy.getCategoryById.and.returnValue(throwError(error));
    spyOn(console, 'log');

    component.getCategoryById('1');

    expect(categoriesServiceSpy.getCategoryById).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
