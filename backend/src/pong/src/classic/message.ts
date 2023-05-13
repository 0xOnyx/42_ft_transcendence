
export enum GameEvent {

    NONE = 'NONE',
	CONNECT = 'CONNECT',
    LEAVE = 'LEAVE',
	MOVE = 'MOVE',
	UPDATE = 'UPDATE',
    READY = 'READY'
}

export type NetMessagePlayer = {
    y: number;
    score: number;
    ready: boolean;
}

export type NetMessageBall = {
    position: {
        x: number;
        y: number;
    },
    vector: {
        x: number;
        y: number;
    }
}
export class NetMessageState {
    status: string = 'INVALID';
    players: Array<NetMessagePlayer> = [ { y: 0, score: 0, ready: false }, { y: 0, score: 0, ready: false }];
    ball: NetMessageBall = { position : { x: 0, y: 0}, vector : { x: 0, y: 0} }
}

export class NetMessagePlayerMove {
    up: boolean = false;
    down: boolean = false;
}
export class NetMessage {

    event: GameEvent = GameEvent.NONE;
    game_id: number = 0;
    player : number = -1;
    move?: NetMessagePlayerMove = {up: false, down: false};
    state?: NetMessageState = {
        status: 'INVALID',
        players: [
            {y: 0, score: 0, ready: false},
            {y: 0, score: 0, ready: false}
        ],
        ball: {
            position: {
                x: 0, y: 0,
            },
            vector: {
                x: 0, y: 0,
            }
        }
    };
}
