import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { ComparePageComponent } from "./compare-page.component";
import { matCheckCircleOutline } from "@ng-icons/material-icons/outline";
import { matRadioButtonUnchecked, matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroAdjustmentsHorizontal } from "@ng-icons/heroicons/outline";
import { FormsModule } from "@angular/forms";

@NgModule({
    bootstrap: [ComparePageComponent],
    imports: [
        CommonModule, 
        FormsModule,
        NgIconsModule.withIcons({matCheckCircleOutline, matRadioButtonUnchecked, heroAdjustmentsHorizontal, matSearch, matFilterCenterFocus, matZoomIn, matZoomOut})
    ],
    declarations: [ComparePageComponent]
})
export class ComparePageModule {}