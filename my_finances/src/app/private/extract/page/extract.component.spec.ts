import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ExtractComponent } from './extract.component';
import { ExtractService } from './../service/extract.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { of } from 'rxjs';
import { FormatBrazilianCurrencyPipe } from 'src/app/shared/pipe/format-brazilian-currency.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ExtractComponent', () => {
  let component: ExtractComponent;
  let fixture: ComponentFixture<ExtractComponent>;
  let extractService: ExtractService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtractComponent, FormatBrazilianCurrencyPipe],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        BrowserAnimationsModule,
      ],
      providers: [ExtractService, FormBuilder],
    });

    fixture = TestBed.createComponent(ExtractComponent);
    component = fixture.componentInstance;
    extractService = TestBed.inject(ExtractService);

    spyOn(extractService, 'getAllExtract').and.returnValue(
      of([
        { id: 1, value: 100 },
        { id: 2, value: 200 },
      ])
    );

    spyOn(extractService, 'getAllMouths').and.returnValue(
      of(['January', 'February', 'March'])
    );
    spyOn(extractService, 'getAllYears').and.returnValue(
      of([2021, 2022, 2023])
    );
    spyOn(extractService, 'getExtractByMouthYear').and.returnValue(
      of([
        { data: '10/05/2024', value: 100 },
        { data: '15/05/2024', value: 200 },
      ])
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all extracts on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.infoExtract.balance).toEqual(NaN);
  }));

  it('should get all months and years on init', () => {
    component.ngOnInit();
    expect(component.months).toEqual(['January', 'February', 'March']);
    expect(component.years).toEqual([2021, 2022, 2023]);
  });

  it('should filter extracts by month and year', () => {
    component.formExtract.setValue({ month: '05', year: '2024' });
    component.getInfoByMouthYear();
    expect(component.infoExtract.balance).toEqual(NaN);
  });

  it('should clear filter data', () => {
    component.clearFilterDatas();
    expect(component.btnGeralExtract).toBeFalse();
    expect(component.formExtract.value).toEqual({ month: [''], year: [''] });
  });

  it('should calculate all balances correctly', () => {
    const balances = [
      { tipo: 'receita', valor: '100' },
      { tipo: 'despesa', valor: '50' },
    ];
    const balance = component.allBalances(balances);
    expect(balance).toEqual(50);
  });
});
