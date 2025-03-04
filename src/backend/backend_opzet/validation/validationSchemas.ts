export interface Assignment {
    id: number;
    name: string;
    deadline: string | null;
    created_at: string;
    learning_path: string;
    class: number;
}

export interface Class {
    id: number;
    name: string | null;
}

export interface ClassStudent {
    classes_id: number;
    students_id: number;
}

export interface ClassTeacher {
    classes_id: number;
    teachers_id: number;
}

export interface Conversation {
    id: number;
    title: string | null;
    learning_object: string;
    teachers: number;
    group: number;
    assignment: number;
}

export interface Group {
    id: number;
    name: string | null;
    class: number;
    assignment: number;
}

export interface LearningObject {
    id: string;
    hruid: string;
    uuid: string;
    language: string;
    version: string;
    html_content: string;
}

export interface LearningObjectMetadata {
    id: string;
    uuid: string;
    version: number;
    language: string;
    title: string | null;
    description: string | null;
    keywords: string[];
    target_ages: number[];
    teacher_exclusive: boolean;
    educational_goals: object | null;
    copyright: string | null;
    license: string | null;
    difficulty: number;
    estimated_time: number;
    available: boolean;
    content_location: string;
}

export interface LearningPathNode {
    id: number;
    learning_object_id: string;
    start_node: boolean | null;
    learning_path: string;
}

export interface LearningPath {
    hruid: string;
    uuid: string;
    language: string;
    title: string | null;
    description: string | null;
    image: string | null;
}

export interface Message {
    id: number;
    content: string | null;
    offset: string | null;
    is_student: boolean;
    student: number | null;
    index: number;
    conversation: number;
}

export interface Notification {
    id: number;
    title: string;
    content: string;
    read: boolean;
    student: number | null;
    teacher: number | null;
}

export interface Student {
    id: number;
    username: string;
    email: string;
    password: string | null;
    active_language: string;
    created_at: string;
}

export interface Submission {
    id: number;
    group: number;
    assignment: number;
    submission_type: string;
    submission_content: object;
    graded_by: number | null;
}

export interface Teacher {
    id: number;
    username: string;
    password: string | null;
    email: string;
    active_language: string;
    created_at: string;
}
