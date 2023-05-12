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
import { Game, StatusGame } from '@prisma/client';

  @Injectable()
  @WebSocketGateway({
    path: "/gamews/", 
    namespace: 'events'
  })
  export class GameWsGateway {

    @WebSocketServer()
    server: Server;

    pongs: Map<string, PongServer> = new Map;

    constructor(private prismaGameService: PrismaGameService) {}

    async handleDisconnect(client: Socket) 
    {
      console.log("disconnection game socket", Socket);
    }

    async handleConnection(client: Socket) 
    {
      console.log("connection game socket", Socket);
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

      console.log('joinGame', data);
    
      let room_name : string = 'game_' + <string>(data.game_id);
      let game : Game = <Game>await this.prismaGameService.find(parseInt(data.game_id));
      let pong : PongServer;
  
      client.join(room_name);
    
      if (!this.pongs.has(room_name)) {

        console.log('create pong');

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
                  console.log('update game', game);
                  if (game != null)
                  {
                    if(pong.status == GameStatus.FINISHED)
                      game.status = StatusGame.FINISHED;
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
          console.log('update game', game);
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

    }

    /**
     * the game have change of status
     * 
     * @param data 
     * @param client 
     */
    @SubscribeMessage('eventGame')
    event(@MessageBody() data: NetMessage, @ConnectedSocket() client: Socket ): any {

      console.log('eventGame', data) ;

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
                console.log('update game', game);
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

      console.log('leaveGame', data);
      
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
    gameCreate(payload: any) {

      this.server.emit('createGame', payload);

    }


    @SubscribeMessage('leaveMatchmakingGame')
    leaveMatchmaking(@MessageBody() data: any) {

      console.log('leaveMatchmakingGame', data);
   
    }

    @SubscribeMessage('joinMatchmakingGame')
    joinMatchmaking(@MessageBody() data: any) {

      console.log('joinMatchmakingGame', data);
   
    }
  
  }
  