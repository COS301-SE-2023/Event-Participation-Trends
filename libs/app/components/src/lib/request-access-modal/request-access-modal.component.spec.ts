import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RequestAccessModalComponent } from './request-access-modal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RequestAccessModalComponent', () => {
  let component: RequestAccessModalComponent;
  let fixture: ComponentFixture<RequestAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestAccessModalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the event id', () => {
    component.setEventId('test');
    expect(component.event_id).toEqual('test');
  });

  it('should get the button name', () => {
    component.setEventId('test');
    expect(component.getButtonName()).toEqual('request-access-test');
  });

  it('should add "hover:scale-90" class to target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    document.body.appendChild(target);

    component.pressButton('#test');

    expect(target.classList.contains('hover:scale-90')).toBeTruthy();
  });

  it('should remove "hover:scale-90" class from target', () => {
    const target = document.createElement('div');
    target.id = 'test';
    target.classList.add('hover:scale-90');
    document.body.appendChild(target);

    component.pressButton('#test');

    setTimeout(() => {
      expect(target.classList.contains('hover:scale-90')).toBeFalsy();
    }, 1000);
  });

  it('should get the request modal id', () => {
    const event = { _id: 'test' };
    expect(component.getRequestModalId(event)).toEqual('request-modal-test');
  });

  it('should close modal', () => {
    const modal = document.createElement('div');
    modal.id = 'profile-modal';
    modal.classList.add('opacity-0');
    modal.classList.add('hidden');
    document.body.appendChild(modal);

    component.closeModal();

    expect(modal.classList.contains('opacity-0')).toBeTruthy();
    expect(modal.classList.contains('hidden')).toBeTruthy();
  });


});
