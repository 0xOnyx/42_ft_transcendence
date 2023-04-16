export type User =
{
    id: number,
    name?: string,
    email?: string,
    first_name?: string,
    last_name?: string,
    image_url?: string,
    oauth_42_login?: string,
    oauth_42_id?: number,
    last_login?: Date,
    online_status?: Status,
}


export enum Status {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    HIDDEN = 'HIDDEN'
};

export type UserStats = {
    played: number,
    ratio: number,
    level: number,
}
