import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
  } from '@nestjs/websockets';
  import { Injectable } from '@nestjs/common';
  import { from, Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  import { Server } from 'socket.io';
  import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'dgram';

  @Injectable()
  @WebSocketGateway({
    path: "/gamews/", 
    namespace: 'events'
  })
  export class GameWsGateway {
    @WebSocketServer()
    server: Server;

    async handleDisconnect(client: Socket) {
      console.log("connection");
    }

    @SubscribeMessage('events')
    findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
       return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
    }
    
    @OnEvent('game.create')
    @SubscribeMessage('events')
    gameCreate(payload: any) {
      this.server.emit('events', payload);
    }

  }
  