import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageComponent } from './dashboard-page.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown } from "@ng-icons/material-icons/baseline";
import { matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { heroUserGroupSolid } from "@ng-icons/heroicons/solid";
import { heroBackward } from "@ng-icons/heroicons/outline";

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, NgIconsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideIcons({heroUserGroupSolid, heroBackward, matKeyboardDoubleArrowUp, matKeyboardDoubleArrowDown, matFilterCenterFocus, matZoomIn, matZoomOut})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the heatmap', () => {
    expect(component.showHeatmap).toBe(false);
    component.toggleHeatmap();
    expect(component.showHeatmap).toBe(true);
  });

  it('should navigate to /home if ID is null', () => {
    jest.spyOn(router, 'navigate');
    component.id = '';
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
