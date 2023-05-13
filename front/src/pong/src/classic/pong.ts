import Keyboard from './keyboard';
import type Mesh from './mesh';
import Rectangle from './rectangle';
import Timer from './timer';
import Vector from './vector';
import Player from './player';
import Ball from './ball';
import Size from './size';
import Controller from './controller';
import Bound from './bound';
import Text from './text';
import Dash from './dash';
import { GameEvent, NetMessage, NetMessagePlayerMove, NetMessageState } from './message';
import { type Socket } from 'socket.io-client';

export enum GameStatus {

	CREATED = 'CREATED',
	READY = 'READY',
	INIT = 'INIT',
	WAIT = 'WAIT',
	RUN = 'RUN',
	LOST = 'LOST',
	FINISHED = 'FINISHED',

}

var pong : Pong;

export default class Pong
{
    context : CanvasRenderingContext2D;
    keyboard : Keyboard = new Keyboard();
    meshes : Array<Mesh> = [];
    colliders : Array<Mesh> = [];
    timer : Timer = new Timer();
    players : Array<Player> = [];
    controllers : Controller;
    overBounds : Array<Bound> = [];
    ball : Ball;
    size : Size;
    status : GameStatus = GameStatus.INIT;
    gutter : number = 20.0;
    renderPong : boolean = true;
    scoreLimit : number = 3;
    network : boolean = false;
    server : boolean = false;
    networkMessage : NetMessage | null = null;
    change : Array<Function> = [];
    socket : Socket;
    playerIndex : number = -1;
    gameId : number = 0;
    interval : any;

    constructor(_width : number, _height : number, _context : CanvasRenderingContext2D | null | undefined, socket : Socket)
    {
        this.socket = socket;
        this.context = <CanvasRenderingContext2D>_context;

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

        this.overBounds.push(new Bound(0,0,this.gutter,this.size.h));
        this.overBounds.push(new Bound(this.size.w - this.gutter,0,this.size.w,this.size.h));

        this.addPlayer();
        this.addPlayer();

        this.controllers = new Controller(this.keyboard);

        pong = this;
    }

    setSocket(socket: Socket) : Pong
    {
        this.socket = socket;
        return this;
    }

    setServer(serv: boolean) : Pong
    {
        this.server = serv;
        return this;
    }

    addChangeListener(fn : Function) : Pong
    {
        this.change.push(fn);
        return this;
    }

    emitChange()
    {
        for (let index = 0; index < this.change.length; index++) {
            this.change[index]();
        }
    }

    setNetworkMessage(mes: NetMessage) : Pong
    {
        if ( mes.event == GameEvent.UPDATE )
        {

            this.networkMessage = mes;

            const state : NetMessageState = <NetMessageState>mes.state;

            this.networkMessage.event = GameEvent.UPDATE;

            this.ball.position.x = state.ball.position.x;
            this.ball.position.y = state.ball.position.y;

            this.ball.vector.x = state.ball.vector.x;
            this.ball.vector.y = state.ball.vector.y;

            for (let index = 0; index < this.players.length; index++) {
                this.players[index].score = state.players[index].score;
                this.players[index].position.y = state.players[index].y;
                this.players[index].ready = state.players[index].ready;
            }
            this.status = <GameStatus>state.status;
        }

        return this;

    }

    addPlayer()
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
        // this.colliders.push(player);
    }

    run() : void
    {
        if(this.status == GameStatus.INIT)
            this.init();

        this.interval = setInterval(() => { this.gameLoop() } , 1000 / 60);
    }

    stop() : void
    {
        let msg : NetMessage = new NetMessage();

        msg.event = GameEvent.LEAVE;
        msg.game_id = this.gameId;
        msg.player = this.playerIndex;

        this.socket.emit('eventGame', msg);

        clearInterval(this.interval);
    }

    setPlayerController(playerIndex: number) : Pong
    {
        this.playerIndex = playerIndex;

        return this;
    }

    connectGame(game_id: number) : Pong
    {
        console.log("connect");

        this.gameId = game_id;

        this.socket.on('gameEvent', (netMessage : NetMessage) => {

            this.setNetworkMessage(netMessage);

        });

        let msg : NetMessage = new NetMessage();

        msg.event = GameEvent.CONNECT;
        msg.game_id = this.gameId;
        msg.player = this.playerIndex;

        this.socket.emit('eventGame', msg);

        return this;
    }

    init() : void
    {
        this.ball.setPosition(this.size.w / 2, this.size.h / 2);

        this.ball.vector.scalarMulti(.5);

        for (let index = 0; index < this.players.length; index++) {
            const player = this.players[index];
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
    }

    update () : void
    {
        this.timer.tick();

        if (this.status !== GameStatus.FINISHED)
        {
            if (this.playerIndex == 0 || this.playerIndex == 1) {

                if (this.controllers.hasChange()) {

                    if (this.status == GameStatus.WAIT) {

                        if (this.controllers.space())
                        {
                            const msg = new NetMessage();
                            msg.event = GameEvent.READY;
                            msg.game_id = this.gameId;
                            msg.player = this.playerIndex;
                            this.socket.emit('eventGame', msg);
                        }
                    }

                    // check controller
                    const msg = new NetMessage();
                    msg.event = GameEvent.MOVE;
                    msg.game_id = this.gameId;
                    msg.player = this.playerIndex;
                    msg.move = new NetMessagePlayerMove();
                    msg.move.up = this.controllers.up();
                    msg.move.down = this.controllers.down();
                    this.socket.emit('eventGame', msg);

                }
            }
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

        if (this.status === GameStatus.WAIT || this.status === GameStatus.RUN || this.status === GameStatus.FINISHED) {
            for (let index = 0; index < this.players.length; index++) {
                let txt : Text = new Text();
                txt.setPosition(this.size.w / 4 + ((this.size.w / 2) * index), this.size.h / 4);
                txt.content = <string>'' + this.players[index].score;
                txt.draw(this.context);
            }
        }

        if (this.status === GameStatus.WAIT)
        {
            for (let index = 0; index < this.players.length; index++) {
                const playerReady = this.players[index];
                let txt : Text = new Text();
                txt.setPosition(this.size.w / 4 + ((this.size.w / 2) * index), this.size.h / 2);
                if (!playerReady.ready)
                    txt.content = <string>'PRESS SPACE';
                else
                    txt.content = <string>'READY';
                txt.draw(this.context);
            }
        }

        if (this.status === GameStatus.FINISHED)
        {
            let txt : Text = new Text();
            txt.setPosition(this.size.w / 2, this.size.h / 2);
            txt.content = <string>'GAME OVER';
            txt.draw(this.context);
        }

        for (let index = 0; index < this.meshes.length; index++) {
            const mesh = this.meshes[index];
            mesh.draw(this.context);
        }

        // this.drawPlayerVector(this.players[0], -1);
        // this.drawPlayerVector(this.players[1], 1);

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
        pong.clear();
        pong.draw();
    }
}



