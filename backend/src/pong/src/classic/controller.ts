import { NetMessagePlayerMove } from "./message";

export default class Controller
{  
    currentUp : boolean;
    currentDown : boolean;

    constructor() 
    {
        this.currentUp = false;
        this.currentDown = false;
    }

    up() : boolean
    {
        return this.currentUp;
    }

    down() : boolean
    {
        return this.currentDown;
    }

    setNetMove(move : NetMessagePlayerMove)
    {
        this.currentUp = move.up;
        this.currentDown = move.down;
    }

}
