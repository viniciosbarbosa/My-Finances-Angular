import { ExtractService } from './../service/extract.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { dataExtractInfo } from '../model/dataExtractInfo';

@Component({
  selector: 'app-extract',
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.scss'],
})
export class ExtractComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  constructor(private extractService: ExtractService) {}

  ngOnInit(): void {
    this.getAllExtractValues();
    console.log(typeof this.infoExtract.balance);
  }

  infoExtract = {
    balance: 0,
    debts: 0,
    incomes: 0,
  };

  getAllExtractValues() {
    this.extractService
      .getAllExtract()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        console.log(response);
        this.allBalances(response);
      });
  }

  allBalances(balances: any) {
    balances.forEach((balance: dataExtractInfo) => {
      if (balance.tipo === 'receita') {
        this.infoExtract.incomes += parseInt(balance.valor);
      } else {
        this.infoExtract.debts += parseInt(balance.valor);
      }
    });

    return (this.infoExtract.balance =
      this.infoExtract.incomes - this.infoExtract.debts);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
