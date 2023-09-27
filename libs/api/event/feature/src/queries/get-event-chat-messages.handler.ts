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
        const chatDocs = await this.eventRepository.getEventChatMessages(eventIdObj);
        chatDocs[0]?.eventChats?.forEach(doc=>{
            chats.push({
                text: doc.text,
                timestamp: doc.timestamp,
                user: doc.user,
            })
        })

        return {messages :<ChatMessage[]><unknown> chats};
    }

}