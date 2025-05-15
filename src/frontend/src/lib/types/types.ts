export type ClassUrl = string;

export interface Teacher {
    name: string
}

export interface Member {
    id: string;
    username: string;
    role: string;
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
    postTime: string;
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
    //group: string;
}

export interface ClassData {
    name: string;
    conversations: Conversation[];
}

export type Submission = {
    grade: number;
    learningobject: string;
    id: number;
};

export type LearningObject = {
    title: string;
    time: string;
    language: string;
    difficulty: string;
    links: {
        content: string;
    }
}

export type MetaData = {
    title: string;
    time: string;
};
