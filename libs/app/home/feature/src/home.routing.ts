import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {    
    path: '',
    component: HomePage,
    children: [
      {
        path: 'user-management',
        loadChildren: () => import('@event-participation-trends/app/user-management/feature').then(m => m.UserManagementModule)
      },
      {
        path: 'view-events',
        loadChildren: () => import('@event-participation-trends/app/view-events/feature').then(m => m.ViewEventsModule)
      },
      {
        path: 'compare-events',
        loadChildren: () => import('@event-participation-trends/app/compare-events/feature').then(m => m.CompareEventsModule)
      },
      {
        path: 'manager-events',
        loadChildren: () => import('@event-participation-trends/app/manager-events/feature').then(m => m.ManagerEventsModule)
      }
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home', //this is only temporary
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
