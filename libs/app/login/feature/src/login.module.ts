import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login.routing';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';

@NgModule({
  declarations: [LoginPage],
  imports: [
    CommonModule,
    IonicModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
