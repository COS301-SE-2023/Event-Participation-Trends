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

import {DatabaseModule} from '@event-participation-trends/api/database/feature';
import { DatabaseConfigService } from '@event-participation-trends/api/database/feature';
import { NgIconsModule } from '@ng-icons/core';
import { SocketGateway } from './socket/socket.gateway';
import { SocketServiceService } from './socket/socket-service.service';

@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal: true,
      }
    ),
    Wow,
    JwtModule.register({
      global: true,
      secret: process.env['JWT_SECRET'],
      signOptions: { expiresIn: process.env['JWT_EXPIRE_TIME'] },
    }),
    MongooseModule.forRootAsync({
        useClass: DatabaseConfigService
    }),
    UserModule,
    EventModule,
    CqrsModule,
    CoreModule,
    ApiGuardsModule,
    SensorlinkingModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, PassportController],
  providers: [
    AppService,
    PassportService,
    UserService,
    EventService,
    SensorlinkingService,
    SocketGateway,
    SocketServiceService
  ],
})
export class AppModule {}
