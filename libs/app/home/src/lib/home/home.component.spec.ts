import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeHelpComponent, ProfileComponent } from '@event-participation-trends/app/components';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import {
  heroArrowLeft,
  heroChartBar,
  heroPencil,
  heroArrowsRightLeft,
} from '@ng-icons/heroicons/outline';
import {
  matFormatListBulletedRound,
  matBarChartRound,
  matDrawRound,
  matQuestionMarkRound,
  matGroupRound,
  matEventRound,
  matCompareArrowsRound,
} from '@ng-icons/material-icons/round';

import {
  matMenu,
  matClose
} from '@ng-icons/material-icons/baseline';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, ProfileComponent, HomeHelpComponent, NgIconsModule],
      providers: [
        provideIcons({
          heroArrowLeft,
          heroChartBar,
          heroPencil,
          matFormatListBulletedRound,
          matBarChartRound,
          matDrawRound,
          matQuestionMarkRound,
          matGroupRound,
          matEventRound,
          matCompareArrowsRound,
          heroArrowsRightLeft,
          matMenu,
          matClose
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
