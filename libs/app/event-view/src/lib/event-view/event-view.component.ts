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

  // Navbar
  // Back
  public expandBack = false;
  public overflowBack = false;
  showBack() {
    this.expandBack = true;
    this.overflowBack = true;
  }
  hideBack() {
    this.expandBack = false;
    setTimeout(() => {
      this.overflowBack = false;
    }, 300);
  }

  // Help
  public expandHelp = false;
  public overflowHelp = false;
  showHelp() {
    this.expandHelp = true;
    this.overflowHelp = true;
  }
  hideHelp() {
    this.expandHelp = false;
    setTimeout(() => {
      this.overflowHelp = false;
    }, 300);
  }

  // Dashboard
  public expandDashboard = false;
  public overflowDashboard = false;
  showDashboard() {
    this.expandDashboard = true;
    this.overflowDashboard = true;
  }
  hideDashboard() {
    this.expandDashboard = false;
    setTimeout(() => {
      this.overflowDashboard = false;
    }, 300);
  }

  // Details
  public expandDetails = false;
  public overflowDetails = false;
  showDetails() {
    this.expandDetails = true;
    this.overflowDetails = true;
  }
  hideDetails() {
    this.expandDetails = false;
    setTimeout(() => {
      this.overflowDetails = false;
    }, 300);
  }

  // Floorplan
  public expandFloorplan = false;
  public overflowFloorplan = false;
  showFloorplan() {
    this.expandFloorplan = true;
    this.overflowFloorplan = true;
  }
  hideFloorplan() {
    this.expandFloorplan = false;
    setTimeout(() => {
      this.overflowFloorplan = false;
    }, 300);
  }

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (!this.id) {
      this.router.navigate(['/home']);
    }

    const t = window.location.href.split('/').pop();
    if (t === 'details') {
      this.tab = Tab.Details;
    } else {
      this.tab = Tab.Dashboard;
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

  showHelpModal() {
    const modal = document.querySelector('#help-modal');

    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  help_press() {
    this.pressButton('#help-link');
    
    setTimeout(() => {
      this.showHelpModal();
    }, 100);
  }
}