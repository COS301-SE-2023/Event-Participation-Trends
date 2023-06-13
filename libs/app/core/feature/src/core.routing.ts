import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    canActivate: [],
    data: {},
    loadChildren: () =>
      import('@event-participation-trends/app/login/feature').then((m) => m.LoginModule),
  },
  {
    path: 'home',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/home/feature').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/dashboard/feature').then((m) => m.DashboardModule),
  },
  {
    path: 'eventdetails',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/eventdetails/feature').then((m) => m.EventDetailsModule),
  },
  {
    path: 'flooreditor',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/flooreditor/feature').then((m) => m.FloorEditorModule),
  },
  {
    path: 'createfloorplan',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/createfloorplan/feature').then((m) => m.CreateFloorPlanModule),
  },
  {
    path: 'addevent',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/addevent/feature').then((m) => m.AddEventModule),
  },
  {
    path: 'eventscreenview',
    canActivate: [],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/eventscreenview/feature').then((m) => m.EventScreenViewModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
