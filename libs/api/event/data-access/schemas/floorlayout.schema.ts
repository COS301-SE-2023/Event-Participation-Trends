import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FloorLayoutDocument = HydratedDocument<FloorLayout>;

@Schema({timestamps: true, collection: 'FloorLayout' })
export class FloorLayout{
    
    @Prop({ type: String, required: true })
    JSON_DATA: string | undefined | null;
}

export const FloorLayoutSchema = SchemaFactory.createForClass(FloorLayout);