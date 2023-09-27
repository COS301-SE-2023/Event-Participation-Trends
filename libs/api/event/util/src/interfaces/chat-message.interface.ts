
export interface IChatMessage {
    text: string | undefined | null,
    timestamp: Date | undefined | null,
    user: {
        id:  string | undefined | null,
        fullname:  string | undefined | null,
        profilePic: string | undefined | null,
        role: string | undefined | null,
    },
};

export class ChatMessage {
    text: string | undefined | null;
    timestamp: Date | undefined | null;
    user: {
        id: string | undefined | null;
        fullname: string | undefined | null;
        profilePic: string | undefined | null;
        role: string | undefined | null;
    } | undefined | null;
};
