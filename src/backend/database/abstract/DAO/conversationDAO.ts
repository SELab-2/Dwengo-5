import { Teacher } from "../representation/teacher.ts";
import { LearningObject } from "../representation/learning_objects.ts";
import { Group } from "../representation/group.ts";
import { Assignment } from "../representation/assignments.ts";
import { Message } from "../representation/message.ts";
import { Conversation } from "../representation/conversation.ts";

interface conversationDAO {
    // create new conversation with given arguments, returns the new id if conversation added with succes.
    createConversation(
        title: string,
        learningObject: LearningObject,
        teachers: Array<Teacher>,
        group: Group,
        assignment: Assignment,
    ): Conversation | null;

    // delete conversation with given id.
    deleteConversation(conversation: Conversation): boolean;

    // todo: We zouden nog assigment, teachers, group en learning object kunnen veranderen maar ik weet niet of dat de moeite is.
    // Thor: update methode die alle statische velden kan aanpassen?
    updateConversation(
        conversation: Conversation,
        title?: string,
        learningObject?: LearningObject,
        group?: Group,
        assignment?: Assignment
    ): Conversation | null;

    addTeachers(
        conversation: Conversation,
        teachers: Array<Teacher>
    ): Conversation | null;
    removeTeachers(
        conversation: Conversation,
        teachers: Array<Teacher>,
    ): Conversation | null;

    addMessages(conversation: Conversation, messages: Message): Conversation | null;

    removeMessages(conversation: Conversation, messages: Message): Conversation | null;

    // find conversation by given id, if not found return null otherwise return the conversation.
    findConversation(id: Number): Conversation | null;


}