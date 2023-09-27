import { IGetEventChatMessagesRequest } from "../requests";

export class GetEventChatMessagesQuery {
    constructor(public readonly request: IGetEventChatMessagesRequest) {}
}