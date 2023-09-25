
export interface IChatMessage {
    stallName?: string | undefined | null,
    timestamp: Date | undefined | null,
    message: string | undefined | null,
    userEmail: string | undefined | null,
    userProfileImageUrl: string | undefined | null,
}

export class ChatMessage {
    stallName?: string | undefined | null;
    timestamp: Date | undefined | null;
    message: string | undefined | null;
    userEmail: string | undefined | null;
    userProfileImageUrl: string | undefined | null;
}