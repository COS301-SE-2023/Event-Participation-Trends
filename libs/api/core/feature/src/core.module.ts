import {
  UserModule,
  UserService,
} from '@event-participation-trends/api/user/feature';
import { UserController } from '../src/controllers/user.controller';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventController } from '../src/controllers/event.controller';
import {
  EventService,
  EventModule,
} from '@event-participation-trends/api/event/feature';
import { JwtModule } from '@nestjs/jwt';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { SensorlinkingModule } from '@event-participation-trends/sensorlinking';

@Module({
    imports: [CqrsModule, UserModule, EventModule, JwtModule, ApiGuardsModule, SensorlinkingModule],
    controllers: [UserController, EventController],
    providers: [UserService, EventService],
    exports: [UserService ,EventService],
})
export class CoreModule {}
