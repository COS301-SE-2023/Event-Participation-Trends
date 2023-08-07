import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparePageComponent } from './compare-page.component';

describe('ComparePageComponent', () => {
  let component: ComparePageComponent;
  let fixture: ComponentFixture<ComparePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
