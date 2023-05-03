import Mesh from './mesh.js';
import Size from './size.js';
import Vector from './vector.js';

export default class Dash extends Mesh
{
    destination : Vector = new Vector();

    constructor(_x1 ?: number | Vector, _y1 ?: number | Vector, _x2 ?: number, _y2 ?: number)
    {
        super();
        if (typeof _x1 === 'number' && typeof _y1 === 'number')
        {
            this.setPosition(new Vector(_x1, _y1));
            this.setDestination(new Vector(_x2, _y2));
        }
        else
        {
            this.setPosition(<Vector>_x1);
            this.setDestination(<Vector>_y1);
        }

        this.color = 'orange';
        this.name = 'sphere';
    }

    draw(context : CanvasRenderingContext2D): void 
    {
        context.beginPath();
        context.setLineDash([5, 15]);
        context.strokeStyle = this.color;
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.destination.x, this.destination.y);
        context.stroke();
        context.closePath();
    }

    setDestination(_destination : Vector|number, _y ?: number) : Mesh
    {
        if (typeof _destination === 'object') {
            this.destination = _destination;
        } else {
            this.destination = new Vector(_destination, _y);
        }
        return this;
    }

}
