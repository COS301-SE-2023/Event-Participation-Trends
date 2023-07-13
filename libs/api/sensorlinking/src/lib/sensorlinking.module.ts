import { Module } from '@nestjs/common';
import { SensorlinkingController } from './sensorlinking.controller';
import {
  UserService,
  UserModule,
} from '@event-participation-trends/api/user/feature';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from '@event-participation-trends/api/event/feature';
import { EventModule } from '@event-participation-trends/api/event/data-access';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { SensorlinkingService } from './sensorlinking.service';
import {
  GlobalModule,
  GlobalService,
} from '@event-participation-trends/api/global/feature';

@Module({
  imports: [
    UserModule,
    EventModule,
    CqrsModule,
    ApiGuardsModule,
    ScheduleModule.forRoot(),
    GlobalModule,
  ],
  controllers: [SensorlinkingController],
  providers: [
    UserService,
    EventService,
    JwtService,
    SensorlinkingService,
    GlobalService,
  ],
  exports: [],
})
export class SensorlinkingModule {}
