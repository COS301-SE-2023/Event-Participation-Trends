import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { ChatMessage, GetEventChatMessagesQuery, IGetEventChatMessagesResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

@QueryHandler(GetEventChatMessagesQuery)
export class GetEventChatMessagesHandler implements IQueryHandler<GetEventChatMessagesQuery, IGetEventChatMessagesResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}
    
    async execute(query: GetEventChatMessagesQuery) {
        console.log(`${GetEventChatMessagesHandler.name}`);
        const request = query.request;
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;
    
        const chats = new Array<ChatMessage>();
        const chatDocs = await this.eventRepository.getEventChatMessages(eventIdObj, request.stallName ||"");
        chatDocs.forEach(doc=>{
            chats.push({
                timestamp: doc.timestamp,
                message: doc.message,
                userEmail: doc.userEmail,
                userProfileImageUrl: doc.userProfileImageUrl,
            })
        })

        return {messages :<ChatMessage[]><unknown> chats};
    }

}