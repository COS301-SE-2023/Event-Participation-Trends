import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-compare-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css'],
})
export class ComparePageComponent {
  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;
  public categories: string[] = [];

  constructor(private readonly appApiService: AppApiService, private readonly route: ActivatedRoute, private readonly router: Router) {}

  async ngOnInit() {
    // retrieve categories from API
    this.categories = await this.appApiService.getManagedEventCategories();

    this.loading = false;

    setTimeout(() => {
      this.show = true;
    }, 200);    
  }
}
