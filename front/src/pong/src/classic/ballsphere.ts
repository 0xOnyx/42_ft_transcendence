import Sphere from './sphere.js';
import type Timer from './timer.js';
import type Size from './size.js';
import Vector from './vector.js';
import type { NetMessage } from './message.js';

export default class BallSphere extends Sphere
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

        this.setRadius(8.0);
        this.color = 'white';

        this.vector.x = 1;
        this.vector.y = 0;

        this.origin = new Vector(this.radius / 2, this.radius / 2);
    }

    getNextPosition() : Vector
    {
        return this.vector.copy().scalarMulti(this.speed * this.timer.delta);
    }

    update() : void
    {
        this.position.add(this.getNextPosition());
    }

}
