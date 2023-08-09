import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { heroUserGroup } from "@ng-icons/heroicons/outline";
import { DashboardPageComponent } from "./dashboard-page.component";

@NgModule({
    bootstrap: [DashboardPageComponent],
    imports: [
        CommonModule, 
        NgIconsModule.withIcons({heroUserGroup})
    ],
    declarations: [DashboardPageComponent]
})
export class DashboardPageModule {}