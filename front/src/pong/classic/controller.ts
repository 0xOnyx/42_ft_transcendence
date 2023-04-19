import Keyboard from "./keyboard.js";

export default class Controller
{  

    keyboard: Keyboard;
    type: string;

    constructor(_type : string, _keyboard : Keyboard) 
    {
        this.keyboard = _keyboard;
        this.type = _type;
    }

    up()
    {
        if (this.type === 'arrow') {
            return this.keyboard.up;
        }
        if (this.type === 'alpha') {
            return this.keyboard.isKeyDown('q');
        }        

    }

    down()
    {
        if (this.type === 'arrow') {
            return this.keyboard.down;
        }
        if (this.type === 'alpha') {
            return this.keyboard.isKeyDown('a');
        }        

    }

}
