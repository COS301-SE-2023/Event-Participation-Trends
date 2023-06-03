import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Device } from './device.schema';

export type TEMP_DEVICE_TO_DTDocument = HydratedDocument<TEMP_DEVICE_TO_DT>;

@Schema({timestamps: true, collection: 'TEMP_DEVICE_TO_DT' })
export class TEMP_DEVICE_TO_DT{
    @Prop({ required: true })
    BTID: string | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Device' })
    DeviceId: Device | undefined | null;
}

export const TEMP_DEVICE_TO_DTSchema = SchemaFactory.createForClass(TEMP_DEVICE_TO_DT);