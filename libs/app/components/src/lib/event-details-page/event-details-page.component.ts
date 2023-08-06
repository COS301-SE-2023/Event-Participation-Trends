import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'event-participation-trends-event-details-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-details-page.component.html',
  styleUrls: ['./event-details-page.component.css'],
})
export class EventDetailsPageComponent implements OnInit {

  constructor(private appApiService: AppApiService, private router : Router, private route: ActivatedRoute) {}

  public id = '';
  public event : any | null = null;
  public show = false;
  public loading = true;

  async ngOnInit() {
    
    this.id = this.route.parent?.snapshot.paramMap.get('id') || '';

    if (!this.id) {
      this.router.navigate(['/']);
    }

    this.event = (await this.appApiService.getEvent({ eventId: this.id }) as any).event;

    if (this.event === null) {
      this.router.navigate(['/home']);
    }
    
    this.loading = false;
    setTimeout(() => {
      this.show = true;
    }, 200);

  }

}
