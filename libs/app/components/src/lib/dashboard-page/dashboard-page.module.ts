import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";
import { DashboardPageComponent } from "./dashboard-page.component";
import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown } from "@ng-icons/material-icons/baseline";

@NgModule({
    bootstrap: [DashboardPageComponent],
    imports: [
        CommonModule, 
        NgIconsModule.withIcons({heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown})
    ],
    declarations: [DashboardPageComponent]
})
export class DashboardPageModule {}