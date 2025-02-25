// @ts-ignore
import {Message} from "../representation/message.ts";
import {Student} from "../representation/student.ts";
import {User} from "../representation/user.ts";
import {Conversation} from "../representation/conversation.ts";

interface MessageDAO{

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
}