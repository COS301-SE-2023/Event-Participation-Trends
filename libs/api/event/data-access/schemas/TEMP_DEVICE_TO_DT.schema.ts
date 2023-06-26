import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TEMP_DEVICE_TO_DTDocument = HydratedDocument<TEMP_DEVICE_TO_DT>;

@Schema({timestamps: true, collection: 'TEMP_DEVICE_TO_DT' })
export class TEMP_DEVICE_TO_DT{
    @Prop({ type: String, required: true })
    BTID: string | undefined | null;

    @Prop({ type: String, required: true })
    DeviceId: string | undefined | null;
}

export const TEMP_DEVICE_TO_DTSchema = SchemaFactory.createForClass(TEMP_DEVICE_TO_DT);