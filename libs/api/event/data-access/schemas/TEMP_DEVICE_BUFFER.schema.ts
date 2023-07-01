import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';

export type TEMP_DEVICE_BUFFERocument = HydratedDocument<TEMP_DEVICE_BUFFER>;

@Schema({timestamps: true, collection: 'TEMP_DEVICE_BUFFER' })
export class TEMP_DEVICE_BUFFER{
    @Prop({ type: String, required: true })
    DeviceId: string | undefined | null;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' })
    SensorId: Types.ObjectId[] | undefined | null;

    @Prop({ type: Date, required: true})
    TimeStamp: Date | undefined | null;

    @Prop({ type: Number, required: true})
    SignalStrenght: number | undefined | null;
}

export const TEMP_DEVICE_BUFFERSchema = SchemaFactory.createForClass(TEMP_DEVICE_BUFFER);