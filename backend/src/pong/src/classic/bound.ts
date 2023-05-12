import Vector from "./vector";

export default class Bound 
{
    left : number = 0.0;
    top : number = 0.0;
    right : number = 0.0;
    bottom : number = 0.0;

    constructor (_left ?: number | Vector, _top ?: number | Vector, _right ?: number, _bottom ?: number) 
    {

        if ( (typeof _left) === 'object' && (typeof _top) === 'object')
        {
            this.left = (<Vector>_left).x;
            this.top = (<Vector>_left).y;
            this.right = (<Vector>_top).x;
            this.bottom = (<Vector>_top).y;
        } else
        {
            this.left = <number>_left || 0.0;
            this.top = <number>_top || 0.0;
            this.right = _right || 0.0;
            this.bottom = _bottom || 0.0;
        }
    }

    inBound (b : Bound) : boolean
    {
        let collision = false;
        if (this.right >= b.left 
          && this.left <= b.right 
          && this.bottom >= b.top 
          && this.top <= b.bottom)
            collision = true;
        return collision;

    }

}
