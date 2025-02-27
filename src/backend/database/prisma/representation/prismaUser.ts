import {User} from "../../abstract/representation/user.ts";

export class PrismaUser implements User {
    id: number;
    username: string;
    email: string;
    active_language: string;
    created_at: EpochTimeStamp;
    password: string;

    constructor(id: number, username: string, email: string, active_language: string, created_at: EpochTimeStamp, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.active_language = active_language;
        this.created_at = created_at;
        this.password = password
    }
}