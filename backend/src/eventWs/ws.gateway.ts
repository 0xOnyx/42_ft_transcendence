import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  WsException
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {UseGuards} from "@nestjs/common";
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import sessionMiddleware from '../sessions'
import * as passport from "passport";
import {Friend, Rooms, RoomUser, User} from "@prisma/client"
import {IncomingMessage} from 'http';
import {ActivitylogService} from "../prisma/activitylog.service";
import {Prisma, Log, Status, TypeMessage} from "@prisma/client"
import {UserService} from "../prisma/user.service";
import {MessageService} from "../prisma/message.service";

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
  constructor(private readonly activitylog: ActivitylogService, private readonly userService: UserService, private readonly messageService: MessageService) {
  }

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
  async handleConnection(client: CustomSocket) {

    if (!client.request.user)
      throw new WsException("not user");

      await this.activitylog.createLog({
        user: {connect: {id: client.request.user.id}},
        type: Log.LOGIN,
        datas: JSON.stringify({time: new Date()})
      })
      await this.userService.updateUser({where: {id: client.request.user.id}, data: {online_status: Status.ONLINE}})
      let user = await this.userService.userSelect({id: client.request.user.id}, {
        room_user: {
          include: {room: true}
        }
      })
      client.join(client.request.user.id.toString());
      if (user && user.room_user)
      {
        user.room_user.forEach((element: (RoomUser & {room: Rooms})
        )=>{
            client.join(element.room.id.toString())
        })
      }
      client.emit('connection', 'Successfully connected to server');
  }

  async handleDisconnect(client: CustomSocket) {
    if (!client.request.user || (await this.server.to(client.request.user.id.toString()).fetchSockets()).length > 0)
      return ;

    await this.activitylog.createLog({
      user: {connect: {id: client.request.user.id}},
      type: Log.LOGOUT,
      datas: JSON.stringify({time: new Date()})
    })
    await this.userService.updateUser({where: {id: client.request.user.id}, data: {online_status: Status.OFFLINE}})
    client.emit('dissconect', "disconnect to server");
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('message')
  async handleEvent(
      @MessageBody() data: {room_id: number, message: string, message_type: string},
      @ConnectedSocket() client: CustomSocket,
  ) {
      if (!client.request.user)
        throw new WsException("not user");
      let user = await this.userService.userSelect({id: client.request.user.id}, {
        room_user: {
          include: {
            room: {
                include: {
                  user: true
                },
            }}
        }
      })
      if (!user?.room_user)
        throw new WsException("no room user");
      let room_user: (RoomUser& {room?: (Rooms &{user: RoomUser[]}) | undefined}) | undefined =
          user.room_user.find((element: (RoomUser& {room?: (Rooms &{user: RoomUser[]}) | undefined})) => {
        return !!(element.room && element.room.id == Number(data.room_id));

      });
      if (!room_user || !room_user.ban || !room_user.mute || !room_user.room)
      {
        throw new WsException("not permit");
      }
      let typeMessage: TypeMessage;
      if (data.message_type == "MESSAGE")
        typeMessage = TypeMessage.MESSAGE;
      else if (data.message_type == "ADD_FRIEND") {
        typeMessage = TypeMessage.ADD_FRIEND;
        if (room_user.room.type !=  "SINGLE_CHAT")
          throw new WsException("only in single chat");
        const add_id: RoomUser | undefined = room_user.room.user.find(element => element.user_id != client.request.user?.id)
        let friend: Friend = await this.userService.createFriend({id: client.request.user.id}, {id: add_id?.user_id}, );
        data.message = friend.id.toString();
      }
      else if (data.message_type == "INVITE_GAME") {
        typeMessage = TypeMessage.INVITE_GAME;
        //TODO : Create game and modify message to invite game;
      }
      else
          throw new WsException("bad message type");
      await this.messageService.createMessage({id: client.request.user.id}, {id: data.room_id}, typeMessage, data.message)
      const to_send_data: {send_user_id: number, room_id: number, message: string, message_type: string}
      = {...data, send_user_id: client.request.user.id}
      this.server.in(room_user.room.id.toString()).emit("message", to_send_data);
  }
}
