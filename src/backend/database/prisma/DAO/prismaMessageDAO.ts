import {User} from "../../abstract/representation/user.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Message} from "../../abstract/representation/message.ts";
import {MessageDAO} from "../../abstract/DAO/messageDAO.ts";

export default class PrismaMessageDAO implements MessageDAO {
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