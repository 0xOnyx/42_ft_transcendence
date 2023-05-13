import type Mesh from './mesh';
import Rectangle from './rectangle';
import Timer from './timer';
import Vector from './vector';
import Player from './player';
import Ball from './ball';
import Size from './size';
import Controller from './controller';
import Bound from './bound';
import Dash from './dash';
import { NetMessage, NetMessageState, GameEvent } from './message';
import { Server } from 'socket.io';

export enum GameStatus {

	CREATED = 'CREATED',
	READY = 'READY',
	INIT = 'INIT',
	WAIT = 'WAIT',
	RUN = 'RUN',
	LOST = 'LOST',
	FINISHED = 'FINISHED',

}

export default class PongServer
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
    status : GameStatus = GameStatus.INIT;
    gutter : number = 20.0;
    renderPong : boolean = true;
    scoreLimit : number = 3;
    network : boolean = false;
    server : Server;
    networkMessage : NetMessage | null = null;
    change : Array<Function> = [];
    gameId : number = 0;
    room : string;
    interval : any;

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

        this.controllers.push(new Controller());
        this.controllers.push(new Controller());

        this.addPlayer();
        this.addPlayer();

        this.overBounds.push(new Bound(0,0,this.gutter,this.size.h));
        this.overBounds.push(new Bound(this.size.w - this.gutter,0,this.size.w,this.size.h));

    }

    setGameId(game_id : number) : PongServer
    {
        this.gameId = game_id;
        return this;
    }

    getGameId() : number
    {
        return this.gameId;
    }

    setServer(serv: Server) : PongServer
    {
        this.server = serv;
        return this;
    }

    setRoom(room: string) : PongServer
    {
        this.room = room;
        return this;
    }

    getRoom() : string
    {
        return this.room;
    }

    addChangeListener(fn : Function) : PongServer
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

    setNetworkMessage(mes: NetMessage) : PongServer
    {
        this.networkMessage = mes;
        return this;
    }

    getNetworkMessage() : NetMessage
    {
        this.networkMessage = new NetMessage();

        this.networkMessage.event = GameEvent.UPDATE;

        const state : NetMessageState = new NetMessageState();

        state.ball.position.x = this.ball.position.x;
        state.ball.position.y = this.ball.position.y;

        state.ball.vector.x = this.ball.vector.x;
        state.ball.vector.y = this.ball.vector.y;

        for (let index = 0; index < this.players.length; index++) {
            state.players[index].score = this.players[index].score;
            state.players[index].y = this.players[index].position.y;
            state.players[index].ready = this.players[index].ready; 
        }
        state.status = this.status;

        this.networkMessage.state = state;

        return this.networkMessage;
    }

    playerCount() : number
    {
        return this.players.length;
    }

    addPlayer() : PongServer
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
        if(this.status == GameStatus.INIT)
            this.init();

        this.interval = setInterval(() => { this.gameLoop() } , 1000 / 60);
    }

    stop() : void
    {
        clearInterval(this.interval);
    }

    init() : void
    {
        this.ball.setPosition(this.size.w / 2, this.size.h / 2);

        if (this.ball.vector.x > 0) {
            this.ball.vector.x = .5;
            this.ball.vector.y = 0;
        } else {
            this.ball.vector.x = -.5;
            this.ball.vector.y = 0;
        }

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

        if(this.status == GameStatus.INIT)
            this.status = GameStatus.WAIT;
        else
            this.status = GameStatus.RUN;

        this.emitChange();
    }

    checkReady() : boolean
    {
        let ret = false;
        if(this.status == GameStatus.WAIT)
        {
            if (this.players[0].ready && this.players[1].ready )
            {
                this.status = GameStatus.RUN;
                ret = true;
            }
        }
        return ret;
    }

    update () : void
    {
        this.timer.tick();

        if (this.status !== GameStatus.FINISHED)
        {
            for (let index = 0; index < this.players.length; index++) {
                const player = this.players[index];
                player.update(this.controllers[index]);
            }
        }

        // check if the round is over
        if (this.status === GameStatus.RUN)
        {
            for (let index = 0; index < this.overBounds.length; index++) {
                const bound = this.overBounds[index];
                if(this.ball.getCollider().inBound(bound))
                {
                    this.players[1-index].score++;
                    this.status = GameStatus.LOST;
                    this.emitChange();
                }
            }
        }

        if (this.status === GameStatus.RUN)
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
        
            this.ball.update();
        }

        if (this.status === GameStatus.LOST)
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
                this.status = GameStatus.FINISHED;

            this.emitChange();
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
        this.update();
        if (this.status != GameStatus.FINISHED)
            this.emitChange();
    }
}
