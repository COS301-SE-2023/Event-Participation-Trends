import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastModalComponent } from './toast-modal.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { matClose } from '@ng-icons/material-icons/baseline';

describe('ToastModalComponent', () => {
  let component: ToastModalComponent;
  let fixture: ComponentFixture<ToastModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastModalComponent, NgIconsModule, HttpClientTestingModule],
      providers: [
        provideIcons({matClose})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should emit 'true' when 'closeModal()' is called`, () => {
    const spy = jest.spyOn(component.closeModalEvent, 'emit');

    component.closeModal();

    expect(spy).toHaveBeenCalledWith(true);
  });
});
