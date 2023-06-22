import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventLocationDocument = HydratedDocument<EventLocation>;

@Schema({timestamps: true, collection: 'EventLocation' })
export class EventLocation{

    @Prop({ required: true })
    Latitude: number | undefined | null;

    @Prop({ required: true })
    Longitude: number | undefined | null;
    
    @Prop({ required: true })
    StreetName: string | undefined | null;

    @Prop({ required: true })
    CityName: string | undefined | null;

    @Prop({ required: true })
    ProvinceName: string | undefined | null;

    @Prop({ required: true })
    CountryName: string | undefined | null;

    @Prop({ required: true })
    ZIPCode: string | undefined | null;
}
    

export const EventLocationSchema = SchemaFactory.createForClass(EventLocation);