import {Student} from "./model_student.ts"

export class Message{
    id: Number;
    is_student: Boolean;
    content: string;
    offset: Int16Array;
    student: Student;
    index: Number;
    Conversation: Number;
}