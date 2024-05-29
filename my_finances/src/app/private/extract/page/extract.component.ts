import { ExtractService } from './../service/extract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { dataExtractInfo } from '../model/dataExtractInfo';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  infoExtract = {
    balance: 0,
    debts: 0,
    incomes: 0,
  };

  btnGeralExtract: boolean = false;

  months: Array<any> = [];
  years: Array<any> = [];

  formExtract!: FormGroup;

  constructor(
    private extractService: ExtractService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formInit();
    this.getDatesYear();
    this.getAllExtractValues();
  }

  getAllExtractValues() {
    this.extractService
      .getAllExtract()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.allBalances(response);
      });
  }

  clearFilterDatas() {
    this.btnGeralExtract = false;
    this.resetForm();
    this.getAllExtractValues();
  }

  formInit(): void {
    this.formExtract = this.formBuilder.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }

  async getDatesYear() {
    await this.extractService
      .getAllMouths()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.months = response;
      });

    await this.extractService
      .getAllYears()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.years = response;
      });
  }
  getInfoByMouthYear(): void {
    const params = {
      month: this.formExtract.value.month,
      year: this.formExtract.value.year,
    };

    this.extractService
      .getExtractByMouthYear(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.allBalances(response);
            this.btnGeralExtract = true;
          } else {
            this.infoExtract.incomes = 0;
            this.infoExtract.debts = 0;
            this.infoExtract.balance = 0;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  resetForm() {
    this.formExtract.reset(
      {
        month: [''],
        year: [''],
      },
      { emitEvent: false }
    );
  }

  allBalances(balances: any) {
    if (balances.length > 0) {
      this.infoExtract.incomes = 0;
      this.infoExtract.debts = 0;
      this.infoExtract.balance = 0;

      balances.forEach((balance: dataExtractInfo) => {
        if (balance.tipo === 'receita') {
          this.infoExtract.incomes += parseInt(balance.valor);
        } else {
          this.infoExtract.debts += parseInt(balance.valor);
        }
      });
    }

    return (this.infoExtract.balance =
      this.infoExtract.incomes - this.infoExtract.debts);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
