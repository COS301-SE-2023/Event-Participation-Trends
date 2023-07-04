import { Module } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema,
         DeviceSchema,
         EventLocationSchema,
         SensorSchema,
         StallSchema,
} from '../schemas';
@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Device', schema: DeviceSchema },
        {name: 'EventLocation', schema: EventLocationSchema },
        {name: 'Sensor', schema: SensorSchema },
        {name: 'Stall', schema: StallSchema },
        {name: 'Event', schema: EventSchema }
        ])],
  providers: [EventRepository],
  exports: [EventRepository],
})
export class EventModule {} 