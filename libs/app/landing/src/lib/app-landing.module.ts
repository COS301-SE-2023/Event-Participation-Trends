import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';

@NgModule({
  imports: [CommonModule, NgIconsModule.withIcons({heroHome})],
  declarations: [LandingComponent],
  exports: [LandingComponent],
})
export class AppLandingModule {}
