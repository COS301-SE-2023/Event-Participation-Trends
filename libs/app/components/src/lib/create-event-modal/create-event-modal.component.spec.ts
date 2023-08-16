import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateEventModalComponent } from './create-event-modal.component';

describe('CreateEventModalComponent', () => {
  let component: CreateEventModalComponent;
  let fixture: ComponentFixture<CreateEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
