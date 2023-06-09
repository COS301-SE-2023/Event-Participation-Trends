import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SensorDocument = HydratedDocument<Sensor>;

@Schema({timestamps: true, collection: 'Sensor' })
export class Sensor{
    @Prop({ required: true })
    SensorId: string | undefined | null;

    @Prop({ required: true })
    x_coordiante: number | undefined | null;

    @Prop({ required: true })
    y_coordiante: number | undefined | null;
}

export const SensorSchema = SchemaFactory.createForClass(Sensor);