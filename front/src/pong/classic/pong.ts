import Keyboard from './keyboard.js';
import type Mesh from './mesh.js';
import Rectangle from './rectangle.js';
import Timer from './timer.js';
import type Vector from './vector.js';
import Player from './player.js';
import Ball from './ball.js';
import Size from './size.js';
import Controller from './controller.js';
import Bound from './bound.js';
import Text from './text.js';


var pong : Pong;

export default class Pong
{
    context : CanvasRenderingContext2D;
    keyboard : Keyboard = new Keyboard();
    meshes : Array<Mesh> = [];
    colliders : Array<Mesh> = [];
    timer : Timer = new Timer();
    players : Array<Player> = [];
    controllers : Array<Controller> = [];
    bounds : Array<Bound> = [];
    ball : Ball;
    size : Size;
    status : string = "init";
    gutter : number = 20.0;

    constructor(_width : number, _height : number, _context : CanvasRenderingContext2D)
    {
        this.context = _context;

        this.size = new Size(_width, _height);

        this.ball = new Ball(this.size, this.timer);

        const rect_top : Rectangle = new Rectangle();
        rect_top.setSize(_width - 60.0, 10.0);
        rect_top.setPosition(30.0, 10.0);
        rect_top.setColor('white');

        this.colliders.push(rect_top);

        const rect_bottom : Rectangle = new Rectangle();
        rect_bottom.setSize(_width - 60.0, 10.0);
        rect_bottom.setPosition(30.0, this.size.h - 20.0);
        rect_bottom.setColor('white');

        this.colliders.push(rect_bottom);

        this.meshes.push(rect_top);
        this.meshes.push(rect_bottom);
        this.meshes.push(this.ball);

        this.controllers.push(new Controller('alpha', this.keyboard));
        this.controllers.push(new Controller('arrow', this.keyboard));

        this.bounds.push(new Bound(0,0,this.gutter,this.size.h));
        this.bounds.push(new Bound(this.size.w - this.gutter,0,this.size.w,this.size.h));

        this.addPlayer();
        this.addPlayer();

        pong = this;

    }

    addPlayer()
    {
        let no : string = <string>'' + this.players.length + 1;
        let player = new Player(no, this.size, this.timer);

        if (this.players.length == 0)
        {
            player.setPosition(this.gutter, (this.size.h - player.size.h) / 2);
            player.setColor('red');
        } else {
            player.setPosition(this.size.w - this.gutter - player.size.w, (this.size.h - player.size.h) / 2);
            player.setColor('yellow');
        }

        this.players.push(player);
        this.meshes.push(player);
        this.colliders.push(player);
    }

    run() : void
    {
        console.log("run");

        this.init();

        loop();
    }

    init() : void
    {
        this.ball.setPosition(this.size.w / 2, this.size.h / 2);

        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];
            player.update(this.controllers[index]);
            if (index == 0)
            {
                player.setPosition(this.gutter, (this.size.h - player.size.h) / 2);
            } else {
                player.setPosition(this.size.w - this.gutter - player.size.w, (this.size.h - player.size.h) / 2);
            }
        }
        if(this.status == 'init')
            this.status = 'wait';
        else
            this.status = 'run';

    }

    update () : void
    {
        this.timer.tick();

        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];
            player.update(this.controllers[index]);

        }

        if (this.status === 'run')
        {

            for (let index = 0; index < this.bounds.length; index++) {
                const bound = this.bounds[index];

                if(this.ball.getCollider().inBound(bound))
                {
                    this.players[1-index].score++;
                    this.status = 'loos'
                    this.init();
                }

            }

            for (let index = 0; index < this.colliders.length; index++) {
                const mesh = this.colliders[index];
                this.checkBallCollision(mesh);
            }
            this.ball.update();
        }

        if (this.status === 'wait')
        {
            if (this.keyboard.isKeyDown(' '))
                this.status = 'run';
        }

        if (this.status === 'loos')
        {
            this.init();
        }

    }

    checkBallCollision(meshB : Mesh) : void
    {
        let newPos : Vector = this.ball.getNextPosition();
        let testPos : Vector;

        testPos = newPos.copy();
        testPos.y = 0.0;
        if (this.ball.onCollide(meshB, testPos)) {
            this.ball.vector.x = -(this.ball.vector.x);
        }

        testPos = newPos.copy();
        testPos.x = 0.0;
        if (this.ball.onCollide(meshB, testPos)) {
            this.ball.vector.y = -(this.ball.vector.y);
        }
    }

    clear() : void
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw () : void
    {

        if (this.status === 'wait') {
            for (let index = 0; index < this.players.length; index++) {
                let txt : Text = new Text();
                txt.setPosition(this.size.w / 4 + ((this.size.w / 2) * index), this.size.h / 4);
                txt.content = <string>'' + this.players[index].score;
                txt.draw(this.context);
            }

        }

        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.draw(this.context);
        }
    }
}

function loop() : void
{
    pong.update();
    pong.clear();
    pong.draw();

    window.requestAnimationFrame(loop);
}


