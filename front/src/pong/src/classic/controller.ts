import Keyboard from "./keyboard.js";

export default class Controller
{

    keyboard : Keyboard;
    currentUp : boolean;
    currentDown : boolean;
    currentSpace : boolean;

    constructor(_keyboard : Keyboard)
    {
        this.keyboard = _keyboard;
        this.currentUp = false;
        this.currentDown = false;
        this.currentSpace = false;
    }

    hasChange() : boolean
    {
        let changed : boolean = false;

        if (this.currentUp != this.keyboard.up)
        {
            this.currentUp = this.keyboard.up;
            changed = true;
        }

        if (this.currentDown != this.keyboard.down)
        {
            this.currentDown = this.keyboard.down;
            changed = true;
        }

        if (this.currentSpace != this.keyboard.space)
        {
            this.currentSpace = this.keyboard.space;
            changed = true;
        }

        return changed;
    }

    up() : boolean
    {
        return this.currentUp;
    }

    down() : boolean
    {
        return this.currentDown;
    }

    space() : boolean
    {
        return this.currentSpace;
    }

}
