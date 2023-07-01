import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventScreenViewPage } from './eventscreenview.page';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate, AlertController } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';

describe('EventScreenViewPage', () => {
  let component: EventScreenViewPage;
  let fixture: ComponentFixture<EventScreenViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventScreenViewPage],
      imports: [NgxsModule.forRoot([]), HttpClientModule],
      providers: [ModalController, AngularDelegate, Store, AppApiService, AlertController],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventScreenViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
