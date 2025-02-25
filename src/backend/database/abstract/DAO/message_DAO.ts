// @ts-ignore
import {Student} from "../../models/model_student.ts";

interface MessageDAO{
    // creates new message and returns new id.
    // todo replace number Converstion with Conversation object.

    create_message(student: Student, content: string, Conversation: Number, is_student: boolean): Number;

    // delete message with certain id.
    delete_message(id: Number): void;

    // change content of message with given id.
    change_content(content: string, id: Number): void;

    // replace message wit given id to other conversation.
    // todo replace new_conversation with conversation object.
    replace_message(id: String, new_conversation: Number): void;
}