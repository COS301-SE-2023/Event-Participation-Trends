import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttController } from './mqtt.controller';
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

import {
  SensorlinkingModule,
  SensorlinkingService,
} from '@event-participation-trends/api/sensorlinking';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiPositioningModule, PositioningService } from '@event-participation-trends/api/positioning';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    Wow,
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        },
      },
    ]),
    MongooseModule.forRoot(process.env['MONGO_ALTALS_CONNECTION_URL']),
    UserModule,
    EventModule,
    CqrsModule,
    CoreModule,
    ApiGuardsModule,
    SensorlinkingModule,
    ScheduleModule.forRoot(),
    ApiPositioningModule
  ],
  controllers: [MqttController],
  providers: [
    AppService,
    MqttService,
    PassportService,
    UserService,
    EventService,
    SensorlinkingService,
    PositioningService,
    JwtService
  ],
})
export class MqttModule {}
