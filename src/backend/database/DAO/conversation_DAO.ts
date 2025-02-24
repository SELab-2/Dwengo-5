import { Teacher } from "../models/model_teacher.ts"

interface conversationDAO{
    // create new conversation with given arguments, returns the new id if conversation added with succes.
    // todo learningobject and assignment
    create_conversation(title: string, group: Number, assignment:Number, teachers: [Teacher]): Number;

    // delete conversation with given id.
    delete_conversation(id: Number): void;

    // change title of conversation with given id.
    change_title(id: Number): void;

    // todo: We zouden nog assigment, teachers, group en learning object kunnen veranderen maar ik weet niet of dat de moeite is.
}