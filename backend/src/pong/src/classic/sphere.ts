import Mesh from './mesh.js';
import Size from './size.js';

export default class Sphere extends Mesh
{
    radius : number = 0;

    constructor(_radius ?: number) 
    {
        super();
        if (typeof _radius === 'number')
        {
            this.setRadius(_radius);
        }
        this.color = 'orange';
        this.name = 'sphere';
    }

    setRadius(_radius : number)
    {
        this.radius = _radius;
        this.setSize(new Size(_radius, _radius));
    }

    draw(context : CanvasRenderingContext2D): void 
    {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

}
