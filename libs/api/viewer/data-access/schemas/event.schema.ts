import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'

export type EventDocument = HydratedDocument<Event>;

@Schema({timestamps: true, collection: 'Event' })
export class Event{
    @Prop({ required: true })
    EventId: string | undefined | null;

    @Prop({ required: true })
    StartDate: Date | undefined | null;

    @Prop({ required: true })
    EndDate: Date | undefined | null;

    @Prop({ required: true })
    Name: string | undefined | null;

    @Prop({ required: true })
    Category: string | undefined | null;

    @Prop({ required: true })
    Location: string | undefined | null;

}

export const EventSchema = SchemaFactory.createForClass(Event);

