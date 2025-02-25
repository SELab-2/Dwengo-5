import {Conversation} from "./conversation.ts";
import {User} from "./user.ts";

export interface Message {
    readonly id: number;
    readonly content: string;
    readonly offset: [number, number];
    readonly user: User;
    readonly conversation: Conversation;
}