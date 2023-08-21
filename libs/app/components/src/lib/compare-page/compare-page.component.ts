import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'event-participation-trends-compare-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
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

  constructor(private readonly appApiService: AppApiService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  async ngOnInit() {
    // retrieve categories from API
    this.role = await this.appApiService.getRole();

    if (this.role === 'admin') {
      //get all categories
      this.categories = await this.appApiService.getAllEventCategories();
    } else if (this.role === 'manager') {
      //get managed categories
      this.categories = await this.appApiService.getManagedEventCategories();
    }

    console.log(this.categories);

    this.loading = false;

    setTimeout(() => {
      this.show = true;
    }, 200);
  }
}
