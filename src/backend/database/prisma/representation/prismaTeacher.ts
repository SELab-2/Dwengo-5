import {Teacher} from "../../abstract/representation/teacher.ts";
import {PrismaUser} from "./prismaUser.ts";

export class PrismaTeacher extends PrismaUser implements Teacher {
    constructor(id: number, username: string, email: string, active_language: string, created_at: EpochTimeStamp, password: string) {
        super(id, username, email, active_language, created_at, password);
    }
}