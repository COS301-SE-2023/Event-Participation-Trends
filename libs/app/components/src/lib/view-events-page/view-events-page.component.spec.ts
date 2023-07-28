import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewEventsPageComponent } from './view-events-page.component';

describe('ViewEventsPageComponent', () => {
  let component: ViewEventsPageComponent;
  let fixture: ComponentFixture<ViewEventsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEventsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewEventsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
