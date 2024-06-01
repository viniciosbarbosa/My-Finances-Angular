import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoriesService } from './categories.service';
import { Categories } from '../model/Categories';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriesService],
    });
    service = TestBed.inject(CategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch categories', () => {
    const dummyCategories = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' },
    ];

    service.getCategories().subscribe((categories) => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(dummyCategories);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/${service['endpoint']}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyCategories);
  });

  it('should fetch category by id', () => {
    const dummyCategory = { id: '1', name: 'Category 1' };

    service.getCategoryById('1').subscribe((category) => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/${service['endpoint']}/1`
    );

    expect(req.request.method).toBe('GET');
    req.flush(dummyCategory);
  });

  it('should update a category', () => {
    const dummyCategory: Categories = {
      id: '1',
      nome: 'New Category',
      descricao: 'bla bla',
    };

    service.putCategory(dummyCategory).subscribe((category) => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/${service['endpoint']}/1`
    );

    expect(req.request.method).toBe('PUT');
    req.flush(dummyCategory);
  });

  it('should delete a category', () => {
    service.deleteCategory('1').subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/${service['endpoint']}/1`
    );

    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a category', () => {
    const dummyCategory: Categories = {
      id: '1',
      nome: 'New Category',
      descricao: 'bla bla',
    };

    service.postCategory(dummyCategory).subscribe((category) => {
      expect(category).toEqual(dummyCategory);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/${service['endpoint']}`
    );

    expect(req.request.method).toBe('POST');
    req.flush(dummyCategory);
  });
});
