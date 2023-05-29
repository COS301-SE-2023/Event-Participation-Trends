import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { 
  AuthGuard,
} from '@nestjs/passport';

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
    canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/home/feature').then((m) => m.HomeModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    // data: { authGuardPipe: redirectLoggedOut },
    loadChildren: () =>
      import('@event-participation-trends/app/dashboard/feature').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
