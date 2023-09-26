import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeHelpComponent } from './home-help.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeHelpComponent', () => {
  let component: HomeHelpComponent;
  let fixture: ComponentFixture<HomeHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHelpComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
