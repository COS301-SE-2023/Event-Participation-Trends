import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventLocationDocument = HydratedDocument<EventLocation>;

@Schema({timestamps: true, collection: 'EventLocation' })
export class EventLocation{

    @Prop({ type: Number, required: true })
    Latitude: number | undefined | null;

    @Prop({ type: Number, required: true })
    Longitude: number | undefined | null;
    
    @Prop({ type: String, required: true })
    StreetName: string | undefined | null;

    @Prop({ type: String, required: true })
    CityName: string | undefined | null;

    @Prop({ type: String, required: true })
    ProvinceName: string | undefined | null;

    @Prop({ type: String, required: true })
    CountryName: string | undefined | null;

    @Prop({ type: String, required: true })
    ZIPCode: string | undefined | null;
}
    

export const EventLocationSchema = SchemaFactory.createForClass(EventLocation);