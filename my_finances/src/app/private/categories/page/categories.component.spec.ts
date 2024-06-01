import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalCreateEditComponent } from '../components/modal-create-edit/modal-create-edit.component';
import { CategoriesComponent } from './categories.component';
import { CategoriesService } from '../service/categories.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Categories } from '../model/Categories';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let categoriesService: CategoriesService;
  let dialog: MatDialog;
  let messageService: NzMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesComponent],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        NzTableModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [CategoriesService, MatDialog, NzMessageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService);
    dialog = TestBed.inject(MatDialog);
    messageService = TestBed.inject(NzMessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch categories on init', () => {
    const dummyCategories: [Categories] = [
      { id: '1', nome: 'Category 1', descricao: 'Category' },
    ];
    spyOn(categoriesService, 'getCategories').and.returnValue(
      of(dummyCategories)
    );

    component.ngOnInit();

    expect(categoriesService.getCategories).toHaveBeenCalled();
    expect(component.tableCategoriesData).toEqual(dummyCategories);
    expect(component.loading).toBeFalse();
  });

  it('should open dialog and refresh categories on modal close with result', () => {
    const dummyCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    spyOn(categoriesService, 'getCategories').and.returnValue(
      of(dummyCategories)
    );
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of('Result') });
    spyOn(dialog, 'open').and.returnValue(dialogRefSpy);

    component.callModalCategory('create');

    expect(dialog.open).toHaveBeenCalledWith(
      ModalCreateEditComponent,
      jasmine.any(Object)
    );
    expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
    expect(categoriesService.getCategories).toHaveBeenCalled();
  });

  it('should delete a category and refresh the list', () => {
    const dummyCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];
    spyOn(categoriesService, 'deleteCategory').and.returnValue(of({}));
    spyOn(categoriesService, 'getCategories').and.returnValue(
      of(dummyCategories)
    );
    spyOn(messageService, 'success');

    component.deleteCategory('1');

    expect(categoriesService.deleteCategory).toHaveBeenCalledWith('1');
    expect(categoriesService.getCategories).toHaveBeenCalled();
    expect(messageService.success).toHaveBeenCalledWith(
      'Category has been deleted',
      { nzDuration: 1000 }
    );
  });
  it('should call ngOnDestroy and complete destroy$', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
