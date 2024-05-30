import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ExtractService } from './extract.service';
import { dataByMonthYear } from '../model/dataByMouthYear';

describe('ExtractService', () => {
  let service: ExtractService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExtractService],
    });
    service = TestBed.inject(ExtractService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all extracts', () => {
    const mockResponse = [
      { id: 1, value: 100 },
      { id: 2, value: 200 },
    ];

    service.getAllExtract().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      'http://localhost:3000/entradas'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get extracts by month and year', () => {
    const params: dataByMonthYear = { month: '05', year: '2024' };
    const mockResponse = [
      { data: '10/05/2024', value: 100 },
      { data: '15/05/2024', value: 200 },
      { data: '20/06/2024', value: 300 },
    ];
    const expectedResponse = [
      { data: '10/05/2024', value: 100 },
      { data: '15/05/2024', value: 200 },
    ];

    service.getExtractByMouthYear(params).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpTestingController.expectOne(
      'http://localhost:3000/entradas?mouth=05&year=2024'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all months', () => {
    const mockResponse = ['January', 'February', 'March'];

    service.getAllMouths().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/meses');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all years', () => {
    const mockResponse = [2021, 2022, 2023];

    service.getAllYears().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/anos');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
