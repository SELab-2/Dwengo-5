export interface User {
    readonly id: number;
    readonly email: string;
    readonly username: string;
    readonly password: string;
    readonly active_language: string;
    readonly created_at: EpochTimeStamp;
}