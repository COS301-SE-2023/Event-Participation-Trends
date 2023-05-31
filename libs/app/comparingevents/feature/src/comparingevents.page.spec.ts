import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparingeventsPage } from './comparingevents.page';

describe('ComparingeventsPage', () => {
  let component: ComparingeventsPage;
  let fixture: ComponentFixture<ComparingeventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparingeventsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparingeventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
