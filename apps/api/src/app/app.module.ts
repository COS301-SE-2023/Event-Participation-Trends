import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttController } from './mqtt.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PassportController,
  PassportService,
  PassportModule as Wow,
} from '@event-participation-trends/api/passport';
import { CoreModule } from '@event-participation-trends/api/core/feature';
import { MqttService } from './mqtt.service';
import {
  UserService,
  UserModule,
} from '@event-participation-trends/api/user/feature';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from '@event-participation-trends/api/event/feature';
import { EventModule } from '@event-participation-trends/api/event/data-access';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { ConfigModule } from '@nestjs/config';

import {
  SensorlinkingModule,
  SensorlinkingService,
} from '@event-participation-trends/api/sensorlinking';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Wow,
    JwtModule.register({}),
    MongooseModule.forRoot(process.env['MONGO_ALTALS_CONNECTION_URL']),
    UserModule,
    EventModule,
    CqrsModule,
    CoreModule,
    ApiGuardsModule,
    SensorlinkingModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, PassportController],
  providers: [
    AppService,
    PassportService,
    UserService,
    EventService,
    SensorlinkingService,
  ],
})
export class AppModule {}
