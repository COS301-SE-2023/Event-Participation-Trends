import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Role{
    ADMIN = "admin",
    MANAGER = "manager",
    VIEWER = "viewer",
    UNASSIGNED = "unassigned",
}

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, collection: 'User' })
export class User{
    @Prop({ required: true })
    UserId: string | undefined | null;

    @Prop({ required: true })
    Role: Role | undefined | null;

    @Prop({ required: true })
    Firstname: string | undefined | null;

    @Prop()
    Lastname: string | undefined | null;

    @Prop()
    Phonenumber: string | undefined | null;

    @Prop({ required: true })
    Email: string | undefined | null;

    @Prop()
    Picture: string | undefined | null;

}

export const UserSchema = SchemaFactory.createForClass(User);