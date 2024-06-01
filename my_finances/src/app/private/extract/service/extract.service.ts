import { FormsModule } from '@angular/forms';
import { Injector, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpBaseService } from 'src/app/shared/service/http-base.service';
import { dataByMonthYear } from '../model/dataByMouthYear';

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

  getExtractByMouthYear(params: dataByMonthYear): Observable<any> {
    const dataFiltered: Array<any> = [];

    return this.httpGet(
      `${this.endpoint}?mouth=${params.month}&year=${params.year}`
    ).pipe(
      map((data) => {
        const dataFiltered = data.filter((item: any) => {
          const [day, month, year] = item.data.split('/');
          return month === params.month && year === String(params.year);
        });

        return dataFiltered;
      })
    );
  }

  getAllMouths(): Observable<any> {
    return this.httpGet('meses');
  }

  getAllYears(): Observable<any> {
    return this.httpGet('anos');
  }
}
