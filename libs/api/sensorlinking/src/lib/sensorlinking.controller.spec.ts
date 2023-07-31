import { Test } from '@nestjs/testing';
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
import { MongooseModule } from '@nestjs/mongoose';

describe('SensorlinkingController', () => {
  let controller: SensorlinkingController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UserModule,
        EventModule,
        CqrsModule,
        ApiGuardsModule,
        ScheduleModule.forRoot(),
        GlobalModule,
        MongooseModule.forRoot(process.env['MONGO_ALTALS_CONNECTION_URL'] || ""),
      ],
      providers: [
        UserService,
        EventService,
        JwtService,
        SensorlinkingService,
        GlobalService,
      ],
      controllers: [SensorlinkingController],
    }).compile();

    controller = module.get(SensorlinkingController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
