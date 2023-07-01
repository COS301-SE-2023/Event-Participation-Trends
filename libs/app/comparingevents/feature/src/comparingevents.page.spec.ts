import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparingeventsPage } from './comparingevents.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ComparingeventsPage', () => {
  let component: ComparingeventsPage;
  let fixture: ComponentFixture<ComparingeventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComparingeventsPage],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [AppApiService, ModalController, AngularDelegate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparingeventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
