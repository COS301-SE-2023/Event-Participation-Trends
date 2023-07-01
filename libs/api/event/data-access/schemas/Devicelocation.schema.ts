import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DeviceLocationDocument = HydratedDocument<DeviceLocation>;

@Schema({timestamps: true, collection: 'DeviceLocation' })
export class DeviceLocation{

    @Prop({ type: Number, required: true })
    x_coordinate: number | undefined | null;

    @Prop({ type: Number, required: true })
    y_coordinate: number | undefined | null;
    
    @Prop({ type: Date, required: true })
    Timestamp: Date | undefined | null;
}
    

export const DeviceLocationSchema = SchemaFactory.createForClass(DeviceLocation);
