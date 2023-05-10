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
import { clearInterval } from 'timers';
import { Pong } from 'src/pong/src';
import { IoAdapter } from '@nestjs/platform-socket.io';

  @Injectable()
  @WebSocketGateway({
    path: "/gamews/", 
    namespace: 'events'
  })
  export class GameWsGateway {
    @WebSocketServer()
    server: Server;
    interval: NodeJS.Timer;
    pongs: Map<string, Pong> = new Map;

    async handleDisconnect(client: Socket) 
    {
      console.log("disconnection game socket", Socket);
    }

    async handleConnection(client: Socket) 
    {
      console.log("connection game socket", Socket);
    }

    @SubscribeMessage('joinGame')
    join(@MessageBody() data: any, @ConnectedSocket() client: Socket ): any {

      console.log('joinGame', data);
      let room : string = 'game_' + <string>(data.game_id);
      client.join(room);
    
      if (!this.pongs.has(room)) {
        this.server.on(room, (message : any) => {
          console.log ('on game', message);
        });
        this.pongs.set(room, ((new Pong(800, 500))
              .setServer(this.server)
              .addPlayer()
              .setRoom(room)
              .addChangeListener((pong : Pong) => {
                               
                  this.server.in(pong.getRoom()).emit('eventGame',

                    pong.getNetworkMessage()

                  );

              })));
      } 
      else {
        const p : Pong = <Pong>this.pongs.get(room);
        if (p.playerCount() < 2) {
          this.pongs.get(room)?.addPlayer();
        }
        if (p.playerCount() == 2) {
          p.run();
        }

      }
      return {};

    }
    
    @SubscribeMessage('leaveGame')
    leave(@MessageBody() data: any): any {

      console.log('leaveGame', data);
      // todo reease server
      return {};

    }
    
    @OnEvent('game.create')
    gameCreate(payload: any) {

      this.server.emit('createGame', payload);

    }

    run()
    {
      // this.pong = new Pong();
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        
        this.server.emit('games', {
          status : "READY",
          time : new Date().getTime()
        });

      }, 200);

    }
  
  }
  