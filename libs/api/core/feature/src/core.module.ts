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
import {
    EmailModule,
    EmailService,
  } from '@event-participation-trends/api/email/feature';
import {
    DatabaseModule,
    DatabaseService,
  } from '@event-participation-trends/api/database/feature';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { SensorlinkingModule } from '@event-participation-trends/api/sensorlinking';
import { JwtService } from '@nestjs/jwt';
import { EventRepository, EventSchema, ImageSchema, SensorSchema, StallSchema } from '@event-participation-trends/api/event/data-access';
import { UserRepository, UserSchema } from '@event-participation-trends/api/user/data-access';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    EventModule,
    GlobalModule,
    EmailModule,
    ApiGuardsModule,
    SensorlinkingModule,
    DatabaseModule,
    MongooseModule.forFeature([
        {name: 'Sensor', schema: SensorSchema },
        {name: 'Stall', schema: StallSchema },
        {name: 'Event', schema: EventSchema },
        {name: 'Image', schema: ImageSchema },
        {name: 'User', schema: UserSchema },
        ])
  ],
  controllers: [UserController, EventController, GlobalController],
  providers: [UserService, EventService, GlobalService, JwtService, EmailService, DatabaseService, UserRepository, EventRepository],
  exports: [UserService, EventService, GlobalService, EmailService, DatabaseService, UserRepository, EventRepository],
})
export class CoreModule {}
