import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { NgIconsModule } from '@ng-icons/core';
import { heroHome } from '@ng-icons/heroicons/outline';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [CommonModule, NgIconsModule.withIcons({heroHome}), RouterLink],
  declarations: [LandingComponent],
  exports: [LandingComponent],
})
export class AppLandingModule {}
