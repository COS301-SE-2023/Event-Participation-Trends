import { UserModule as UserDataAccessModule } from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';

import {
    CreateUserHandler, 
    UpdateUserRoleHandler,
} from './commands';
import {
    GetUsersHandler,
    GetUserRoleHandler
} from './queries';
import {
    CreateUserEventHandler, 
    UpdateUserRoleEventHandler,
} from './events';

export const CommandHandlers = [
    CreateUserHandler,
    UpdateUserRoleHandler,
]

export const QueryHandlers = [
    GetUsersHandler,
    GetUserRoleHandler,
]

export const EventHandlers = [
    CreateUserEventHandler,
    UpdateUserRoleEventHandler,
];


@Module({
    imports: [CqrsModule, UserDataAccessModule],
    providers: [UserService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [UserService],
})
export class UserModule {}