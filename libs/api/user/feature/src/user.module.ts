import { UserModule as UserDataAccessModule } from '@event-participation-trends/api/user/data-access';
import { EventModule as EventDataAccessModule } from '@event-participation-trends/api/event/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';

import {
    CreateUserHandler, 
    UpdateUserRoleHandler,
    AddViewingEventHandler,
    AddViewingEventByNameHandler,
    AddEventToAdminHandler,
} from './commands';
import {
    GetUsersHandler,
    GetUserRoleHandler
} from './queries';
import {
    CreateUserEventHandler, 
    UpdateUserRoleEventHandler,
    AddViewingEventEventHandler,
    AddEventToAdminEventHandler,
} from './events';

export const CommandHandlers = [
    CreateUserHandler,
    UpdateUserRoleHandler,
    AddViewingEventHandler,
    AddViewingEventByNameHandler,
    AddEventToAdminHandler,
]

export const QueryHandlers = [
    GetUsersHandler,
    GetUserRoleHandler,
]

export const EventHandlers = [
    CreateUserEventHandler,
    UpdateUserRoleEventHandler,
    AddViewingEventEventHandler,
    AddEventToAdminEventHandler,
];


@Module({
    imports: [CqrsModule, UserDataAccessModule, EventDataAccessModule],
    providers: [UserService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [UserService],
})
export class UserModule {}