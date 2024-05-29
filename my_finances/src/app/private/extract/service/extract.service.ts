import { Injector, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';

@Injectable({
  providedIn: 'root',
})
export class ExtractService extends HttpBaseService {
  constructor(protected readonly inject: Injector) {
    super(inject);
  }

  private endpoint = 'entradas';

  getAllExtract(): Observable<any> {
    return this.httpGet(this.endpoint);
  }
}
