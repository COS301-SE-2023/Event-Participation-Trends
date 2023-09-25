import { AddChatMessageCommand } from '@event-participation-trends/api/event/util';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { Types } from 'mongoose';

@CommandHandler(AddChatMessageCommand)
export class AddChatMessageHandler implements ICommandHandler<AddChatMessageCommand, void> {
    constructor(
        private readonly eventRepository: EventRepository,
        
      ) {}

    async execute(command: AddChatMessageCommand) {
        console.log(`${AddChatMessageHandler.name}`);
        
        const request = command.request; 

        if(request.messagePacket)
            this.eventRepository.createChatMessage(
                <Types.ObjectId> <unknown> request.eventId,
                request.messagePacket
            );
    }
}