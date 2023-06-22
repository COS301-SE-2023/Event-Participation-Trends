import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Role } from '@event-participation-trends/api/user/util';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, collection: 'User' })
export class User{
    @Prop({ required: true, type: String })
    Role: Role | undefined | null;

    @Prop({ required: true })
    FirstName: string | undefined | null;

    @Prop()
    LastName: string | undefined | null;

    @Prop({ required: true })
    Email: string | undefined | null;

    @Prop()
    Picture: string | undefined | null;

    @Prop({ type: [{type: mongoose.Schema.Types.ObjectId ,ref: 'Event'}] })
    Viewing: Types.ObjectId[] | undefined | null;
}

export const UserSchema = SchemaFactory.createForClass(User);