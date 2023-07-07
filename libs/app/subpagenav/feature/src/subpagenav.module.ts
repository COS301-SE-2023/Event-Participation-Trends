import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubPageNavPage } from './subpagenav.page';
import { IonicModule } from '@ionic/angular';
import { SubPageNavRoutingModule } from './subpagenav.routing';
import { SubPageNavModule as SubPageNavDataAccessModule } from '@event-participation-trends/app/subpagenav/data-access';
@NgModule({
  declarations: [SubPageNavPage],
  imports: [
    CommonModule,
    IonicModule,
    SubPageNavRoutingModule,
    SubPageNavDataAccessModule
  ]
})
export class SubPageNavModule { }
