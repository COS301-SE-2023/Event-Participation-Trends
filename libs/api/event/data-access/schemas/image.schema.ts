import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({timestamps: true, collection: 'Image' })
export class Image{

    @Prop({ type: String, required: true })
    imageBase64: string | undefined | null;

    @Prop({ type: mongoose.Schema.Types.ObjectId ,ref: 'Event', required: true })
    eventId: Types.ObjectId | undefined | null;
}

export const ImageSchema = SchemaFactory.createForClass(Image);