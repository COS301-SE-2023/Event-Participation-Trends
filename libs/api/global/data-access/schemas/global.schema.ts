import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SensorIdToMac } from '../src/interfaces';

export type GlobalDocument = HydratedDocument<Global>;

@Schema({timestamps: true, collection: 'Global' })
export class Global{

    @Prop( [SensorIdToMac] )
    SensorIdToMacs: SensorIdToMac[] | undefined | null;

}

export const GlobalSchema = SchemaFactory.createForClass(Global);