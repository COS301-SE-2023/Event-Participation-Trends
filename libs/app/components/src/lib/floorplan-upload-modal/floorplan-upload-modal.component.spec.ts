import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FloorplanUploadModalComponent } from './floorplan-upload-modal.component';
import { NgIconsModule, provideIcons } from '@ng-icons/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { matClose } from '@ng-icons/material-icons/baseline';
import Konva from 'konva';

describe('FloorplanUploadModalComponent', () => {
  let component: FloorplanUploadModalComponent;
  let fixture: ComponentFixture<FloorplanUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloorplanUploadModalComponent, NgIconsModule, HttpClientTestingModule],
      providers: [
        provideIcons({matClose})
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FloorplanUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
