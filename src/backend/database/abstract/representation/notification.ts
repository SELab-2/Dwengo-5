import {User} from "./user.ts";

export interface Notification {
    readonly id: number;
    readonly title: string;
    readonly content: string;
    readonly read: boolean;
    readonly user : User;
}
