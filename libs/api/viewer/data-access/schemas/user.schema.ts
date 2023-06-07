import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '@event-participation-trends/api/viewer/util';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, collection: 'User' })
export class User{
    //@Prop({ required: true })
    //UserId: string | undefined | null;

    @Prop({ required: true, type: String })
    Role: Role | undefined | null;

    @Prop({ required: true })
    FirstName: string | undefined | null;

    @Prop()
    LastName: string | undefined | null;

    @Prop()
    Phonenumber: string | undefined | null;

    @Prop({ required: true })
    Email: string | undefined | null;

    @Prop()
    Picture: string | undefined | null;

}

export const UserSchema = SchemaFactory.createForClass(User);