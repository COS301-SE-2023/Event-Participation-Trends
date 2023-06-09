import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventLocationDocument = HydratedDocument<EventLocation>;

@Schema({timestamps: true, collection: 'EventLocation' })
export class EventLocation{

    @Prop({ required: true })
    x_coordinate: number | undefined | null;

    @Prop({ required: true })
    y_coordinate: number | undefined | null;
    
    @Prop({ required: true })
    Timestamp: Date | undefined | null;
}
    

export const EventLocationSchema = SchemaFactory.createForClass(EventLocation);