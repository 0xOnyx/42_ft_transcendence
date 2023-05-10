

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

        window.addEventListener("focus", (event) => {
            this.enable = true;
            this._current = (new Date()).getTime();
        });

        window.addEventListener("blur", (event) => {
            this.enable = false;
            this.delta = 0.0;
        });
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
