import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LinkEventComponent } from './link-event.component';

describe('LinkEventComponent', () => {
  let component: LinkEventComponent;
  let fixture: ComponentFixture<LinkEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
