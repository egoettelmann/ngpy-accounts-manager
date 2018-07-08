import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../../services/categories.service';
import { Category } from '../../../../components/transactions/category';

@Component({
  templateUrl: './settings-categories-view.component.html',
  styleUrls: ['./settings-categories-view.component.scss']
})
export class SettingsCategoriesViewComponent implements OnInit {

  @HostBinding('class') hostClass = 'content-area';

  categories: Category[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.categoriesService.getAll().subscribe(categories => {
      this.categories = categories.slice(0);
    });
  }

}
