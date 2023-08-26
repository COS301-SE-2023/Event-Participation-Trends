import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgIconsModule } from "@ng-icons/core";
import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";
import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown } from "@ng-icons/material-icons/baseline";
import { matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { FloorplanEditorPageComponent } from "./floorplan-editor-page.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
    bootstrap: [FloorplanEditorPageComponent],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        NgIconsModule.withIcons({heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matFilterCenterFocus, matZoomIn, matZoomOut})
    ],
    declarations: [FloorplanEditorPageComponent]
})
export class FloorplanEditorPageModule {}