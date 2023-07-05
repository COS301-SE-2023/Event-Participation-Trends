import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
import { CoreModule } from '@event-participation-trends/api/core/feature'
import { MqttService } from './mqtt.service';
import { UserService, UserModule } from '@event-participation-trends/api/user/feature';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from '@event-participation-trends/api/event/feature';
import { EventModule } from '@event-participation-trends/api/event/data-access';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { ConfigModule } from '@nestjs/config';

import { SensorlinkingModule, SensorlinkingService } from '@event-participation-trends/sensorlinking';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Wow,
    JwtModule.register({}),
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
  ],
  controllers: [AppController, MqttController, PassportController],
  providers: [AppService, MqttService, PassportService, UserService, EventService, SensorlinkingService],
})
export class AppModule {}
