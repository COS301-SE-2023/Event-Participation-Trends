import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-compare-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare-page.component.html',
  styleUrls: ['./compare-page.component.css'],
})
export class ComparePageComponent implements OnInit{

  constructor(private appApiService: AppApiService, private router: Router) {}

  async ngOnInit() {

    const role = await this.appApiService.getRole();

    if (role === 'viewer') {
      this.router.navigate(['/home']);
    }

  }
}
