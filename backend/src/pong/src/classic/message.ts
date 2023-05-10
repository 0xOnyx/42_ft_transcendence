
export type NetMessagePlayer = {
    y: number;
    score: number;
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

export class NetMessage {
    status: string;
    players: [NetMessagePlayer, NetMessagePlayer] = [{y: 0, score: 0}, {y: 0, score: 0}];
    ball: NetMessageBall = {
        position: {
            x: 0,
            y: 0,
        },
        vector: {
            x: 0,
            y: 0,
        }
    };
}
