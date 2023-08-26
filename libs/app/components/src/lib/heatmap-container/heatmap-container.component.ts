import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIconsModule, provideIcons } from '@ng-icons/core';

import { matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
@Component({
  selector: 'event-participation-trends-heatmap-container',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconsModule],
  templateUrl: './heatmap-container.component.html',
  styleUrls: ['./heatmap-container.component.css'],
  providers: [
    provideIcons({matSearch, matFilterCenterFocus, matZoomIn, matZoomOut}),
  ],
})
export class HeatmapContainerComponent {}
