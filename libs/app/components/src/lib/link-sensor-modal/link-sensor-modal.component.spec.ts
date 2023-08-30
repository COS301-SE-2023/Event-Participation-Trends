import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkSensorModalComponent } from './link-sensor-modal.component';

describe('LinkSensorModalComponent', () => {
  let component: LinkSensorModalComponent;
  let fixture: ComponentFixture<LinkSensorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkSensorModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkSensorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
