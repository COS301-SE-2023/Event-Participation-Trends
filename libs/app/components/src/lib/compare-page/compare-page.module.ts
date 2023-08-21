import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { ComparePageComponent } from "./compare-page.component";
import { matCheckCircleOutline } from "@ng-icons/material-icons/outline";
import { matRadioButtonUnchecked } from "@ng-icons/material-icons/baseline";
import { FormsModule } from "@angular/forms";

@NgModule({
    bootstrap: [ComparePageComponent],
    imports: [
        CommonModule, 
        FormsModule,
        NgIconsModule.withIcons({matCheckCircleOutline, matRadioButtonUnchecked})
    ],
    declarations: [ComparePageComponent]
})
export class ComparePageModule {}