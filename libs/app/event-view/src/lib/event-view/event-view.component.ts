import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('navBarContainer') navBarContainer!: ElementRef<HTMLDivElement>;

  constructor(
    private appApiService: AppApiService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  public id: string | null = '';
  public tab = Tab.None;
  public manager_access = false;
  public screenTooSmall = false;

  // Navbar
  public showMenuBar = false;
  public navBarVisible = false;
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
    this.screenTooSmall = window.innerWidth < 1152;

    
    if (!this.id) {
      this.ngZone.run(() => { this.router.navigate(['/home']); });
      return;
    }

    const role = await this.appApiService.getRole();

    // if id in get managed events then manager_access = true
    if (role === 'admin') {
      this.manager_access = true;
    } else if (role === 'manager') {

      const managed_events = await this.appApiService.getManagedEvents();
      for (const event of managed_events) {
        if ((event as any)._id === this.id) {
          this.manager_access = true;
          break;
        }
      }
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

    // test if window size is less than 1024px
    if (window.innerWidth < 1024) {
      this.showMenuBar = false;
    }
    else {
      this.showMenuBar = true;
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
    this.ngZone.run(() => { this.router.navigate(['/home']); });
  }

  goDetails() {
    this.screenTooSmall = window.innerWidth < 1152;
    this.pressButton('#details');
    this.tab = Tab.Details;

    // close navbar
    if (this.navBarVisible) {
      this.hideNavBar();
    }
  }

  goDashboard() {
    this.screenTooSmall = window.innerWidth < 1152;
    this.pressButton('#dashboard');
    this.tab = Tab.Dashboard;

    // close navbar
    if (this.navBarVisible) {
      this.hideNavBar();
    }
  }

  goFloorplan() {
    this.screenTooSmall = window.innerWidth < 1152;
    this.pressButton('#floorplan-link');

    if (this.screenTooSmall) {
      this.showSmallScreenModal();
      return;
    }
    this.ngZone.run(() => { this.router.navigate(['floorplan'], { relativeTo: this.route }); });
    this.tab = Tab.Floorplan;

    // close navbar
    if (this.navBarVisible) {
      this.hideNavBar();
    }
  }

  showSmallScreenModal() {
    const modal = document.querySelector('#small-screen-modal');
    modal?.classList.remove('hidden');
    setTimeout(() => {
      modal?.classList.remove('opacity-0');
    }, 100);
  }

  closeSmallScreenModal() {
    const modal = document.querySelector('#small-screen-modal');
    modal?.classList.add('opacity-0');
    setTimeout(() => {
      modal?.classList.add('hidden');
    }, 100);
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

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  // // test when the window size is less than 1024px
  // // test when the window size is greater than 1024px
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 1024) {
      this.showMenuBar = true;
      this.navBarVisible = false;
    } else {
      this.showMenuBar = false;
    } 
  }

  showNavBar() {
    
    const element = document.getElementById('navbar');
    if (element) {
      element.style.width = '390px';
    }
    this.navBarVisible = true;
  }

  hideNavBar() {
    this.navBarVisible = false;
    const element = document.getElementById('navbar');
    if (element) {
      element.style.width = '0px';
    }
  }
}
