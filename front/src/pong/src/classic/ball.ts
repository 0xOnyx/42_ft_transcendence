import Rectangle from './rectangle.js';
import type Timer from './timer.js';
import type Size from './size.js';
import Vector from './vector.js';
import type { NetMessage } from './message.js';

export default class Ball extends Rectangle
{
    canvas : Size;
    timer : Timer;
    speed : number = 400.0;

    vector : Vector = new Vector();

    constructor(_canvas : Size, _timer : Timer)
    {
        super();
        this.canvas = _canvas;
        this.timer = _timer;

        this.setSize(10.0, 10.0);
        this.color = 'white';

        this.vector.x = 1;
        this.vector.y = 0;

        this.origin = new Vector(this.size.w / 2, this.size.h / 2);
    }

    getNextPosition() : Vector
    {
        return this.vector.copy().scalarMulti(this.speed * this.timer.delta);
    }

    update() : void
    {
        this.position.add(this.getNextPosition());
    }

    networkUpdate(mes: NetMessage)
    {
        this.setPosition(mes.ball.position.x, mes.ball.position.y);
        this.vector.x = mes.ball.vector.x;
        this.vector.y = mes.ball.vector.y;
    }

}
