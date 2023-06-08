import { NgModule } from '@angular/core';
import { CoreRoutingModule } from './core.routing';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CoreShell } from './core.shell';
import { RouteReuseStrategy } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { ErrorsState } from '@event-participation-trends/app/error/data-access';
// import { AuthState } from '@event-participation-trends/app/auth/data-access';
// import { AuthModule } from '@event-participation-trends/app/auth/feature';
import { ErrorModule } from '@event-participation-trends/app/error/feature';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { AccessRequestsState } from '@event-participation-trends/app/accessrequests/data-access';
import { AccessRequestsModule } from '@event-participation-trends/app/accessrequests/feature';
// import { SocialLoginModule } from 'angularx-social-login';
// import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';

@NgModule({
  declarations: [CoreShell],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    CoreRoutingModule,
    NgxsModule.forRoot([ErrorsState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    ErrorModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [CoreShell]
})
export class CoreModule { }
