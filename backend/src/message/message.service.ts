import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MessageService} from "../prisma/message.service";
import {UserService} from "../prisma/user.service";
import {Prisma, Rooms, RoomUser} from "@prisma/client";
import {TypeRoom} from ".prisma/client";
import {WsException} from "@nestjs/websockets";


@Injectable()
export class MessageServiceService {
    constructor(private messageService: MessageService, private userService: UserService) {
    }

    async getRoomId(room_id: number, user_id: number) {
        const includes = {room_user: true};
        const room_user = await this.userService.user(
            {id: user_id},
            includes) as Prisma.UserGetPayload<{ include: typeof includes }>
        if (room_user.room_user.find(content => content.room_id == room_id) != undefined)
            throw new HttpException("user in not in the room", HttpStatus.FORBIDDEN);
        let room = await this.messageService.room({
            where: {id: room_id},
            include: {
                user: true,
            }
        })
        if (!room)
            throw new HttpException("not room found", HttpStatus.NOT_FOUND);
        if (room.password && room.password?.length > 0)
            room.password = "lock";
        return room;
    }

    async getRoomUser(user_id: number) {
        let rooms = await this.messageService.rooms({id: user_id});

        return rooms.map(item => {
            if (item.password && item.password?.length > 0)
                item.password = "lock";
            return (item)
        });
    }

    async getMessageRoom(user_id: number, room_id: number, params: {
        skip?: number,
        take?: number,
    }) {
        const includes = {room_user: true};
        const room_user = await this.userService.user(
            {id: user_id},
            includes) as Prisma.UserGetPayload<{ include: typeof includes }>
        if (!room_user.room_user.find(content => content.room_id == room_id))
            throw new HttpException("user in not in the room", HttpStatus.FORBIDDEN);
        return this.messageService.getMessageFromRoom({
            ...params,
            where: {room_id: room_id},
            orderBy: {create_at: "asc"},
            include : {user: true}
        });
    }

    async getAllRoom() {
        const rooms = await this.messageService.roomAll(TypeRoom.PUBLIC_ROOM);

        return rooms.map(item => {
            if (item.password && item.password?.length > 0)
                item.password = "lock";
            return (item)
        });
    }

    async getDmUser(user_id: number, client_id: number)
    {
        const dmUser: (Rooms & {user: RoomUser[]})[] = await this.messageService.getDmUser({id: user_id});
        let room: Rooms & {user: RoomUser[]} | undefined;

        if (!dmUser)
            throw new HttpException("no dm exit", HttpStatus.NOT_FOUND);
        if (!(room = dmUser.find((element: (Rooms & {user: RoomUser[]})) => {
            return !!element.user.find((element: RoomUser) => element.user_id == Number(client_id))})))
            throw new HttpException("no dm found", HttpStatus.NOT_FOUND);
        return room;
    }

    async getAllDm(user_id: number)
    {
        return this.messageService.getDmUser({id: user_id});
    }
}
