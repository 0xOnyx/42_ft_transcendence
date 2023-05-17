

export default class Timer {

    _current : number;
    delta : number = 0.0;
    begin : number = 0.0;
    enable : boolean = true;

    constructor() {

        this._current = (new Date()).getTime();
        
        this.delta = 0.0;
        this.begin = 0.0;
        this.enable = true;
    }

    tick() : number
    {
        if (! this.enable)
            return 0;
        let newT = (new Date()).getTime();
        this.delta = (newT - this._current) / 1000;
        this._current = newT;
        this.begin += this.delta;
        return this.delta;
    }
    
}
