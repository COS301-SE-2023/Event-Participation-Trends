import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { FloorLayout } from './floorlayout.schema';
import { Stall } from './stall.schema';
import { Sensor } from './sensor.schema';
import { Device } from './device.schema';
import { TEMP_DEVICE_TO_DT } from './TEMP_DEVICE_TO_DT.schema';
import { TEMP_DEVICE_BUFFER } from './TEMP_DEVICE_BUFFER.schema';
import { User } from './user.schema';
import { EventLocation } from './Eventlocation.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({timestamps: true, collection: 'Event' })
export class Event{

    @Prop({ required: true })
    EventId: string | undefined | null;

    @Prop({ required: true })
    StartDate: Date | undefined | null;

    @Prop({ required: true })
    EndDate: Date | undefined | null;

    @Prop({ required: true })
    Name: string | undefined | null;

    @Prop({ required: true })
    Category: string | undefined | null;

    @Prop({ required: true })
    Location: EventLocation | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'FloorLayout' })
    thisFloorLayout: FloorLayout | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Stall' })
    Stalls: Stall[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' })
    Sensors: Sensor[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Device' })
    Devices: Device[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'TEMP_DEVICE_TO_DT' })
    BTIDtoDeviceBuffer: TEMP_DEVICE_TO_DT[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'TEMP_DEVICE_BUFFER' })
    TEMPBuffer: TEMP_DEVICE_BUFFER[] | undefined | null;
    
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    Managers: User[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    Requesters: User[] | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    Viewers: User[] | undefined | null;
}

export const EventSchema = SchemaFactory.createForClass(Event);
