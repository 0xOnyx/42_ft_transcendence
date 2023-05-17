import type Player from "../pong/src/classic/player"

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
	win: number,
	losses: number,
	level: number,
}

export type GameHistory = {
	id: number;
    status:	string;
    player_one_id: number;
    player_two_id: number | null;
    player_one_accepted: boolean;
    player_two_accepted: boolean;
    map_type:	string;
    level: number | null;
    created_at:	string;
    score_one: number;
    score_two: number;
	player_one: User;
	player_two: User;
}

export enum RoleUser {
    ADMIN =  'ADMIN',
    USER =  'USER'
}
