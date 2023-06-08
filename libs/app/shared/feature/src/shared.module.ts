import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SubPageNavPage } from './subpagenav/subpagenav.page';
// import { AccessRequestsModule } from '@event-participation-trends/app/accessrequests/feature';

@NgModule({
    declarations: [SubPageNavPage],
    imports: [
        CommonModule,
        IonicModule,
        // AccessRequestsModule
    ],
    exports: [SubPageNavPage]
})
export class SharedModule { }