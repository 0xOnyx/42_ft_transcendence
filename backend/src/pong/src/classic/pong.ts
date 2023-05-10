import type Mesh from './mesh.js';
import Rectangle from './rectangle.js';
import Timer from './timer.js';
import Vector from './vector.js';
import Player from './player.js';
import Ball from './ball.js';
import Size from './size.js';
import Controller from './controller.js';
import Bound from './bound.js';
import Dash from './dash.js';
import { NetMessage } from './message.js';
import { Server } from 'socket.io';


var pong : Pong;

export default class Pong
{
    context : CanvasRenderingContext2D;
    meshes : Array<Mesh> = [];
    colliders : Array<Mesh> = [];
    timer : Timer = new Timer();
    players : Array<Player> = [];
    controllers : Array<Controller> = [];
    overBounds : Array<Bound> = [];
    ball : Ball;
    size : Size;
    status : string = "init";
    gutter : number = 20.0;
    renderPong : boolean = true;
    scoreLimit : number = 3;
    network : boolean = false;
    server : Server;
    networkMessage : NetMessage | null = null;
    change : Array<Function> = [];
    room : string;

    constructor(_width : number, _height : number)
    {
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

        const line : Dash = new Dash(this.size.w / 2, 10, this.size.w / 2, this.size.h - 10);
        line.setColor('white');

        this.colliders.push(rect_bottom);

        this.meshes.push(rect_top);
        this.meshes.push(rect_bottom);
        this.meshes.push(line);
        this.meshes.push(this.ball);

        this.controllers.push(new Controller('alpha'));
        this.controllers.push(new Controller('arrow'));

        this.overBounds.push(new Bound(0,0,this.gutter,this.size.h));
        this.overBounds.push(new Bound(this.size.w - this.gutter,0,this.size.w,this.size.h));

        pong = this;
    }

    setServer(serv: Server) : Pong
    {
        this.server = serv;
        return this;
    }

    setRoom(room: string) : Pong
    {
        this.room = room;
        return this;
    }

    getRoom() : string
    {
        return this.room;
    }

    addChangeListener(fn : Function) : Pong
    {
        this.change.push(fn);
        return this;
    }

    emitChange()
    {
        for (let index = 0; index < this.change.length; index++) {
            this.change[index](this);   
        }
    }

    setNetworkMessage(mes: NetMessage) : Pong
    {
        this.networkMessage = mes;
        return this;
    }

    getNetworkMessage() : NetMessage
    {
        this.networkMessage = new NetMessage();

        this.networkMessage.ball.position.x = this.ball.position.x;
        this.networkMessage.ball.position.y = this.ball.position.y;

        this.networkMessage.ball.vector.x = this.ball.vector.x;
        this.networkMessage.ball.vector.y = this.ball.vector.y;

        for (let index = 0; index < this.players.length; index++) {
            this.networkMessage.players[index].score = this.players[index].score;
            this.networkMessage.players[index].y = this.players[index].position.y;
        }
        this.networkMessage.status = this.status;

        return this.networkMessage;
    }

    playerCount() : number
    {
        return this.players.length;
    }

    addPlayer() : Pong
    {
        let name : string = <string>'' + this.players.length + 1;
        let player = new Player(this.players.length, name, this.size, this.timer);

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
        
        return this; 

    }

    run() : void
    {
        if(this.status == 'init')
            this.init();
    }

    init() : void
    {
        this.ball.setPosition(this.size.w / 2, this.size.h / 2);

        this.ball.vector.scalarMulti(.5);

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

        this.emitChange();
    }

    update () : void
    {
        this.timer.tick();

        if (this.status !== 'finish')
        {
            for (let index = 0; index < this.players.length; index++) {
                const player = this.players[index];
                if(this.network)
                    player.networkUpdate(<NetMessage>this.networkMessage);
                else
                    player.update(this.controllers[index]);
            }
        }

        // check if the round is over
        if (this.status === 'run' && this.server)
        {
            for (let index = 0; index < this.overBounds.length; index++) {
                const bound = this.overBounds[index];
                if(this.ball.getCollider().inBound(bound))
                {
                    this.players[1-index].score++;
                    this.status = 'lost';
                    this.emitChange();
                }
            }
        }

        if (this.status === 'run')
        {
            if(this.network)
            {
                // update ball collider with other elements
                for (let index = 0; index < this.colliders.length; index++) {
                    const mesh = this.colliders[index];
                    this.checkBallMeshCollision(mesh);
                }
    
                for (let index = 0; index < this.players.length; index++) {
                    const player = this.players[index];
                    this.checkBallPlayerCollision(player, index);
                }
            }

            this.ball.update();
        }

        if (this.status === 'run' && this.network)
        {
            this.ball.networkUpdate(<NetMessage>this.networkMessage);
        }

        if (this.status === 'lost')
        {
            let isFinished : boolean = false;
            for (let index = 0; index < this.players.length; index++) {
                const player = this.players[index];
                if (player.score == this.scoreLimit)
                    isFinished = true;
            }
            if (!isFinished)
                this.init();
            else
                this.status = 'finish';
        }

    }

    checkBallMeshCollision(meshB : Mesh) : void
    {
        let newPos : Vector = this.ball.getNextPosition();
        let testPos : Vector;
        let updateChange : boolean = false;

        testPos = newPos.copy();
        testPos.y = 0.0;
        if (this.ball.onCollide(meshB, testPos)) {
            this.ball.vector.x *= -1;
            updateChange = true;
        }

        testPos = newPos.copy();
        testPos.x = 0.0;
        if (this.ball.onCollide(meshB, testPos)) {
            this.ball.vector.y *= -1;
            updateChange = true;
        }

        if(updateChange) {
            this.emitChange();
        }
    }

    checkBallPlayerCollision(player : Player, index : number) : void
    {
        let newPos : Vector = this.ball.getNextPosition();
        let testPos : Vector;

        testPos = newPos.copy();
        testPos.y = 0.0;
        if (this.ball.onCollide(player, testPos)) {

//            this.ball.vector.x *= -1;
            const diff : number = this.inRange(0, player.size.h, this.ball.position.y - player.position.y);
            const range : number = Math.PI;
            const gutter : number = range / 10;
            const angle = -range + gutter + ((range - (2 * gutter)) * (diff / player.size.h));
            let vectBall : Vector;
            if (index == 0)
                vectBall = new Vector(Math.sin(angle) * -1, Math.cos(angle));
            else
                vectBall = new Vector(Math.sin(angle) * 1, Math.cos(angle));
            this.ball.vector = vectBall;
            this.emitChange();
        }

    }

    clear() : void
    {
        this.context.clearRect(0, 0, this.size.w, this.size.h);
    }

    draw() : void
    {

    }

    drawPlayerVector(player : Player, invers : number)
    {
        const diff : number = this.inRange(0, player.size.h, this.ball.position.y - player.position.y);
        const range : number = Math.PI;
        const gutter : number = range / 10;
        const angle = -range + gutter + ((range - (2 * gutter)) * (diff / player.size.h));
        const vectPlayer = new Vector(Math.sin(angle) * invers, Math.cos(angle));
        const center = new Vector(0, player.size.h / 2);

        (new Dash(player.position.copy().add(center), player.position.copy().add(center).add(vectPlayer.scalarMulti(100)))).draw(this.context);
    }

    inRange(min: number, max : number, value : number)
    {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }

    gameLoop() : void
    {
        pong.update();
        if (!this.server)
        {
            pong.clear();
            pong.draw();
        }
    }
}


