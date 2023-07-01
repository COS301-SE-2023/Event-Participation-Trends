import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestAccessModalComponent } from './requestaccessmodal.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [RequestAccessModalComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class RequestAccessModalModule { }
