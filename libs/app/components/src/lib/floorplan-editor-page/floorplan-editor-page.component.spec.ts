import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FloorplanEditorPageComponent } from './floorplan-editor-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppApiService } from '@event-participation-trends/app/api';

import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";
import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matRadioButtonUnchecked, matCheckCircleOutline } from "@ng-icons/material-icons/baseline";
import { matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Status } from '@event-participation-trends/api/user/util';
import { ActivatedRoute, Router } from '@angular/router';
import Konva from 'konva';

describe('FloorplanEditorPageComponent', () => {
  let component: FloorplanEditorPageComponent;
  let fixture: ComponentFixture<FloorplanEditorPageComponent>;
  let appApiService: AppApiService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorplanEditorPageComponent, NgIconsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        AppApiService,
        provideIcons({matCheckCircleOutline, matRadioButtonUnchecked, heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matFilterCenterFocus, matZoomIn, matZoomOut})
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FloorplanEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

//   it('should navigate to /home if ID is null', () => {
//     jest.spyOn(router, 'navigate');
//     component.id = '';
//     component.ngOnInit();
//     expect(router.navigate).toHaveBeenCalledWith(['/home']);
//   });

//   it('should call appApiService methods and navigate on successful save', waitForAsync(async () => {
//     jest.spyOn(router, 'navigate');
//     if (!Konva) return;
//     component.canvas = new Konva.Layer();

//     // Create and add some Konva shapes (e.g., Rectangles) to the Stage
//     const rect1 = new Konva.Rect({
//         x: 100,
//         y: 200,
//         width: 50,
//         height: 100,
//         fill: 'blue',
//         name: 'wall',
//     });

//     const rect2 = new Konva.Rect({
//         x: 200,
//         y: 300,
//         width: 80,
//         height: 60,
//         fill: 'red',
//         name: 'stall',
//     });

//     // Add the shapes to the Stage
//     component.canvas.add(rect1, rect2);

//     // Mock appApiService methods using spyOn and returnValue
//     jest.spyOn(appApiService, 'getEmail').mockResolvedValue('email');
//     jest.spyOn(appApiService, 'updateFloorplanImages').mockResolvedValue(Status.SUCCESS);
//     jest.spyOn(appApiService, 'addNewFloorplanImages').mockResolvedValue(Status.SUCCESS);
//     jest.spyOn(appApiService, 'updateFloorLayout').mockResolvedValue(Status.SUCCESS);

//     // Mock your data and dependencies
//     component.eventId = 'testEventId';
//     component.uploadedImages = [{ id: '1', type: 'image', scale: 1, base64: 'base64' }];

//     await component.saveFloorLayout();

//     expect(appApiService.getEmail).toHaveBeenCalled();
//     expect(appApiService.updateFloorplanImages).toHaveBeenCalled();
//     expect(appApiService.addNewFloorplanImages).toHaveBeenCalled();
//     expect(appApiService.updateFloorLayout).toHaveBeenCalled();
//     expect(router.navigate).toHaveBeenCalledWith(['details'], { relativeTo: route.parent });
//     // Add more expectations as needed
//   }));
});
