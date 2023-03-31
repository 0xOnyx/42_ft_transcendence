import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketServer, WebSocketGateway, MessageBody, ConnectedSocket} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {UseGuards} from "@nestjs/common";
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import sessionMiddleware from '../sessions'
import * as passport from "passport";
import {User} from "@prisma/client"
import {IncomingMessage} from 'http';
const wrap = (middleware: any) => (
    socket: Socket,
    next: (err?: any) => void,
) => middleware(socket.request, {}, next);


interface CustomSocket extends Socket {
  request: IncomingMessage & {
    user?: User;
  };
}

@WebSocketGateway({ namespace: 'events' })
export class WsGateway  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server)
  {
    server.use(wrap(sessionMiddleware))
    server.use(wrap(passport.initialize()))
    server.use(wrap(passport.session()))
    server.use((client: any, next) => {
      if (client.request.user) {
        next();
      } else {
        next(new Error('unauthorized'))
      }
    })
  }
  handleConnection(client: CustomSocket) {
    if (client.request.user)
    {
      console.log(client.request.user);
    }
      client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect(client: Socket) {
    client.emit('dissonnect', "disconnect to server");
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('events')
  handleEvent(
      @MessageBody() data: string,
      @ConnectedSocket() client: Socket,
  ): string {
    console.log(client);
    return data;
  }
}
