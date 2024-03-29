import { GlobalModule as GlobalDataAccessModule} from '@event-participation-trends/api/global/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GlobalService } from './global.service';

import {
    CreateGlobalHandler,
} from './commands';

import { 
    GetGlobalHandler,
} from './queries';

import {
    CreateGlobalEventHandler,
} from './events';

export const CommandHandlers = [
    CreateGlobalHandler,
];

export const QueryHandlers = [
    GetGlobalHandler,
];

export const EventHandlers = [
    CreateGlobalEventHandler,
];

@Module({
    imports: [CqrsModule, GlobalDataAccessModule],
    providers: [GlobalService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [GlobalService],
})
export class GlobalModule {}