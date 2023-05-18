import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core.routing';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { CoreShell } from './core.shell';

@NgModule({
  declarations: [CoreShell],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    CoreRoutingModule
  ],
  bootstrap: [CoreShell]
})
export class CoreModule { }
