import { IChatMessage } from "../interfaces";

export interface IGetEventChatMessagesResponse {
    messages: IChatMessage[] | undefined | null,
};