
export default class Controller
{  

   type: string;

    constructor(_type : string) 
    {
        this.type = _type;
    }

    up() : boolean
    {
        return false;
    }

    down() : boolean
    {
        return false;
    }

}
