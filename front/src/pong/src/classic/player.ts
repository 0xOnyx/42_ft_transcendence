
import Rectangle from './rectangle.js';
import Timer from './timer.js';
import Controller from './controller.js';
import Vector from './vector.js';
import Size from './size.js';
import type { NetMessage } from './message.js';


export default class Player extends Rectangle
{
    id : number;
    speed : number = 300.0;
    canvas : Size;
    timer : Timer;
    score : number = 0;
    name : string = 'player';
    ready : boolean = false;
    connected : boolean = false;

    constructor(_id : number, _name : string, _canvas : Size, _timer : Timer)
    {
        super();
        this.canvas = _canvas;
        this.timer = _timer;
        this.name = _name;
        this.id = _id;
        this.setSize(10.0, 80.0);

    }

}
