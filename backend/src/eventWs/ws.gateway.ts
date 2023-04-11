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
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { IncomingMessage } from 'http';
import { ActivitylogService } from "../prisma/activitylog.service";
import { UserService } from "../prisma/user.service";
import { MessageService } from "../prisma/message.service";
import { UseGuards } from "@nestjs/common";
import { TypeRoom, RoleUser, Log, Status, TypeMessage, Friend, Rooms, RoomUser, User } from "@prisma/client"
import sessionMiddleware from '../sessions'
import * as passport from "passport";

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
  constructor(private readonly activitylog: ActivitylogService, private readonly userService: UserService, private readonly messageService: MessageService) {}
  async check_user(data: {room_id: number, user_id: number}, client: CustomSocket)
  {
    if (!client.request.user)
      throw new WsException("no user");
    const room = await this.messageService.room({where: {id: data.room_id}});
    if (!room || room.type != TypeRoom.PUBLIC_ROOM)
      throw new WsException("no possible in dm room");
    if (room.owner_id == data.user_id)
      throw new WsException("no possible to ban or kick owner");
    const userRoom = await this.messageService.getUserRoom({id: data.room_id}, {id: client.request.user.id});
    if (userRoom.length < 0)
      throw new WsException("not user founde");
    else if (userRoom[0].role != RoleUser.ADMIN && room.owner_id != client.request.user.id)
      throw new WsException("not authorize");
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
        },
        friend: true
      })
      client.join(client.request.user.id.toString());
      if (user && user.room_user)
      {
        user.room_user.forEach((element: (RoomUser & {room: Rooms}))=>{
            if (!element.ban)
              client.join(element.room.id.toString());
        })
      }
      if (user && user.friend)
      {
        user.friend.forEach((friend: Friend) => {
          if (!client.request.user)
            return ;
          let id =  friend.friend_id === client.request.user.id ? friend.user_id : friend.friend_id
          this.server.in(id.toString()).emit("FriendStatusUdpate", {id: client.request.user.id, status: Status.ONLINE})
        })
      }
      client.emit('connection', 'Successfully connected to server');
    }

    async handleDisconnect(client: CustomSocket) {
      if (
          !client.request.user)
        throw new WsException("no user");
      if ((await this.server.in(client.request.user.id.toString()).fetchSockets()).length > 1)
        return ;

      await this.activitylog.createLog({
        user: {connect: {id: client.request.user.id}},
        type: Log.LOGOUT,
        datas: JSON.stringify({time: new Date()})
      })
      await this.userService.updateUser({where: {id: client.request.user.id}, data: {online_status: Status.OFFLINE}});
      let user = await this.userService.userSelect({id: client.request.user.id}, {
        friend: true
      })
      if (user && user.friend)
      {
        user.friend.forEach((friend: Friend) => {
          if (!client.request.user)
            return ;
          let id =  friend.friend_id === client.request.user.id ? friend.user_id : friend.friend_id
          this.server.in(id.toString()).emit("FriendStatusUdpate", {id: client.request.user.id, status: Status.OFFLINE})
        })
      }
      client.emit('dissconect', "disconnect to server");
    }

    @UseGuards(AuthenticatedGuard)
    @SubscribeMessage('message')
    async handleEvent(
      @MessageBody() data: {room_id: number, message: string, message_type: string},
      @ConnectedSocket() client: CustomSocket,
    ) {
      if (!client.request.user)
        throw new WsException("no user");
      let user = await this.userService.userSelect({id: client.request.user.id}, {
        room_user: {
          include: {
            room: {
                include: {
                  user: true,
                }
            }}
        }
      })
      if (!user?.room_user)
        throw new WsException("no room user");
      let room_user: (RoomUser& {room?: (Rooms &{user: RoomUser[]}) | undefined}) | undefined =
          user.room_user.find((element: (RoomUser& {room?: (Rooms &{user: RoomUser[]}) | undefined})) => {
        return !!(element.room && element.room.id == Number(data.room_id));

      });
      if (!room_user?.mute && room_user?.term_penalty)
      {
        if (room_user.term_penalty <= new Date())
        {
            room_user.mute = false;
            await this.messageService.updateUser({id: data.room_id}, {id: client.request.user.id}, {mute: false});
        }
      }
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

    @UseGuards(AuthenticatedGuard)
    @SubscribeMessage('createRoomPublic')
    async createRoomPublic(
        @MessageBody() data: {password?: string},
        @ConnectedSocket() client: CustomSocket,
    ) {
      if (!client.request.user)
        throw new WsException("no user");
      const room: Rooms = await this.messageService.createRoom(TypeRoom.PUBLIC_ROOM, {id: client.request.user.id}, data);
      await this.messageService.joinRoom({id: room.id}, {id: client.request.user.id}, RoleUser.ADMIN, data.password);
      this.server.in(client.request.user.id.toString()).socketsJoin(room.id.toString());
      this.server.in(room.id.toString()).emit("updateRoom", room);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('joinRoomPublic')
  async joinRoomPublic(
      @MessageBody() data: {room_id: number, password?: string},
      @ConnectedSocket() client: CustomSocket
  ){
    if (!client.request.user)
      throw new WsException("no user");
    await this.messageService.joinRoom({id: Number(data.room_id)}, {id: client.request.user.id}, RoleUser.USER, data.password);
    const room = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.room_id.toString()).emit("updateRoom", room);
    this.server.in(client.request.user.id.toString()).socketsJoin(data.room_id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('leftRoomPublic')
  async leftRoomPublic(
      @MessageBody() data: {room_id: number},
      @ConnectedSocket() client: CustomSocket
  ){
    if (!client.request.user)
      throw new WsException("no user");
    await this.messageService.leftRoom({id: Number(data.room_id)}, {id: client.request.user.id});
    const room = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.room_id.toString()).emit("updateRoom", room);
    this.server.in(client.request.user.id.toString()).socketsLeave(data.room_id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('updateRoomPublic')
  async updateRoomPublic(
      @MessageBody() data: {room_id: number, password: string},
      @ConnectedSocket() client: CustomSocket
  ){
    if (!client.request.user)
      throw new WsException("no user");
    const room = await this.messageService.updateRoom({id: Number(data.room_id)}, {password: data.password})
    this.server.in(room.id.toString()).emit("updateRoom", room);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('createDm')
  async createDM(
      @MessageBody() data: {user_id: number},
      @ConnectedSocket() client: CustomSocket,
  ){
    if (!client.request.user)
      throw new WsException("no user");
    const dmUser: (Rooms & {user: RoomUser[]})[] = await this.messageService.getDmUser({id: client.request.user.id});
    if (dmUser)
    {
      if (dmUser.find((element: (Rooms & {user: RoomUser[]})) => {
          return !!element.user.find((element: RoomUser) => element.user_id == Number(data.user_id))}))
          throw new WsException("dm already exist");
    }
    const block_user = await this.userService.getBlockUser({id: client.request.user.id}, {id: Number(data.user_id)});
    if (block_user.length > 0)
      throw new WsException("your are blocked by the user or your are block the user");
    const room = await this.messageService.createDm({id: client.request.user.id}, {id: data.user_id})
    if (!room)
      throw new WsException("current user");
    this.server.in(room.id.toString()).emit("updateRoom", room);
    this.server.in(client.request.user.id.toString()).socketsJoin(room.id.toString());
    this.server.in(data.user_id.toString()).socketsJoin(room.id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('leftDm')
  async leftDm(
      @MessageBody() data: {user_id: number},
      @ConnectedSocket() client: CustomSocket,
  ){
    if (!client.request.user)
      throw new WsException("now user");
    const dmUser: (Rooms & {user: RoomUser[]})[] = await this.messageService.getDmUser({id: client.request.user.id});
    let room = undefined;
    if (!dmUser || !(room = dmUser.find((element: (Rooms & {user: RoomUser[]})) => {
        return !!element.user.find((element: RoomUser) => element.user_id == Number(data.user_id))})))
      throw new WsException("dm not exist");
    await this.messageService.leftRoom({id: room.id}, {id: client.request.user.id});
    await this.messageService.leftRoom({id: room.id}, {id: Number(data.user_id)});
    await this.messageService.deleteRoom({id: room.id});
    this.server.in(client.request.user.id.toString()).socketsLeave(room.id.toString());
    this.server.in(data.user_id.toString()).socketsLeave(room.id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('setUserRole')
  async setUserRole(
      @MessageBody() data: {room_id: number, user_id: number, role: RoleUser},
      @ConnectedSocket() client: CustomSocket
  ){
    this.check_user(data, client);
    await this.messageService.updateUser({id: data.room_id}, {id: data.user_id}, {role: data.role});
    const room_update = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.room_id.toString()).emit("updateRoom", room_update);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('banUserChannel')
  async banUserChannel(
      @MessageBody() data: {room_id: number, user_id: number},
      @ConnectedSocket() client: CustomSocket
  )
  {
    this.check_user(data, client);
    await this.messageService.updateUser({id: data.room_id}, {id: data.user_id}, {ban: true});
    const room_update = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.user_id.toString()).socketsLeave(data.room_id.toString());
    this.server.in(data.room_id.toString()).emit("updateRoom", room_update);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('unbanUserChannel')
  async unbanUserChannel(
      @MessageBody() data: {room_id: number, user_id: number},
      @ConnectedSocket() client: CustomSocket
  )
  {
    this.check_user(data, client);
    await this.messageService.updateUser({id: data.room_id}, {id: data.user_id}, {ban: false});
    const room_update = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.user_id.toString()).socketsJoin(data.room_id.toString());
    this.server.in(data.room_id.toString()).emit("updateRoom", room_update);
  }

  getTime(number_hours: number): Date
  {
    return new Date(Date.now() + (3600000 * number_hours))
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('muteUser')
  async muteUser(
      @MessageBody() data: {room_id: number, user_id: number, number_hours: number},
      @ConnectedSocket() client: CustomSocket
  )
  {
    this.check_user(data, client);
    const term_penality = this.getTime(data.number_hours);
    await this.messageService.updateUser({id: data.room_id}, {id: data.user_id}, {mute: true, term_penalty: term_penality});
    const room_update = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.room_id.toString()).emit("updateRoom", room_update);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('kickUser')
  async kickUser(
      @MessageBody() data: {room_id: number, user_id: number},
      @ConnectedSocket() client: CustomSocket
  )
  {
    this.check_user(data, client);
    await this.messageService.leftRoom({id: Number(data.room_id)}, {id: Number(data.user_id)});
    const room = await this.messageService.room({
      where: {id: Number(data.room_id)},
      include: {user: true}
    })
    this.server.in(data.user_id.toString()).socketsLeave(data.room_id.toString());
    this.server.in(data.room_id.toString()).emit("updateRoom", room);
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('blockUser')
  async blockUser(
    @MessageBody() data: {user_id: number},
    @ConnectedSocket() client: CustomSocket
  )
  {
    if (!client.request.user)
      throw new WsException("no user");
    const block_users = await this.userService.getBlockUser({id: client.request.user.id}, {id: Number(data.user_id)})
    if (block_users.length > 0)
      throw new WsException("you already block or you are block by the personne");
    await this.userService.blockUser({id: client.request.user.id}, {id: Number(data.user_id)})

    const dmUser: (Rooms & {user: RoomUser[]})[] = await this.messageService.getDmUser({id: client.request.user.id});
    let room = undefined;
    if (!dmUser || !(room = dmUser.find((element: (Rooms & {user: RoomUser[]})) => {
      return !!element.user.find((element: RoomUser) => element.user_id == Number(data.user_id))})))
      return ;
    await this.messageService.leftRoom({id: room.id}, {id: client.request.user.id});
    await this.messageService.leftRoom({id: room.id}, {id: Number(data.user_id)});
    await this.messageService.deleteRoom({id: room.id});
    this.server.in(client.request.user.id.toString()).socketsLeave(room.id.toString());
    this.server.in(data.user_id.toString()).socketsLeave(room.id.toString());
  }

  @UseGuards(AuthenticatedGuard)
  @SubscribeMessage('unblockUser')
  async unblockUser(
      @MessageBody() data: {user_id: number},
      @ConnectedSocket() client: CustomSocket,
  )
  {
    if (!client.request.user)
      throw new WsException("no user");
    const block_users = await this.userService.getBlockUserUnique({id: client.request.user.id}, {id: Number(data.user_id)})
    if (block_users.length <= 0)
      throw new WsException("you have no block the user");
    await this.userService.unblockUser({id: client.request.user.id}, {id: Number(data.user_id)})
  }
}