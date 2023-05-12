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
import { StatusGame } from '@prisma/client';

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
    join(@MessageBody() data: any, @ConnectedSocket() client: Socket ): any {

      console.log('joinGame', data);
      let room_name : string = 'game_' + <string>(data.game_id);
      
      client.join(room_name);
    
      if (!this.pongs.has(room_name)) {

        console.log('create pong');

        let pong : PongServer = new PongServer(800, 500);

        pong.setServer(this.server)
          .addPlayer()
          .setGameId(parseInt(data.game_id))
          .setRoom(room_name)
          .addChangeListener((pong : PongServer) => {

              this.server.in(pong.getRoom()).emit('eventGame',
                pong.getNetworkMessage()
              );

              if (pong.status == GameStatus.FINISHED)
              {
                this.prismaGameService.find(pong.getGameId()).then((game) => {
                  console.log('update game', game);
                  if (game != null)
                  {
                    game.status = StatusGame.FINISHED;
                    game.score_one = pong.players[0].score;
                    game.score_two = pong.players[1].score;
                    this.prismaGameService.update(game);
                  }
                })
              }

          });

        pong.run();
        
        this.pongs.set(room_name, pong);

      } 
      else {

        console.log('add player');

        const p : PongServer = <PongServer>this.pongs.get(room_name);

        if (p.playerCount() < 2) {
          this.pongs.get(room_name)?.addPlayer();
        }
        if (p.playerCount() == 2) {
          p.run();
        }

      }

      return {};

    }

    /**
     * the game have change of status
     * 
     * @param data 
     * @param client 
     */
    @SubscribeMessage('eventGame')
    event(@MessageBody() data: NetMessage, @ConnectedSocket() client: Socket ): any {

      console.log('capture eventGame', data) ;

      let room : string = 'game_' + data.game_id;

      if (this.pongs.has(room)) {

        let pong : PongServer = <PongServer>this.pongs.get(room);

        if (data.event == GameEvent.CONNECT)
        {

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

            pong.checkReady();
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
    leave(@MessageBody() data: any): any {

      console.log('leaveGame', data);
      // todo release server
      return {};

    }
    
    /**
     * emit when a nouew game is created
     * 
     * @param payload 
     */
    @OnEvent('game.create')
    gameCreate(payload: any) {

      this.server.emit('createGame', payload);

    }
  
  }
  