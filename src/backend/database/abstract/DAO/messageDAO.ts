// @ts-ignore
import { Message } from "../representation/message.ts";
import { Student } from "../representation/student.ts";
import { User } from "../representation/user.ts";
import { Conversation } from "../representation/conversation.ts";

interface MessageDAO {

    createMessage(
        content: string,
        offset: [number, number],
        user: User,
        conversation: Conversation,
    ): Message | null;

    removeMessage(message: Message): boolean;

    updateMessage(
        message: Message,
        content?: string,
        offset?: [number, number],
        user?: User,
    ): Message | null;

    // find message by given id
    findMessage(id: Number): Message;

    // change the conversation of the message.
    changeConversation(conversation: Conversation): void; // evt boolean als return
}

export default class MessageDAOImplementation implements MessageDAO {
    createMessage(content: string, offset: [number, number], user: User, conversation: Conversation): Message | null {
        throw new Error("Method not implemented.");
    }
    removeMessage(message: Message): boolean {
        throw new Error("Method not implemented.");
    }
    updateMessage(message: Message, content?: string, offset?: [number, number], user?: User): Message | null {
        throw new Error("Method not implemented.");
    }
    findMessage(id: Number): Message {
        throw new Error("Method not implemented.");
    }
    changeConversation(conversation: Conversation): void {
        throw new Error("Method not implemented.");
    }

}
