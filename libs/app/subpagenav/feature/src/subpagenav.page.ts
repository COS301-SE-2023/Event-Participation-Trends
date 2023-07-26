import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Role } from '@event-participation-trends/api/user/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, NavController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { SubPageNavState } from '@event-participation-trends/app/subpagenav/data-access';
import { Observable } from 'rxjs';
import { SetSubPageNav } from '@event-participation-trends/app/subpagenav/util';
import { ProfileComponent } from '@event-participation-trends/app/profile/feature';

@Component({
  selector: 'subpagenav',
  templateUrl: './subpagenav.page.html',
  styleUrls: ['./subpagenav.page.css'],
})
export class SubPageNavPage implements OnInit{
  @Select(SubPageNavState.currentPage) currentPage$!: Observable<string | null>;
  @Select(SubPageNavState.prevPage) prevPage$!: Observable<string | null>;
  currentPage!: string;
  prevPage = '/home';
  public role = Role.VIEWER;  
  public appApiService: AppApiService;
  selected = 'Dashboard';
  detailsSelected = false;
  dashboardSelected = false;
  showTabs = false;
  params: {
    m: string,
    id: string,
    queryParamsHandling: string
  } | null = null;
  
  public open = false;
  public username = '';
  public fullName = '';
  public profilePicUrl = '';
  public email = '';
  public faultyImage = false;

  constructor(
    appApiService: AppApiService, 
    private readonly route: ActivatedRoute, 
    private router: Router, 
    private navController: NavController, 
    private readonly store: Store,
    private readonly modalController: ModalController,
    ) {
    this.appApiService = appApiService;

    this.appApiService.getRole().subscribe((response)=>{
      this.role = (response.userRole as Role) || Role.VIEWER;
    });

    this.route.queryParams.subscribe((params) => {
      this.showTabs = params['m'] === 'true';
    });

    this.params = {
      m: this.route.snapshot.queryParams['m'],
      id: this.route.snapshot.queryParams['id'],
      queryParamsHandling: this.route.snapshot.queryParams['queryParamsHandling']
    };

    this.appApiService.getUserName().subscribe((response)=>{
      this.username = response.username || '';
    });    
    this.appApiService.getProfilePicUrl().subscribe((response)=>{
      this.profilePicUrl = response.url || '';
      if (this.profilePicUrl === '') {
        this.faultyImage = true;
      }
    });

    const url = this.router.url;
    if (url.includes('eventdetails')) {
      this.selected = 'Event Details';
      this.detailsSelected = true;
      this.dashboardSelected = false;
    }
    else if (url.includes('dashboard')) {
      this.selected = 'Dashboard';
      this.detailsSelected = false;
      this.dashboardSelected = true;
    }
  }

  getRole(): Role {
    return this.role;
  }

  selectTab(option: string) {
    this.selected = option;

    if (option === 'Event Details') {
      this.detailsSelected = true;
      this.dashboardSelected = false;
      // forward params to event details page
      this.navController.navigateForward(['/event/eventdetails'], { queryParams: this.params});
      this.currentPage = '/event/eventdetails';
      this.prevPage = '/home';
      this.store.dispatch(new SetSubPageNav(this.currentPage, this.prevPage));
    }
    else if (option === 'Dashboard') {
      this.detailsSelected = false;
      this.dashboardSelected = true;
      // forward params to event details page
      this.navController.navigateForward(['/event/dashboard'], { queryParams: this.params});
      this.currentPage = '/event/dashboard';
      this.prevPage = '/home';
      this.store.dispatch(new SetSubPageNav(this.currentPage, this.prevPage));
    }
  }

  isLargeScreen = false;

  ngOnInit() {
    this.checkScreenSize();

    // get path from router
    this.router.events.subscribe((val) => {
      this.currentPage = this.router.url.split('?')[0];

      //check if url contains 'm=true'
      if (this.router.url.includes('m=')) {
        this.prevPage = this.currentPage === '/event/createfloorplan' ? '/event/eventdetails' : '/home';
      }
      else {
        this.prevPage = this.currentPage === '/event/createfloorplan' ? '/event/addevent' : '/home';
      }
        
        this.store.dispatch(new SetSubPageNav(this.currentPage, this.prevPage));
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1310;
  }

  getPrevPage() {
    this.prevPage$.subscribe((prevPage) => {
      this.prevPage = prevPage || '/home';
    });
    return this.prevPage;
  }

  goBack() {
    // navigate back preserving the query params
    const queryParams : NavigationExtras = {
      queryParams: {
        m: this.currentPage === '/event/createfloorplan' && this.prevPage === '/event/eventdetails' ? 'true' : 'false',
        id: this.params?.id,
        queryParamsHandling: 'merge',
      },
    };  
    this.navController.navigateBack(this.prevPage, queryParams);
  }

  async openProfile(event: any) {
    const modal = await this.modalController.create({
      component: ProfileComponent,
      componentProps: {
        event: event,
      },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}
