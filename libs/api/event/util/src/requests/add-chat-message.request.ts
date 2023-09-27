import { ChatMessage } from "../interfaces";

export interface IAddChatMessageRequest{
    eventId: string | undefined | null,
    messagePacket: ChatMessage | undefined | null,
}