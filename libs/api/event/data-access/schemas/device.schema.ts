import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { DeviceLocation } from './Devicelocation.schema'

export type DeviceDocument = HydratedDocument<Device>;

@Schema({timestamps: true, collection: 'Device' })
export class Device{
    @Prop({ required: true })
    DeviceId: string | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Location' })
    Locations: DeviceLocation[] | undefined | null;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);