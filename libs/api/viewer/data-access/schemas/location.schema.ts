import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema({timestamps: true, collection: 'Location' })
export class Location{
    @Prop({ required: true })
    LocationId: string | undefined | null;

    @Prop({ required: true })
    x_coordinate: number | undefined | null;

    @Prop({ required: true })
    y_coordinate: number | undefined | null;
    
    @Prop({ required: true })
    Timestamp: Date | undefined | null;
}
    

export const LocationSchema = SchemaFactory.createForClass(Location);

//continue here then continue with event