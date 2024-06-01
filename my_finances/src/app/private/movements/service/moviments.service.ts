import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';
import { Moviment } from '../model/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovimentsService extends HttpBaseService {
  private endpoint = 'entradas';

  constructor(protected readonly inject: Injector) {
    super(inject);
  }

  getMoviments(): Observable<any> {
    return this.httpGet(`${this.endpoint}`);
  }

  getMovimentById(id: string): Observable<any> {
    return this.httpGet(`${this.endpoint}/${id}`);
  }

  postMoviment(params: Moviment): Observable<any> {
    return this.httpPost(`${this.endpoint}`, params);
  }

  deleteMoviment(id: string): Observable<any> {
    return this.httpDelete(`${this.endpoint}/${id}`);
  }

  putMoviment(params: Moviment): Observable<any> {
    return this.httpPut(`${this.endpoint}/${params.id}`, params);
  }
}
