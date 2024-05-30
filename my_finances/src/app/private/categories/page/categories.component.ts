import { CategoriesService } from './../service/categories.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Categories } from '../model/Categories';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  constructor(private categoriesService: CategoriesService) {}

  tableCategoriesData!: Array<Categories>;
  total = 1;
  loading = true;
  pageSize = 5;
  pageIndex = 1;

  ngOnInit(): void {
    this.getAllCategories();
  }

  newCategory() {}

  getAllCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (response) => {
        this.loading = false;
        this.tableCategoriesData = response;
        console.log(this.tableCategoriesData);
      },
      error: (error) => {
        this.loading = false;

        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(), this.destroy$.complete();
  }
}
