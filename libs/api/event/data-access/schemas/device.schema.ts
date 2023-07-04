import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceDocument = HydratedDocument<Device>;

@Schema({timestamps: true, collection: 'Device' })
export class Device{
    @Prop({ type: String, required: true })
    DeviceId: string | undefined | null;

    @Prop({ type: Number, required: true })
    x_coordinate: number | undefined | null;

    @Prop({ type: Number, required: true })
    y_coordinate: number | undefined | null;
    
    @Prop({ type: Date, required: true })
    Timestamp: Date | undefined | null;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);