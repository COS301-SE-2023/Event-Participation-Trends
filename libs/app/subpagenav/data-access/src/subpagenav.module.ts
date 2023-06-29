import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SubPageNavState } from './subpagenav.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([SubPageNavState])],
})
export class SubPageNavModule {}
