import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { from, Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'dgram';
import { clearInterval } from 'timers';
import Pong from '../../../pong/src/classic/pong'

  @Injectable()
  @WebSocketGateway({
    path: "/gamews/", 
    namespace: 'events'
  })
  export class GameWsGateway {
    @WebSocketServer()
    server: Server;
    interval: NodeJS.Timer;
    pong: Pong;

    async handleDisconnect(client: Socket) 
    {
      console.log("disconnection x", Socket);
    }

    async handleConnection(client: Socket) 
    {
      console.log("connection x", Socket);
    }

    @SubscribeMessage('joinGame')
    start(@MessageBody() data: any): any {

      console.log(data);
      this.pong = new Pong(800, 500, null).setServer(true);
      return {};

    }

    @SubscribeMessage('events')
    changeGameStatus(@MessageBody() data: any): Observable<WsResponse<number>> {
       
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));

    }    
    
    @OnEvent('game.create')
    gameCreate(payload: any) {

      this.server.emit('events', payload);

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
  