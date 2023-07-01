import { UserModule as UserDataAccessModule } from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';

import {
    CreateUserHandler, 
    UpdateUserRoleHandler,
    AddViewingEventHandler,
} from './commands';
import {
    GetUsersHandler,
    GetUserRoleHandler
} from './queries';
import {
    CreateUserEventHandler, 
    UpdateUserRoleEventHandler,
    AddViewingEventEventHandler,
} from './events';

export const CommandHandlers = [
    CreateUserHandler,
    UpdateUserRoleHandler,
    AddViewingEventHandler,
]

export const QueryHandlers = [
    GetUsersHandler,
    GetUserRoleHandler,
]

export const EventHandlers = [
    CreateUserEventHandler,
    UpdateUserRoleEventHandler,
    AddViewingEventEventHandler,
];


@Module({
    imports: [CqrsModule, UserDataAccessModule],
    providers: [UserService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [UserService],
})
export class UserModule {}