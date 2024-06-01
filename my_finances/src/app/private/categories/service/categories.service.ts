import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';
import { Categories } from '../model/Categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends HttpBaseService {
  private endpoint = 'categorias';

  constructor(protected readonly inject: Injector) {
    super(inject);
  }

  getCategories(): Observable<any> {
    return this.httpGet(`${this.endpoint}`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.httpGet(`${this.endpoint}/${id}`);
  }

  putCategory(params: Categories): Observable<any> {
    return this.httpPut(`${this.endpoint}/${params.id}`, params);
  }

  deleteCategory(id: string): Observable<any> {
    return this.httpDelete(`${this.endpoint}/${id}`);
  }

  postCategory(params: Categories): Observable<any> {
    return this.httpPost(`${this.endpoint}`, params);
  }
}
