import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventHelpComponent } from './event-help.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EventHelpComponent', () => {
  let component: EventHelpComponent;
  let fixture: ComponentFixture<EventHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventHelpComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
