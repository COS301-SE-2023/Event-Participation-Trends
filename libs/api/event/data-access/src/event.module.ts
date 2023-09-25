import { Module } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema,
         ImageSchema,
         SensorSchema,
         StallSchema,
} from '../schemas';
import {EmailService} from '@event-participation-trends/api/email/feature';
@Module({
    imports: [MongooseModule.forFeature([
        {name: 'Sensor', schema: SensorSchema },
        {name: 'Stall', schema: StallSchema },
        {name: 'Event', schema: EventSchema },
        {name: 'Image', schema: ImageSchema },
        ])],
  providers: [EventRepository, EmailService],
  exports: [EventRepository, EmailService],
})
export class EventModule {} 