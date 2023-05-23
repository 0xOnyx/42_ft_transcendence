
export default class Vector
{
    x: number = 0.0;
    y: number = 0.0;

    constructor(_x ?: number|null, _y ?: number|null)
    {
        this.x = _x || 0.0;
        this.y = _y || 0.0;
    }

    log() : Vector 
    {
        // console.log('vector', this.x, this.y);
        return this;
    }

    normalize(): Vector 
    {
        const xy = (this.x + this.y);
        this.x /= xy;
        this.y /= xy;
        return this;
    }

    add (vect : Vector) : Vector
    {
        this.x += vect.x;
        this.y += vect.y;
        return this;
    }

    sub (vect : Vector) : Vector
    {
        this.x -= vect.x;
        this.y -= vect.y;
        return this;
    }

    scalarMulti(val : number) : Vector
    {
        this.x *= val;
        this.y *= val;
        return this;
    }

    copy() : Vector
    {
        return new Vector(this.x, this.y);
    }

    up() : Vector
    {
        return new Vector(0.0, -1.0);
    }

    down() : Vector
    {
        return new Vector(0.0, 1.0);
    }

    left() : Vector
    {
        return new Vector(-1.0, 0.0);
    }

    right() : Vector
    {
        return new Vector(1.0, 0.0);
    }
}
