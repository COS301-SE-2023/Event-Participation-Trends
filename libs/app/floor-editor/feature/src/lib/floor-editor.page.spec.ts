import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloorEditorPage } from './floor-editor.page';

describe('FloorEditorPage', () => {
  let component: FloorEditorPage;
  let fixture: ComponentFixture<FloorEditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorEditorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorEditorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
