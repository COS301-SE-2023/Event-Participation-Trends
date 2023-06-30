import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Stall } from './stall.schema';
import { Sensor } from './sensor.schema';
import { Device } from './device.schema';
import { TEMP_DEVICE_TO_DT } from './TEMP_DEVICE_TO_DT.schema';
import { TEMP_DEVICE_BUFFER } from './TEMP_DEVICE_BUFFER.schema';
import { EventLocation } from './Eventlocation.schema';
import { Wall } from './walls.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema({timestamps: true, collection: 'Event' })
export class Event{

    @Prop({ type: Date, required: true })
    StartDate: Date | undefined | null;

    @Prop({ type: Date, required: true })
    EndDate: Date | undefined | null;

    @Prop({ type: String, required: true })
    Name: string | undefined | null;

    @Prop({ type: String, required: true })
    Category: string | undefined | null;

    @Prop({ type: EventLocation, required: true })
    Location: EventLocation | undefined | null;

    //@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'FloorLayout' })
    //thisFloorLayout: FloorLayout | undefined | null;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Wall' }] })
    Walls: Types.ObjectId[] | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Stall' })
    Stalls: Stall[] | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' })
    Sensors: Sensor[] | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Device' })
    Devices: Device[] | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TEMP_DEVICE_TO_DT' })
    BTIDtoDeviceBuffer: TEMP_DEVICE_TO_DT[] | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'TEMP_DEVICE_BUFFER' })
    TEMPBuffer: TEMP_DEVICE_BUFFER[] | undefined | null;
    
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    Manager: Types.ObjectId | undefined | null;

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId ,ref: 'User'}] })
    Requesters: Types.ObjectId[] | undefined | null;

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId ,ref: 'User'}] })
    Viewers: Types.ObjectId[] | undefined | null;
}

export const EventSchema = SchemaFactory.createForClass(Event);

