import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {    
    path: '',
    component: HomePage,
    children: [
      {
        path: 'usermanagement',
        loadChildren: () => import('@event-participation-trends/app/usermanagement/feature').then(m => m.UsermanagementModule)
      },
      {
        path: 'viewevents',
        loadChildren: () => import('@event-participation-trends/app/viewevents/feature').then(m => m.VieweventsModule)
      },
      {
        path: 'comparingevents',
        loadChildren: () => import('@event-participation-trends/app/comparingevents/feature').then(m => m.ComparingeventsModule)
      },
      {
        path: 'managerevents',
        loadChildren: () => import('@event-participation-trends/app/managerevents/feature').then(m => m.ManagerEventsModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/home/usermanagement', //this is only temporary
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home/usermanagement', //this is only temporary
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
