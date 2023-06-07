import { 
    IUser, 
    CreateViewerEvent, 
    } from '@event-participation-trends/api/viewer/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class User extends AggregateRoot implements IUser {
    constructor(
        public Email?: string | undefined | null,
        public FirstName?: string | undefined | null,
        public LastName?: string | undefined | null,
        public photo?: string | undefined | null ,
        public Number?: string | undefined | null,
        public Role?: string | undefined | null
    ){
        super();
    }

    create() {
        this.apply(new CreateViewerEvent(this.toJSON()));
    }

    static fromData(user: IUser): User {
        const instance = new User(
          user.Email,
          user.FirstName,
          user.LastName,
          user.photo,
          user.Number,
          user.Role,
        );
    
        return instance;
    }

    toJSON(): IUser {
        return {
            Email: this.Email,
            FirstName: this.FirstName,
            LastName: this.LastName,
            photo : this.photo,
            Number: this.Number,
            Role: this.Role
        };
    }

}