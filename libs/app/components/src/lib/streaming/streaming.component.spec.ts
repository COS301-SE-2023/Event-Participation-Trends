import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamingComponent } from './streaming.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { matSend, matChat, matClose, matArrowLeft, matArrowRight } from '@ng-icons/material-icons/baseline';
import { heroVideoCameraSlashSolid } from '@ng-icons/heroicons/solid';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('StreamingComponent', () => {
  let component: StreamingComponent;
  let fixture: ComponentFixture<StreamingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamingComponent, NgIconsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideIcons({matSend, matChat, matClose, heroVideoCameraSlashSolid, matArrowLeft, matArrowRight}),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
