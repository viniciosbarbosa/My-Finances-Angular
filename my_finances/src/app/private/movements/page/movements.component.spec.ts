import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovementsComponent } from './movements.component';
import { MovimentsService } from './../service/moviments.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Moviment } from '../model/movement.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MovementsComponent', () => {
  let component: MovementsComponent;
  let fixture: ComponentFixture<MovementsComponent>;
  let mockMovimentsService: jasmine.SpyObj<MovimentsService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockNzMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    const movimentsServiceSpy = jasmine.createSpyObj('MovimentsService', [
      'getMoviments',
      'deleteMoviment',
      'getMovimentById',
      'postMoviment',
      'putMoviment',
    ]);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const nzMessageServiceSpy = jasmine.createSpyObj('NzMessageService', [
      'success',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        NoopAnimationsModule,
        NzTableModule,
      ],
      declarations: [MovementsComponent],
      providers: [
        { provide: MovimentsService, useValue: movimentsServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: NzMessageService, useValue: nzMessageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementsComponent);
    component = fixture.componentInstance;
    mockMovimentsService = TestBed.inject(
      MovimentsService
    ) as jasmine.SpyObj<MovimentsService>;
    mockMatDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockNzMessageService = TestBed.inject(
      NzMessageService
    ) as jasmine.SpyObj<NzMessageService>;

    // Setting up default returns for all service methods
    mockMovimentsService.getMoviments.and.returnValue(of([]));
    mockMovimentsService.deleteMoviment.and.returnValue(of(null));
    mockMovimentsService.getMovimentById.and.returnValue(of(null));
    mockMovimentsService.postMoviment.and.returnValue(of(null));
    mockMovimentsService.putMoviment.and.returnValue(of(null));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getAllMoviments', () => {
      spyOn(component, 'getAllMoviments');
      component.ngOnInit();
      expect(component.getAllMoviments).toHaveBeenCalled();
    });
  });

  describe('getAllMoviments', () => {
    it('should fetch moviments and set tableMovimentsData', () => {
      const mockMoviments: Array<Moviment> = [
        {
          id: '6',
          nome: 'Video Game',
          categoriaId: '3',
          pago: false,
          data: '17/03/2023',
          valor: '15,00',
          tipo: 'despesa',
        },
      ];
      mockMovimentsService.getMoviments.and.returnValue(of(mockMoviments));

      component.getAllMoviments();

      expect(mockMovimentsService.getMoviments).toHaveBeenCalled();
      expect(component.tableMovimentsData).toEqual(mockMoviments);
      expect(component.loading).toBeFalse();
    });

    it('should handle error and set loading to false', () => {
      mockMovimentsService.getMoviments.and.returnValue(throwError('error'));

      component.getAllMoviments();

      expect(mockMovimentsService.getMoviments).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });

  describe('callModalMoviment', () => {
    it('should open modal and refresh data on close with result', () => {
      const dialogRefSpy = jasmine.createSpyObj({
        afterClosed: of('some result'),
      });
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      spyOn(component, 'getAllMoviments');

      component.callModalMoviment('add');

      expect(mockMatDialog.open).toHaveBeenCalled();
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(component.getAllMoviments).toHaveBeenCalled();
      expect(component.message).toBe('some result');
    });

    it('should open modal and not refresh data on close without result', () => {
      const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(undefined) });
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      spyOn(component, 'getAllMoviments');

      component.callModalMoviment('add');

      expect(mockMatDialog.open).toHaveBeenCalled();
      expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
      expect(component.getAllMoviments).not.toHaveBeenCalled();
      expect(component.message).toBe('');
    });
  });

  describe('deleteCategory', () => {
    it('should delete moviment and refresh data on success', () => {
      mockMovimentsService.deleteMoviment.and.returnValue(of(null));
      spyOn(component, 'getAllMoviments');

      component.deleteCategory('1');

      expect(mockMovimentsService.deleteMoviment).toHaveBeenCalledWith('1');
      expect(component.getAllMoviments).toHaveBeenCalled();
      expect(mockNzMessageService.success).toHaveBeenCalledWith(
        `Moviment has been deleted`,
        { nzDuration: 1000 }
      );
    });

    it('should handle error on delete moviment', () => {
      mockMovimentsService.deleteMoviment.and.returnValue(throwError('error'));

      component.deleteCategory('1');

      expect(mockMovimentsService.deleteMoviment).toHaveBeenCalledWith('1');
      expect(mockNzMessageService.success).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete destroy$ subject', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
