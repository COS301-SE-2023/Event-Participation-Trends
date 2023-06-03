import { Module } from '@nestjs/common';
import { ViewerRepository } from './viewer.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema,
         EventSchema,
         DeviceSchema,
         FloorLayoutSchema,
         LocationSchema,
         SensorSchema,
         StallSchema,
         TEMP_DEVICE_BUFFERSchema,
         TEMP_DEVICE_TO_DTSchema,
        } from '../schemas';

@Module({
  imports: [MongooseModule.forFeature([
    {name: 'User', schema: "UserSchema" },
    {name: 'Event', schema: "EventSchema" },
    {name: 'Device', schema: "DeviceSchema" },
    {name: 'Floorlayout', schema: "FloorlayoutSchema" },
    {name: 'Location', schema: "LocationSchema" },
    {name: 'Sensor', schema: "SensorSchema" },
    {name: 'Stall', schema: "StallSchema" },
    {name: 'TEMP_DEVICE_BUFFER', schema: "TEMP_DEVICE_BUFFERSchema" },
    {name: 'TEMP_DEVICE_TO_DT', schema: "TEMP_DEVICE_TO_DTSchema" },
    ])],
  providers: [ViewerRepository],
  exports: [ViewerRepository],
})
export class ViewerModule {}
