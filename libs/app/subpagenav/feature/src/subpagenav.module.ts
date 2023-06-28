import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubPageNavPage } from './subpagenav.page';
import { IonicModule } from '@ionic/angular';
import { SubPageNavRoutingModule } from './subpagenav.routing';


@NgModule({
  declarations: [SubPageNavPage],
  imports: [
    CommonModule,
    IonicModule,
    SubPageNavRoutingModule
  ]
})
export class SubPageNavModule { }
