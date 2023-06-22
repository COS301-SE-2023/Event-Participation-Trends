import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { CreateUserCommand, IUser, ICreateUserResponse } from '@event-participation-trends/api/user/util';
import { Status, Role } from'@event-participation-trends/api/user/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../models';
import { Types } from 'mongoose';
 
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, ICreateUserResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly userRepository: UserRepository,
      ) {}
    
      async execute(command: CreateUserCommand) {
        console.log(`${CreateUserCommand.name}`);

        const request = command.request.user;

        if (!request.Email)
            throw new Error('Missing required field: Eamil');

        const userDoc= await this.userRepository.getUser(request.Email || "");
        if(userDoc.length == 0){
            const data: IUser = {
                Email: request.Email,
                FirstName: request.FirstName,
                LastName: request.LastName,
                photo: request.photo,
                Role: Role.VIEWER,
                Viewing: new Array<Types.ObjectId>(), 
            }
    
            const user = this.publisher.mergeObjectContext(User.fromData(data));
            user.create();
            user.commit();
        }

        return { status : Status.SUCCESS };
      }
}