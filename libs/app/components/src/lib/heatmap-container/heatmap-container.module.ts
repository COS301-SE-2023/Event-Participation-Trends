import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { HeatmapContainerComponent } from "./heatmap-container.component";
import { matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [HeatmapContainerComponent],
    bootstrap: [HeatmapContainerComponent],
    imports: [
        CommonModule, 
        FormsModule,
        NgIconsModule.withIcons({matSearch, matFilterCenterFocus, matZoomIn, matZoomOut}),
    ],
    exports: [HeatmapContainerComponent]
})
export class HeatmapContainerComponentModule {}