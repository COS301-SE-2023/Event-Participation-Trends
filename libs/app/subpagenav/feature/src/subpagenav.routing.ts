import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubPageNavPage } from './subpagenav.page';

const routes: Routes = [
  {
    path: '',
    component: SubPageNavPage,
    children: [
      {
        path: 'eventdetails',
        loadChildren: () =>
          import('@event-participation-trends/app/eventdetails/feature').then(
            (m) => m.EventDetailsModule
          ),
        data: { queryParamName: 'id'}
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@event-participation-trends/app/eventscreenview/feature').then(
            (m) => m.EventScreenViewModule
          ),
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
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/event/dashboard', //this is only temporary
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/event/dashboard', //this is only temporary
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubPageNavRoutingModule {}
