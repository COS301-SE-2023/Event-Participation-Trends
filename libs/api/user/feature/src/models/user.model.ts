import { 
    IUser, 
    CreateUserEvent, 
    } from '@event-participation-trends/api/user/util';
import { AggregateRoot } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class User extends AggregateRoot implements IUser {
    constructor(
        public Email?: string | undefined | null,
        public FirstName?: string | undefined | null,
        public LastName?: string | undefined | null,
        public photo?: string | undefined | null ,
        public Role?: string | undefined | null,
        public Viewing?: Types.ObjectId[] | undefined | null,
    ){
        super();
    }

    create() {
        this.apply(new CreateUserEvent(this.toJSON()));
    }

    static fromData(user: IUser): User {
        const instance = new User(
          user.Email,
          user.FirstName,
          user.LastName,
          user.photo,
          user.Role,
          user.Viewing,
        );
    
        return instance;
    }

    toJSON(): IUser {
        return {
            Email: this.Email,
            FirstName: this.FirstName,
            LastName: this.LastName,
            photo : this.photo,
            Role: this.Role,
            Viewing: this.Viewing,
        };
    }

}