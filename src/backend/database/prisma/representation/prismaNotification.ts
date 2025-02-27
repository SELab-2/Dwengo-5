import {PrismaUser} from "./prismaUser.ts";
import {Notification} from "../../abstract/representation/notification.ts";

class PrismaNotification implements Notification {
    id: number;
    title: string;
    content: string;
    read: boolean;
    user: PrismaUser;

    constructor(id: number, title: string, content: string, read: boolean, user: PrismaUser) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.read = read;
        this.user = user
    }
}