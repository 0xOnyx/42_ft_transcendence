export default class Keyboard
{  
    up : boolean = false;
    down : boolean = false;
    left : boolean = false;
    right : boolean = false;
    space : boolean = false;

    keys: Map<string, boolean> = new Map();

    constructor() 
    {
        
        window.addEventListener("keydown", (event) => {
            if (event.key === "ArrowUp") 
                this.up = true;
        
            if (event.key === "ArrowDown") 
                this.down = true;
        
            if (event.key === "ArrowRight") 
                this.right = true;
            
            if (event.key === "ArrowLeft")
                this.left = true;
            
            if (event.key === " ")
                this.space = true;

            this.keys.set(event.key, true);
        });
        
        window.addEventListener("keyup", (event) => {

            if (event.key === "ArrowUp") 
                this.up = false;
        
            if (event.key === "ArrowDown") 
                this.down = false;
        
            if (event.key === "ArrowRight") 
                this.right = false;
            
            if (event.key === "ArrowLeft")
                this.left = false;
        
            if (event.key === " ")
                this.space = false;
            
            this.keys.set(event.key, false);
        });
        
    }

    isKeyDown(key: string)
    {
        if(!this.keys.has(key))
            return false;

        return this.keys.get(key);
    }

}
