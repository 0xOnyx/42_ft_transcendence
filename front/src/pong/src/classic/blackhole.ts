import Mesh from './mesh.js';
import Size from './size.js';
import type Timer from './timer.js';
import type Vector from './vector.js';

type Star = {
    radius: number,
    angle: number,
    speed: number
}

export default class Blackhole extends Mesh
{
    radius : number = 0;
    timer : Timer;
    starts : Array<Star> = [];

    constructor(_timer : Timer, _radius ?: number)
    {
        super();
        this.timer = _timer;
        if (typeof _radius === 'number')
        {
            this.setRadius(_radius);
        }
        this.color = 'black';
        this.radius = 100;
        this.name = 'sphere';

        for (let index = 0; index < 50; index++) {
            this.starts.push({
                radius : (Math.random() * 200) + this.radius + 50,
                angle: Math.random() * Math.PI * 2,
                speed : (Math.random() * Math.PI * .9)
            });
        }

    }

    setRadius(_radius : number)
    {
        this.radius = _radius;
        this.setSize(new Size(_radius, _radius));
    }

    draw(context : CanvasRenderingContext2D): void
    {
        for (let index = 0; index < this.starts.length; index++) {

            this.starts[index].angle += (this.timer.delta * (this.starts[index].speed));

            const star = this.starts[index];

            context.beginPath();
            context.arc((Math.sin(star.angle) * star.radius) + this.position.x,
                (Math.cos(star.angle) * star.radius) + this.position.y,
                2,
                0,
                Math.PI*2,
                false);
            context.closePath();
            context.fillStyle = 'white';
            context.fill();
        }

        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

}
