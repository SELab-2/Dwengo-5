export type ClassUrl = string;

export interface Teacher {
    name: string
}

export interface ClassDetails {
    name: string;
    links: {
        teachers: Teacher[];
    }
}

export interface ConversationResponse {
    conversations: string[];
}

export interface ConversationData {
    title: string;
    update?: string;
    group: string;
    links: {
        messages: string;
    };
}

export interface MessageData {
    sender: string;
    content: string;
}

export interface SenderData {
    name: string;
}

export interface AssignmentData {
    name?: string;
}

export interface Conversation {
    link: string;
    title: string;
    assignment: string;
    update: string;
    author: string;
    group: string;
}

export interface ClassData {
    name: string;
}
