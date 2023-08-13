import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppApiService } from '@event-participation-trends/app/api';

enum Tab {
  Dashboard = 'dashboard',
  Details = 'details',
  Floorplan = 'floorplan',
  None = '',
}

@Component({
  selector: 'event-participation-trends-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css'],
})
export class EventViewComponent implements OnInit {
  constructor(
    private appApiService: AppApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public id: string | null = '';
  public tab = Tab.None;

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (!this.id) {
      this.router.navigate(['/home']);
    }

    const t = window.location.href.split('/').pop();
    if (t === 'details') {
      this.tab = Tab.Details;
    } else if (t === 'dashboard') {
      this.tab = Tab.Dashboard;
    }
    else if (t === 'floorplan') {
      this.tab = Tab.Floorplan;
    }
  }

  pressButton(id: string) {
    const target = document.querySelector(id);

    target?.classList.add('hover:scale-[80%]');
    setTimeout(() => {
      target?.classList.remove('hover:scale-[80%]');
    }, 100);
  }

  goBack() {
    this.pressButton('#back');
    this.router.navigate(['/home']);
  }

  goDetails() {
    this.pressButton('#details');
    this.tab = Tab.Details;
  }

  goDashboard() {
    this.pressButton('#dashboard');
    this.tab = Tab.Dashboard;
  }

  goFloorplan() {
    this.pressButton('#floorplan');
    this.tab = Tab.Floorplan;
  }

  onFloorplan() : boolean {
    return this.tab === Tab.Floorplan;
  }

  onDetails() : boolean {
    return this.tab === Tab.Details;
  }

  onDashboard() : boolean {
    return this.tab === Tab.Dashboard;
  }
}
