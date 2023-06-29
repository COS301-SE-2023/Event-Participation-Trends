import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SubPageNavState } from './subpagenav.state';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxsModule.forFeature([SubPageNavState])
  ]
})
export class SubpagenavModule { }
