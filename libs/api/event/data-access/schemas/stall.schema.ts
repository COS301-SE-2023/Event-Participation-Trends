import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StallDocument = HydratedDocument<Stall>;

@Schema({timestamps: true, collection: 'Stall' })
export class Stall{
    
    @Prop({ type: String, required: true })
    Name: string | undefined | null;

    @Prop({ type: Number, required: true })
    x_coordinate: number | undefined | null;

    @Prop({ type: Number, required: true })
    y_coordinate: number | undefined | null;

}

export const StallSchema = SchemaFactory.createForClass(Stall);