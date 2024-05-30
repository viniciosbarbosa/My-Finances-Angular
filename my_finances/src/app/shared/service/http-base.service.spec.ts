// http-base.service.spec.ts

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HttpBaseService } from './http-base.service';
import { environments } from 'src/app/environments/environments';

describe('HttpBaseService', () => {
  let service: HttpBaseService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpBaseService],
    });
    service = TestBed.inject(HttpBaseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a GET request', () => {
    const endpoint = 'test';
    const testData = { data: 'test' };

    service['httpGet'](endpoint).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environments.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(testData);
  });

  it('should send a POST request', () => {
    const endpoint = 'test';
    const testData = { data: 'test' };
    const payload = { payload: 'test' };

    service['httpPost'](endpoint, payload).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environments.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(testData);
  });

  it('should send a PUT request', () => {
    const endpoint = 'test';
    const testData = { data: 'test' };
    const payload = { payload: 'test' };

    service['httpPut'](endpoint, payload).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environments.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    req.flush(testData);
  });

  it('should send a DELETE request', () => {
    const endpoint = 'test';
    const testData = { data: 'test' };

    service['httpDelete'](endpoint).subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne(
      `${environments.apiUrl}/${endpoint}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(testData);
  });
});
