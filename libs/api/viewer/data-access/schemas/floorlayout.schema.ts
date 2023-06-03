import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FloorLayoutDocument = HydratedDocument<FloorLayout>;

@Schema({timestamps: true, collection: 'FloorLayout' })
export class FloorLayout{}

export const UserSchema = SchemaFactory.createForClass(FloorLayout);