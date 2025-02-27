import {Message} from "../../abstract/representation/message.ts";
import {PrismaUser} from "./prismaUser.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {PrismaConversation} from "./prismaConversation.ts";

export class PrismaMessage implements Message {
    id: number;
    content: string;
    created_at: Date;
    user: PrismaUser;
    conversation: PrismaConversation;
    offset: [number, number];

    constructor(id: number, content: string, created_at: Date, user: PrismaUser, offset: [number, number], conversation: PrismaConversation) {
        this.id = id;
        this.content = content;
        this.created_at = created_at;
        this.user = user;
        this.offset = offset
        this.conversation = conversation;
    }
}