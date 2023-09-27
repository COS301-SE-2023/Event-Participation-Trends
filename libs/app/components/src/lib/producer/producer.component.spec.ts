import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProducerComponent } from './producer.component';

describe('ProducerComponent', () => {
  let component: ProducerComponent;
  let fixture: ComponentFixture<ProducerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProducerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
