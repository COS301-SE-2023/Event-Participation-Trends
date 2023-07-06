import { Module } from '@nestjs/common';
import { SensorlinkingController } from './sensorlinking.controller';
import { ApiGuardsModule } from '@event-participation-trends/api/guards';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@event-participation-trends/api/user/feature';
import { UserModule } from '@event-participation-trends/api/user/data-access';
import { CqrsModule } from '@nestjs/cqrs';
import { SensorlinkingService } from './sensorlinking.service';

@Module({
  imports: [
    ApiGuardsModule,
    UserModule,
    CqrsModule
  ],
  controllers: [SensorlinkingController],
  providers: [JwtService, UserService, SensorlinkingService],
  exports: [],
})
export class SensorlinkingModule {}
