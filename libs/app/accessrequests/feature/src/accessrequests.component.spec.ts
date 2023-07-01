import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessRequestsComponent } from './accessrequests.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AccessRequestsComponent', () => {
  let component: AccessRequestsComponent;
  let fixture: ComponentFixture<AccessRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccessRequestsComponent],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [AppApiService, ModalController, AngularDelegate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
