
export type netMesPlayer = {
    y: Number;
    score: Number;
}

export type netMesBall = {
    position: {
        x: Number;
        y: Number;        
    },
    vector: {
        x: Number;
        y: Number;     
    }
}

export type netMessage = {

    player1: netMesPlayer;
    player2: netMesPlayer;
    ball: netMesBall;

}