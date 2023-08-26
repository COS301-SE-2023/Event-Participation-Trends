import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatmapContainerComponent } from './heatmap-container.component';

describe('HeatmapContainerComponent', () => {
  let component: HeatmapContainerComponent;
  let fixture: ComponentFixture<HeatmapContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatmapContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
