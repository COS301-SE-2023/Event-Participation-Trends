import { Component, OnInit } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-compare-page',
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css'],
})
export class ComparePageComponent implements OnInit{
  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;
  public categories: string[] = [];
  public show_search = true;
  public role = 'viewer';
  public search = '';

  selectedCategory = '';

  constructor(private readonly appApiService: AppApiService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  async ngOnInit() {
    // retrieve categories from API
    this.role = await this.appApiService.getRole();

    if (this.role === 'admin') {
      //get all categories
      this.categories = await this.appApiService.getAllEventCategories();
      // set first item as selected
      this.selectedCategory = this.categories[0];
    } else if (this.role === 'manager') {
      //get managed categories
      this.categories = await this.appApiService.getManagedEventCategories();
      // set first item as selected
      this.selectedCategory = this.categories[0];
    }

    console.log(this.categories);

    this.loading = false;

    setTimeout(() => {
      this.show = true;
    }, 200);
  }

  isSelected(category: string): boolean {
    return category === this.selectedCategory;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  highlightText(text: string, search: string): string {
    if (!search || !text) {
      return text;
    }

    const pattern = new RegExp(search, 'gi');
    return text.replace(pattern, match => `<span class="bg-ept-bumble-yellow text-ept-navy-blue">${match}</span>`);
  }

  getEventCategories() : string[] {
    const categoryList = this.categories;

    return categoryList.filter((category) => {
      return category
        ? category.toLowerCase().includes(this.search.toLowerCase())
        : false;
    });
  }
}
