import {LearningObject} from "../../abstract/representation/learning_objects.ts";
import {Teacher} from "../../abstract/representation/teacher.ts";
import {Group} from "../../abstract/representation/group.ts";
import {Assignment} from "../../abstract/representation/assignments.ts";
import {Conversation} from "../../abstract/representation/conversation.ts";
import {Message} from "../../abstract/representation/message.ts";
import {ConversationDAO} from "../../abstract/DAO/conversationDAO.ts";

export default class ConversationDAOImplementation implements ConversationDAO {
    createConversation(title: string, learningObject: LearningObject, teachers: Array<Teacher>, group: Group, assignment: Assignment): Conversation | null {
        throw new Error("Method not implemented.");
    }
    deleteConversation(conversation: Conversation): boolean {
        throw new Error("Method not implemented.");
    }
    updateConversation(conversation: Conversation, title?: string, learningObject?: LearningObject, group?: Group, assignment?: Assignment): Conversation | null {
        throw new Error("Method not implemented.");
    }
    addTeachers(conversation: Conversation, teachers: Array<Teacher>): Conversation | null {
        throw new Error("Method not implemented.");
    }
    removeTeachers(conversation: Conversation, teachers: Array<Teacher>): Conversation | null {
        throw new Error("Method not implemented.");
    }
    addMessages(conversation: Conversation, messages: Message): Conversation | null {
        throw new Error("Method not implemented.");
    }
    removeMessages(conversation: Conversation, messages: Message): Conversation | null {
        throw new Error("Method not implemented.");
    }
    findConversation(id: Number): Conversation | null {
        throw new Error("Method not implemented.");
    }

}