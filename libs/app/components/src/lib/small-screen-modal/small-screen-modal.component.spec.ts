import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallScreenModalComponent } from './small-screen-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';

describe('SmallScreenModalComponent', () => {
  let component: SmallScreenModalComponent;
  let fixture: ComponentFixture<SmallScreenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallScreenModalComponent, NgIconsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideIcons({matClose})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SmallScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
