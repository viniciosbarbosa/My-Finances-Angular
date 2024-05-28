import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseService {
  private readonly httpClient!: HttpClient;

  private apiUrl = environments.apiUrl;

  constructor(protected readonly injector: Injector) {
    if (injector == null || injector == undefined) {
      throw new Error('Injector nao pode ser nulo');
    }
    this.httpClient = injector.get(HttpClient);
  }

  protected httpGet(endpoint: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/${endpoint}`);
  }

  protected httpPost(endpoint: string, payload: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/${endpoint}`, payload);
  }

  protected httpPut(endpoint: string, payload: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/${endpoint}`, payload);
  }

  protected httpDelete(endpoint: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${endpoint}`);
  }
}
