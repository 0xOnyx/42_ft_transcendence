import {
  ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { NetMessage } from 'src/pong/src/classic/message';
import { GameEvent } from 'src/pong/src/classic/message';
import { NetMessagePlayerMove } from 'src/pong/src/classic/message';
import PongServer, { GameStatus } from 'src/pong/src/classic/pongserver';
import { PrismaGameService } from 'src/prisma/prismagame.service';
import {Game, StatusGame, TypeGame, TypeMessage} from '@prisma/client';
import { GameService } from 'src/game/game.service';
import {MessageService} from "../prisma/message.service";
import { UserService } from 'src/prisma/user.service';


type matchmakingPlayer = {socket : Socket, user_id : number}

  @Injectable()
  @WebSocketGateway({
    path: "/gamews/", 
    namespace: 'events'
  })
  export class GameWsGateway {

    /**
     * The websocket server
     */
    @WebSocketServer()
    server: Server;

    /**
     * list of active pong server
     */
    pongs: Map<string, PongServer> = new Map;

    /**
     * list of user wait matchmaking
     */
    matchmakings: Array<matchmakingPlayer> = [];


    constructor(private prismaGameService: PrismaGameService, private gameService : GameService, private userService : UserService, private messageService: MessageService) {}

    async handleDisconnect(client: Socket) 
    {

    }

    async handleConnection(client: Socket) 
    {

    }

    /**
     * Join to game
     * 
     * @param data 
     * @param client 
     * @returns 
     */
    @SubscribeMessage('joinGame')
    async join(@MessageBody() data: any, @ConnectedSocket() client: Socket ) 
    {
      let room_name : string = 'game_' + <string>(data.game_id);
      let game : Game = <Game>await this.prismaGameService.find(parseInt(data.game_id));
      let pong : PongServer;
  
      client.join(room_name);
    
      if (!this.pongs.has(room_name)) {

        pong = new PongServer(800, 500);

        pong.setServer(this.server)
          .setGameId(parseInt(data.game_id))
          .setRoom(room_name)
          .addChangeListener((pong : PongServer) => {

              this.server.in(pong.getRoom()).emit('eventGame',
                pong.getNetworkMessage()
              );

              if (pong.status == GameStatus.FINISHED || pong.status == GameStatus.LOST)
              {
                this.prismaGameService.find(pong.getGameId()).then((game) => {
                  if (game != null)
                  {
                    if(pong.status == GameStatus.FINISHED)
                    {
                      game.status = StatusGame.FINISHED;
                      this.messageService.updateMessageGame({message_type: TypeMessage.INVITE_GAME, content: data.game_id.toString()}, GameStatus.FINISHED)
                    }
                    else
             					game.status = StatusGame.RUN;
					
                    game.score_one = pong.players[0].score;
                    game.score_two = pong.players[1].score;
                    this.prismaGameService.update(game);
                  }
                })
              }

          });

        if (<GameStatus>game.status == GameStatus.FINISHED) {
          pong.status = GameStatus.FINISHED;
        }

        pong.players[0].score = game.score_one;
        pong.players[1].score = game.score_two;

        pong.run();

        this.pongs.set(room_name, pong);

        this.prismaGameService.find(pong.getGameId()).then((game) => {
          if (game != null)
          {
            game.status = StatusGame.READY;
            this.prismaGameService.update(game);
          }
        });
                
      } 
      else {
        pong = <PongServer>this.pongs.get(room_name);
      }

      this.server.in(room_name).emit('joinGame',
        game
      );

    }

    /**
     * the game have change of status
     * 
     * @param data 
     * @param client 
     */
    @SubscribeMessage('eventGame')
    event(@MessageBody() data: NetMessage, @ConnectedSocket() client: Socket ): any {

      let room : string = 'game_' + data.game_id;

      if (this.pongs.has(room)) {

        let pong : PongServer = <PongServer>this.pongs.get(room);

        if (data.event == GameEvent.CONNECT)
        {
          
          if (data.player == 0 || data.player == 1)
          {
            pong.players[data.player].connected = true;
          }

        }

        if (data.event == GameEvent.MOVE)
        {
          let move : NetMessagePlayerMove = <NetMessagePlayerMove>data.move;

          if (data.player == 0 || data.player == 1)
          {
              pong.controllers[data.player].setNetMove(move);
              pong.emitChange();
          }

        }

        if (data.event == GameEvent.READY)
        {
          if (data.player == 0 || data.player == 1)
          {
            if (!pong.players[data.player].ready)
              pong.players[data.player].ready = true;

            if(pong.checkReady())
            {
              this.prismaGameService.find(pong.getGameId()).then((game) => {
                if (game != null)
                {
                  game.status = StatusGame.RUN;
                  this.prismaGameService.update(game);
                }
              });
            }
          }
        }

        if (data.event == GameEvent.LEAVE)
        {
          
          if (data.player == 0 || data.player == 1)
          {
            pong.players[data.player].connected = false;
          }

        }

      }

    }
    
    /**
     * leave the game
     * 
     * @param data 
     * @returns 
     */
    @SubscribeMessage('leaveGame')
    leave(@MessageBody() data: any) {
      let room : string = 'game_' + data.game_id;

      if (this.pongs.has(room)) {
        
        let pong : PongServer = <PongServer>this.pongs.get(room);
                
        if (pong.players[0].connected == false && pong.players[1].connected == false) {
          pong.stop();
          this.pongs.delete(room);
        }

      }

    }
    
    /**
     * emit when a new game is created
     * 
     * @param payload 
     */
    @OnEvent('game.create')
    gameCreate(game: Game) {

      // if the player two is not set
      if (game.player_two_id === null)
      {

        // check if exists a soon another player in match making
        if (this.matchmakings.length > 0) {

          // dont join same user
          if (this.matchmakings[0].user_id != game.player_one_id)
          {
            const player : matchmakingPlayer = <matchmakingPlayer>this.matchmakings.shift();

            game.player_two_id = player.user_id;

            this.prismaGameService.update(game);
            
            this.server.emit('gotoGame', { user_id : game.player_two_id, game_id : game.id });
            this.server.emit('gotoGame', { user_id : game.player_one_id, game_id : game.id });

          }

        }

      }

    }


    /**
     * leave the matchmaking
     * 
     * @param data { user_id : integer }
     */
    @SubscribeMessage('leaveMatchmakingGame')
    leaveMatchmaking(@MessageBody() data: any) {
      for (let index = 0; index < this.matchmakings.length; index++) {
        const element = this.matchmakings[index];
        if (element.user_id == data.user_id) {
          this.matchmakings.splice(index, 1);
        }
      }

    }

    /**
     * join a matchmaking
     * 
     * @param data { user_id : integer }
     */
    @SubscribeMessage('joinMatchmakingGame')
    async joinMatchmaking(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
      // check if exists a game without player two
      let games : Array<Game> = await this.prismaGameService.search({ status : StatusGame.READY, player_two: null, NOT : { player_one_id : data.user_id } } );
      
      if (games.length > 0) {

        games[0].player_two_id = data.user_id;
        this.prismaGameService.update(games[0]);

        this.server.emit('gotoGame', { user_id: data.user_id, game_id : games[0].id });

      } else {

        // check if exists a soon another player in match making
        if (this.matchmakings.length > 0) {

          // dont join same user
          if (this.matchmakings[0].user_id != data.user_id)
          {
            const player : matchmakingPlayer = <matchmakingPlayer>this.matchmakings.shift();
  
            const game : Game = await this.gameService.create(TypeGame.CLASSIC, player.user_id, data.user_id);
            
            this.server.emit('gotoGame', { user_id : data.user_id, game_id :   game.id });
            this.server.emit('gotoGame', { user_id : player.user_id, game_id : game.id });
            
            return;

          }

        } 

        let exists : boolean = false;

        for (let index = 0; index < this.matchmakings.length; index++) {
          const element = this.matchmakings[index];
          if (element.user_id == data.user_id) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          this.matchmakings.push({socket : client, user_id : data.user_id});
        }
      
      }
    }
  }
  