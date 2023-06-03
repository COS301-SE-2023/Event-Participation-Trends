import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StallDocument = HydratedDocument<Stall>;

@Schema({timestamps: true, collection: 'Stall' })
export class Stall{}

export const StallSchema = SchemaFactory.createForClass(Stall);