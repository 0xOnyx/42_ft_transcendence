
export type Game =
{
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
}

export type GameTypeSelection = {
    id: string,
    name : string,
    checked : boolean
}

export enum GameType {
	CLASSIC = 'CLASSIC',
	BLACKHOLE = 'BLACKHOLE'
}
