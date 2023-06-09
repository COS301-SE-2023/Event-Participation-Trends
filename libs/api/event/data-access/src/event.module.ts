import { Module } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema,
         DeviceSchema,
         FloorLayoutSchema,
         DeviceLocationSchema,
         EventLocationSchema,
         SensorSchema,
         StallSchema,
         TEMP_DEVICE_BUFFERSchema,
         TEMP_DEVICE_TO_DTSchema,
   } from '../schemas';

@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Device', schema: DeviceSchema },
        {name: 'Floorlayout', schema: FloorLayoutSchema },
        {name: 'EventLocation', schema: EventLocationSchema },
        {name: 'DeviceLocation', schema: DeviceLocationSchema },
        {name: 'Sensor', schema: SensorSchema },
        {name: 'Stall', schema: StallSchema },
        {name: 'TEMP_DEVICE_BUFFER', schema: TEMP_DEVICE_BUFFERSchema },
        {name: 'TEMP_DEVICE_TO_DT', schema: TEMP_DEVICE_TO_DTSchema },
        {name: 'Event', schema: EventSchema },
        ])],
  providers: [EventRepository],
  exports: [EventRepository],
})
export class EventModule {} 