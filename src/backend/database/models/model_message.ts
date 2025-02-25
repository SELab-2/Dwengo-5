import { Student } from "./model_student.ts"

export class Message {
    id: Number;
    is_student: Boolean;
    content: String;
    offset: Int16Array;
    student: Student;
    index: Number;
    Conversation: Number;
}