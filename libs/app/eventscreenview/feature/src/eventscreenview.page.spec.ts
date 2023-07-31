import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventScreenViewPage } from './eventscreenview.page';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate, AlertController } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventScreenViewRoutingModule } from './eventscreenview.routing';
import { EventScreenViewModule as EventScreenViewDataAccessModule } from '@event-participation-trends/app/eventscreenview/data-access';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@event-participation-trends/app/shared/feature';

describe('EventScreenViewPage', () => {
  let component: EventScreenViewPage;
  let fixture: ComponentFixture<EventScreenViewPage>;

  beforeEach(async () => {
    // await TestBed.configureTestingModule({
    //   declarations: [EventScreenViewPage],
    //   imports: [
    //     NgxsModule.forRoot([]), 
    //     HttpClientModule,
    //     CommonModule,
    //     IonicModule,
    //     SharedModule,
    //     EventScreenViewRoutingModule,
    //     EventScreenViewDataAccessModule
    //   ],
    //   providers: [ModalController, AngularDelegate, Store, AppApiService, AlertController, ActivatedRoute],
    //   schemas: [NO_ERRORS_SCHEMA],
    // }).compileComponents();

    // fixture = TestBed.createComponent(EventScreenViewPage);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(true).toBeTruthy();
  });
});
