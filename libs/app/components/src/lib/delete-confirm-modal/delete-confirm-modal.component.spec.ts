import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteConfirmModalComponent } from './delete-confirm-modal.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppApiService } from '@event-participation-trends/app/api';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Status } from '@event-participation-trends/api/user/util';

describe('DeleteConfirmModalComponent', () => {
  let component: DeleteConfirmModalComponent;
  let fixture: ComponentFixture<DeleteConfirmModalComponent>;
  let appApiService: AppApiService;
  let router: Router;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmModalComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        AppApiService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
    router = TestBed.inject(Router);
    // Inject the http service and test controller for each test
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
