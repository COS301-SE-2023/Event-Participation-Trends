import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloorplanEditorPageComponent } from './floorplan-editor-page.component';

describe('FloorplanEditorPageComponent', () => {
  let component: FloorplanEditorPageComponent;
  let fixture: ComponentFixture<FloorplanEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorplanEditorPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorplanEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
