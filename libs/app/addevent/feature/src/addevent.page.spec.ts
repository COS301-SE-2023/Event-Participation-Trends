import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEventPage } from './addevent.page';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddEventPage', () => {
  let component: AddEventPage;
  let fixture: ComponentFixture<AddEventPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEventPage],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [AppApiService, ModalController, AngularDelegate],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
