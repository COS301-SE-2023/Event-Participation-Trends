import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { LoginState } from './login.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([LoginState])],
})
export class LoginModule {}