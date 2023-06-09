import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { UpdateUserRoleCommand, IUpdateUserRole, IupdateRoleResponse } from '@event-participation-trends/api/user/util';
import { Status, Role } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserRole } from '../models';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler implements ICommandHandler<UpdateUserRoleCommand, IupdateRoleResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
      ) {}
      
    async execute(command: UpdateUserRoleCommand) {
        console.log(`${UpdateUserRoleCommand.name}`);

        const request = command.request.update;

        if (!request.AdminEmail || !request.UpdateRole || !request.UserEmail)
            throw new Error('Missing required field(s)');

        //check if user exists
        const userDoc= await this.userRepository.getUser(request.UserEmail || "");
        if(userDoc.length == 0)
            throw new Error(`User with email ${request.UserEmail} does not exist`);

        //check if email is admin email
        const adminUserDoc= await this.userRepository.getUser(request.AdminEmail || "");
        if(adminUserDoc.length == 0){
            throw new Error(`User with email ${request.AdminEmail} does not exist`);
        }else if(adminUserDoc[0].Role != Role.ADMIN){
            throw new Error(`User with eamil ${request.AdminEmail} does not have admin privileges`);
        }else{
            const data: IUpdateUserRole = {
                AdminEmail: request.AdminEmail,
                UserEmail: request.UserEmail,
                UpdateRole: request.UpdateRole,
            }

            const updateAction = this.publisher.mergeObjectContext(UpdateUserRole.fromData(data));
            updateAction.update();
            updateAction.commit();
            
        }

        return { status : Status.SUCCESS };
    }
}