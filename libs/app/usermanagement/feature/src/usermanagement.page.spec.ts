import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { UsermanagementPage } from './usermanagement.page';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import {
  ModalController,
  AngularDelegate,
  AlertController,
} from '@ionic/angular';
import { NgxsModule, Store } from '@ngxs/store';
import {
  IupdateRoleResponse,
  Status,
} from '@event-participation-trends/api/user/util';

describe('UsermanagementPage', () => {
  let component: UsermanagementPage;
  let fixture: ComponentFixture<UsermanagementPage>;
  let appApiService: AppApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsermanagementPage],
      imports: [NgxsModule.forRoot([]), HttpClientModule],
      providers: [
        ModalController,
        AngularDelegate,
        Store,
        AppApiService,
        AlertController,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsermanagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    appApiService = TestBed.inject(AppApiService);
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // UNIT TESTS
  it('should toggle role', async () => {
    // Create mock user
    const user = {
      Email: 'test@example.com',
      FirstName: 'Test',
      LastName: 'User',
      Role: 'viewer',
    };

    // Call toggleRole
    component.toggleRole(user);

    // Expect role to be changed to 'manager'
    expect(user.Role).toBe('manager');
  });

  // INTEGRATION TESTS
  it('should save the changes if oldUsers and users differ', fakeAsync(() => {
    // Create mock users
    const users = [
      { Email: 'test1@example.com', Role: 'manager' },
      { Email: 'test2@example.com', Role: 'manager' },
      { Email: 'test3@example.com', Role: 'viewer' },
    ];

    const oldUsers = [
      { Email: 'test1@example.com', Role: 'viewer' },
      { Email: 'test2@example.com', Role: 'manager' },
      { Email: 'test3@example.com', Role: 'viewer' },
    ];

    // Create mock response
    const mockResponse: IupdateRoleResponse = {
      status: Status.SUCCESS,
    };

    // Spy on appApiService.updateUserRole and return the mockResponse
    jest
      .spyOn(appApiService, 'updateUserRole')
      .mockResolvedValue(mockResponse.status);

    // Call Save Changes
    component.users = users;
    component.old_users = oldUsers;

    component.saveChanges();

    // Expect appApiService.updateUserRole to have been called 2 times
    expect(appApiService.updateUserRole).toHaveBeenCalledWith({
      update: {
        UserEmail: component.users[0].Email,
        UpdateRole: component.users[0].Role,
      },
    });

    //verify that the changes have been saved
    expect(component.old_users).toEqual(component.users);

    //verify changed is false
    expect(component.changed).toBe(false);    
  }));
});
