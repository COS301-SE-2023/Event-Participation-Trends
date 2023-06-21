import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ViewEventModalComponent } from './vieweventmodal.component';
import { VieweventmodalRoutingModule } from './vieweventmodal.routing';

@NgModule({
  declarations: [ViewEventModalComponent],
  imports: [
    CommonModule,
    IonicModule,
    VieweventmodalRoutingModule
  ]
})
export class VieweventmodalModule { }
