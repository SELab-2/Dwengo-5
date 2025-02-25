export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    active_language: string;
    created_at: EpochTimeStamp;
}