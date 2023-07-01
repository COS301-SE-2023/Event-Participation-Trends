import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { UpdateUserRoleCommand, IUpdateUserRole, IupdateRoleResponse } from '@event-participation-trends/api/user/util';
import { Status, Role } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserRole } from '../models';
import { HttpException } from '@nestjs/common';

@CommandHandler(UpdateUserRoleCommand)
export class UpdateUserRoleHandler implements ICommandHandler<UpdateUserRoleCommand, IupdateRoleResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
      ) {}
      
    async execute(command: UpdateUserRoleCommand) {
        console.log(`${UpdateUserRoleCommand.name}`);

        const request = command.request.update;

        //check if user exists
        const userDoc= await this.userRepository.getUser(request.UserEmail || "");
        if(userDoc.length == 0)
            throw new HttpException(`Bad Request: User with email ${request.UserEmail} does not exist`, 400);

        //check if email is admin email
        const data: IUpdateUserRole = {
            AdminEmail: request.AdminEmail,
            UserEmail: request.UserEmail,
            UpdateRole: request.UpdateRole,
        }

        const updateAction = this.publisher.mergeObjectContext(UpdateUserRole.fromData(data));
        updateAction.update();
        updateAction.commit();

        return { status : Status.SUCCESS };
    }
}