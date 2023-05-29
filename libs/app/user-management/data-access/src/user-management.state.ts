import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the user management page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserManagementStateModel {}

@State<UserManagementStateModel>({
    name: 'user-management'
})

@Injectable()
export class UserManagementState {}