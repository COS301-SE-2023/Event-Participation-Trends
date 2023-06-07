import { ViewerRepository } from '@event-participation-trends/api/viewer/data-access';
import { CreateViewerCommand, IUser, Status, Role, ICreateViewerResponse } from '@event-participation-trends/api/viewer/util';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../models';
 
@CommandHandler(CreateViewerCommand)
export class CreateViewerHandler implements ICommandHandler<CreateViewerCommand, ICreateViewerResponse> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly viewerRepository: ViewerRepository,
      ) {}
    
      async execute(command: CreateViewerCommand) {
        console.log(`${CreateViewerCommand.name}`);

        /*error checking here*/ 
        /*check that user not already in DB by email*/

        const request = command.request.user;

        const data: IUser = {
            Email: request.Email,
            FirstName: request.FirstName,
            LastName: request.LastName,
            photo: request.photo,
            Number: request.Number,
            Role: Role.VIEWER,
        }

        const user = this.publisher.mergeObjectContext(User.fromData(data));
        user.create();
        user.commit();

        return { status : Status.SUCCESS };
      }
}