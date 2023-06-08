import { UserModule as UserDataAccessModule } from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserService } from './user.service';

import {
    CreateUserHandler,
} from './commands';
import {
    GetUsersHandler,
} from './queries';
import {
    CreateUserEventHandler,
} from './events';

export const CommandHandlers = [
    CreateUserHandler,
]

export const QueryHandlers = [
    GetUsersHandler,
]

export const EventHandlers = [
    CreateUserEventHandler,
];


@Module({
    imports: [CqrsModule, UserDataAccessModule],
    providers: [UserService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [UserService],
})
export class UserModule {}