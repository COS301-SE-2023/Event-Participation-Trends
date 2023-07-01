import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Types } from 'mongoose';

export type WallDocument = HydratedDocument<Wall>;

@Schema({timestamps: true, collection: 'Wall' })
export class Wall{
    
    @Prop({ type: Types.ObjectId})
    wallId?: Types.ObjectId | undefined | null;

    @Prop({ type: Number, required: true })
    x_coordiante: number | undefined | null;

    @Prop({ type: Number, required: true })
    y_coordiante: number | undefined | null;

    @Prop({ type: Number, required: true })
    width: number | undefined | null;

    @Prop({ type: Number, required: true })
    height: number | undefined | null;
}

export const WallSchema = SchemaFactory.createForClass(Wall);