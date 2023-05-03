import Mesh from './mesh.js';
import Size from './size.js';

export default class Rectangle extends Mesh
{
    constructor(_w ?: number, _h ?: number)
    {
        super();
        if (typeof _w === 'number' && typeof _h === 'number')
        {
            this.setSize(new Size(_w, _h));
        }
        this.color = 'orange';
        this.name = 'sphere';
    }

    draw(context : CanvasRenderingContext2D): void 
    {
        context.beginPath();
        context.rect(this.position.x - this.origin.x, this.position.y - this.origin.y, this.size.w, this.size.h);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }

}
