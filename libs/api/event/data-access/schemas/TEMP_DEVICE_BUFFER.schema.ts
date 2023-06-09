import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Sensor } from './sensor.schema';

export type TEMP_DEVICE_BUFFERocument = HydratedDocument<TEMP_DEVICE_BUFFER>;

@Schema({timestamps: true, collection: 'TEMP_DEVICE_BUFFER' })
export class TEMP_DEVICE_BUFFER{
    @Prop({ required: true })
    DeviceId: string | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' })
    SensorId: Sensor | undefined | null;

    @Prop({ required: true})
    TimeStamp: Date | undefined | null;

    @Prop({ required: true})
    SignalStrenght: number | undefined | null;
}

export const TEMP_DEVICE_BUFFERSchema = SchemaFactory.createForClass(TEMP_DEVICE_BUFFER);