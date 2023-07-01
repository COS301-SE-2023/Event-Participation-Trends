import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VieweventsPage } from './viewevents.page';
import { NgxsModule } from '@ngxs/store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VieweventsPage', () => {
  let component: VieweventsPage;
  let fixture: ComponentFixture<VieweventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VieweventsPage],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [AppApiService, ModalController, AngularDelegate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VieweventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
