import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallScreenModalComponent } from './small-screen-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matClose } from '@ng-icons/material-icons/baseline';
import { Router } from '@angular/router';

describe('SmallScreenModalComponent', () => {
  let component: SmallScreenModalComponent;
  let fixture: ComponentFixture<SmallScreenModalComponent>;
  let router: Router;

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

    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit 'true' when 'closeModal()' is called`, () => {
    const spy = jest.spyOn(component.justCloseModal, 'emit');

    component.closeModal();

    expect(spy).toHaveBeenCalledWith(true);
  });

  it(`should navigate to '/home' when 'closeModal()' is called`, () => {
    component.id = '';
    const spy = jest.spyOn(router, 'navigate');

    component.closeModal();

    expect(spy).toHaveBeenCalledWith(['/home']);
  });

  it(`should navigate to '/event/:id/details' when 'closeModal()' is called`, () => {
    component.id = '123';
    const spy = jest.spyOn(router, 'navigateByUrl');

    component.closeModal();

    expect(spy).toHaveBeenCalledWith(`/event/${component.id}/details`);
  });
});
