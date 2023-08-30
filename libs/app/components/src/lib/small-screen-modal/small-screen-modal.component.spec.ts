import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallScreenModalComponent } from './small-screen-modal.component';

describe('SmallScreenModalComponent', () => {
  let component: SmallScreenModalComponent;
  let fixture: ComponentFixture<SmallScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallScreenModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
