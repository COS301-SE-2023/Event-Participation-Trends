import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventModalComponent } from './vieweventmodal.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate, AlertController } from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';

describe('ViewEventModalComponent', () => {
  let component: ViewEventModalComponent;
  let fixture: ComponentFixture<ViewEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEventModalComponent],
      imports: [NgxsModule.forRoot([]), HttpClientModule],
      providers: [ModalController, AngularDelegate, Store, AppApiService, AlertController],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
