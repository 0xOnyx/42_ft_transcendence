import Timer from "./timer.js";
import Vector from "./vector.js";
import Size from "./size.js";
import Bound from "./bound.js";

export default class Mesh
{
    position : Vector = new Vector();
    size : Size = new Size();
    collider: Bound = new Bound();
    gravity : number = 20;
    color : string = 'blue';
    name : string = 'mesh';
    
    constructor ()
    {
    }

    setPosition(_position : Vector|number, _y ?: number) : Mesh
    {
        if (typeof _position === 'object') {
            this.position = _position;
        } else {
            this.position = new Vector(_position, _y);
        }
        return this;
    }

    setColor(_color : string) : Mesh
    {
        this.color = _color;
        return this;
    }

    setSize(_size : Size|number, _y ?: number) : Mesh
    {
        if (typeof _size === 'object') {
            this.size = _size;
        } else {
            this.size = new Size(_size, _y);
        }
        return this;
    }

    draw(context : CanvasRenderingContext2D) : void
    {
        
    }

    updateGravity(timer : Timer) : Vector
    {
        return (new Vector()).down().scalarMulti(this.gravity * timer.delta);
    }

    translate(vect : Vector) : Mesh
    {
        this.position.add(vect);
        return this;
    }
    
    getCollider(pos ?: Vector) : Bound 
    {

        if (typeof pos === 'undefined') {
            pos = new Vector();
        }

        let lefttop : Vector = this.position.copy().add(pos);
        let rightbottom : Vector = lefttop.copy().add(this.size.toVector());

        return new Bound(lefttop,
                        rightbottom);
    }

    onCollide(mesh : Mesh, new_position : Vector) : boolean
    {
        return mesh.getCollider().inBound(this.getCollider(new_position));
    }

};
