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
    last_login?: string,
    online_status?: Status,
}

export type Authenticators = {
    id: number
    user_id: number
    secret: string
}


export enum Status {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
    HIDDEN = 'HIDDEN'
};

export type UserStats = {
    played: number,
	win: number,
    ratio: number,
    level: number,
	league: string,
}

export enum RoleUser {
    ADMIN =  'ADMIN',
    USER =  'USER'
}
