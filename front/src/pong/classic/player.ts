
import Rectangle from './rectangle.js';
import Timer from './timer.js';
import Controller from './controller.js';
import Vector from './vector.js';
import Size from './size.js';


export default class Player extends Rectangle
{
    speed : number = 300.0;
    canvas : Size;
    timer : Timer;
    score : number = 0;
    name : string = 'player';

    constructor(_name : string, _canvas : Size, _timer : Timer)
    {
        super();
        this.canvas = _canvas;
        this.timer = _timer;
        this.name = _name;
        this.setSize(10.0, 80.0);
    }

    update(controller : Controller) : void
    {
        const new_pos : Vector = this.position.copy();

        if (controller.up()) {
            let value : number = this.speed * this.timer.delta;
            console.log(this.timer.delta);
            new_pos.add((new Vector).up().scalarMulti(this.speed * this.timer.delta));
        }

        if (controller.down()) {
            let value : number = this.speed * this.timer.delta;
            console.log(value);
            new_pos.add((new Vector).down().scalarMulti(this.speed * this.timer.delta));
        }

        if (new_pos.y < 0) {
            new_pos.y = 0;
        }

        if (new_pos.y + this.size.h > this.canvas.h) {
            new_pos.y = this.canvas.h - this.size.h;
        }

        this.setPosition(new_pos);
    }

}
