import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login.routing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
// import { LoginModule as LoginDataAccessModule } from '@event-participation-trends/app/login/data-access';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule,
    // LoginDataAccessModule
  ]
})
export class LoginModule { }
