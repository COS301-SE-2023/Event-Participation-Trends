import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WallDocument = HydratedDocument<Wall>;

@Schema({timestamps: true, collection: 'Wall' })
export class Wall{
    @Prop({ type: String, required: true })
    WallId: string | undefined | null;

    @Prop({ type: Number, required: true })
    x_coordiante: number | undefined | null;

    @Prop({ type: Number, required: true })
    y_coordiante: number | undefined | null;
}

export const WallSchema = SchemaFactory.createForClass(Wall);