import { ChatMessage } from "../interfaces";

export interface IGetEventChatMessagesResponse {
    messages: ChatMessage[] | undefined | null,
};