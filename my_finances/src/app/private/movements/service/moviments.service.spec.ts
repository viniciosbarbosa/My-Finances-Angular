import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MovimentsService } from './moviments.service';
import { Moviment } from '../model/movement.model';

describe('MovimentsService', () => {
  let service: MovimentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovimentsService],
    });
    service = TestBed.inject(MovimentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch moviments (GET)', () => {
    const dummyMoviments = [
      { id: '1', name: 'Moviment 1' },
      { id: '2', name: 'Moviment 2' },
    ];

    service.getMoviments().subscribe((moviments) => {
      expect(moviments.length).toBe(2);
      expect(moviments).toEqual(dummyMoviments);
    });

    const req = httpMock.expectOne('http://localhost:3000/entradas');

    expect(req.request.method).toBe('GET');
    req.flush(dummyMoviments);
  });

  it('should fetch a moviment by ID (GET)', () => {
    const dummyMoviment = { id: '1', name: 'Moviment 1' };

    service.getMovimentById('1').subscribe((moviment) => {
      expect(moviment).toEqual(dummyMoviment);
    });

    const req = httpMock.expectOne('http://localhost:3000/entradas/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyMoviment);
  });

  it('should create a new moviment (POST)', () => {
    const newMoviment: Moviment = {
      id: '3',
      nome: 'New Moviment',
      categoriaId: '1',
      data: '15/03/2023',
      pago: true,
      tipo: 'despesa',
      valor: '1500',
    };

    service.postMoviment(newMoviment).subscribe((moviment) => {
      expect(moviment).toEqual(newMoviment);
    });

    const req = httpMock.expectOne('http://localhost:3000/entradas');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMoviment);
    req.flush(newMoviment);
  });

  it('should delete a moviment by ID (DELETE)', () => {
    const id = '1';

    service.deleteMoviment(id).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/entradas/1');

    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update a moviment (PUT)', () => {
    const updatedMoviment: Moviment = {
      id: '1',
      nome: 'New Moviment',
      categoriaId: '1',
      data: '15/03/2023',
      pago: true,
      tipo: 'despesa',
      valor: '1500',
    };

    service.putMoviment(updatedMoviment).subscribe((moviment) => {
      expect(moviment).toEqual(updatedMoviment);
    });

    const req = httpMock.expectOne('http://localhost:3000/entradas/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedMoviment);
    req.flush(updatedMoviment);
  });
});
