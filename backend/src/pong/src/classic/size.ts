import Vector from './vector.js';

export default class Size
{
    w: number = 0.0;
    h: number = 0.0;

    constructor(_w ?: number, _h ?: number)
    {
        this.w = _w || 0.0;
        this.h = _h || 0.0;
    }

    log() : Size 
    {
        console.log('Size', this.w, this.h);
        return this;
    }

    normalize(): Size 
    {
        const wh = (this.w + this.h);
        this.w /= wh;
        this.h /= wh;
        return this;
    }

    add (vect : Size) : Size
    {
        this.w += vect.w;
        this.h += vect.h;
        return this;
    }

    sub (vect : Size) : Size
    {
        this.w -= vect.w;
        this.h -= vect.h;
        return this;
    }

    scalarMulti(val : number) : Size
    {
        this.w *= val;
        this.h *= val;
        return this;
    }

    copy() : Size
    {
        return new Size(this.w, this.h);
    }

    toVector() : Vector
    {
        return new Vector(this.w, this.h);
    }
}
