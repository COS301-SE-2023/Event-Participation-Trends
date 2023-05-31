import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VieweventsPage } from './viewevents.page';

describe('VieweventsPage', () => {
  let component: VieweventsPage;
  let fixture: ComponentFixture<VieweventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VieweventsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(VieweventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
