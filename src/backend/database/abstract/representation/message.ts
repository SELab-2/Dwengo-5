import {Conversation} from "./conversation.ts";
import {User} from "./user.ts";

export interface Message {
    id: number;
    content: string;
    offset: [number, number];
    user: User;
    conversation: Conversation;
}