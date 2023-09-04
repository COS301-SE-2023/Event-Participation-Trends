import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloorplanUploadModalComponent } from './floorplan-upload-modal.component';

describe('FloorplanUploadModalComponent', () => {
  let component: FloorplanUploadModalComponent;
  let fixture: ComponentFixture<FloorplanUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorplanUploadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorplanUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
