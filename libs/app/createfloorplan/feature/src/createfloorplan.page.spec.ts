import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateFloorPlanPage } from './createfloorplan.page';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { NgxsModule } from '@ngxs/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CreateFloorPlanPage', () => {
  let component: CreateFloorPlanPage;
  let fixture: ComponentFixture<CreateFloorPlanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateFloorPlanPage],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule],
      providers: [AppApiService, ModalController, AngularDelegate],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFloorPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
