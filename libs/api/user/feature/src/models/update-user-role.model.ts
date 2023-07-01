import { 
    IUpdateUserRole, 
    UpdateUserRoleEvent, 
    } from '@event-participation-trends/api/user/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class UpdateUserRole extends AggregateRoot implements IUpdateUserRole {
    constructor(
        public AdminEmail?: string | undefined | null,
        public UserEmail?: string | undefined | null,
        public UpdateRole?: string | undefined | null,
    ){
        super();
    }

    update() {
        this.apply(new UpdateUserRoleEvent(this.toJSON()));
    }

    static fromData(userRole: IUpdateUserRole): UpdateUserRole {
        const instance = new UpdateUserRole(
          userRole.AdminEmail,
          userRole.UserEmail,
          userRole.UpdateRole,
        );
    
        return instance;
    }

    toJSON(): IUpdateUserRole {
        return {
            AdminEmail: this.AdminEmail,
            UserEmail: this.UserEmail,
            UpdateRole: this.UpdateRole
        };
    }

}