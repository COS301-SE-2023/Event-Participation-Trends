import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from '../src/controllers/user.controller';
import { EventController } from '../src/controllers/event.controller';
import { GlobalController } from '../src/controllers/global.controller';
import {
  EventService,
  EventModule,
} from '@event-participation-trends/api/event/feature';
import {
    UserModule,
    UserService,
  } from '@event-participation-trends/api/user/feature';
import {
    GlobalModule,
    GlobalService,
  } from '@event-participation-trends/api/global/feature';
import { JwtModule } from '@nestjs/jwt';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { SensorlinkingModule } from '@event-participation-trends/sensorlinking';

@Module({
    imports: [CqrsModule, UserModule, EventModule, GlobalModule, JwtModule, ApiGuardsModule, SensorlinkingModule],
    controllers: [UserController, EventController, GlobalController],
    providers: [UserService, EventService, GlobalService],
    exports: [UserService ,EventService, GlobalService],
})
export class CoreModule {}
