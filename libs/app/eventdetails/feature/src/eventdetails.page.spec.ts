import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsPage } from './eventdetails.page';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate, AlertController } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventDetailsPage', () => {
  let component: EventDetailsPage;
  let fixture: ComponentFixture<EventDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EventDetailsPage],
      imports: [NgxsModule.forRoot([]), HttpClientModule, RouterTestingModule],
      providers: [ModalController, AngularDelegate, Store, AppApiService, AlertController],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
