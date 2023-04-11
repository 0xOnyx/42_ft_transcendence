import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MessageService} from "../prisma/message.service";
import {UserService} from "../prisma/user.service";
import {Prisma} from "@prisma/client";
import {TypeRoom} from ".prisma/client";


@Injectable()
export class MessageServiceService {
    constructor(private messageService: MessageService, private userService: UserService) {}

    async getRoomId(room_id: number, user_id: number)
    {
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

    async getRoomUser(user_id: number)
    {
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
    })
    {
        const includes = {room_user: true};
        const room_user = await this.userService.user(
            {id: user_id},
            includes) as Prisma.UserGetPayload<{ include: typeof includes }>
        if (room_user.room_user.find(content => content.room_id == room_id) != undefined)
            throw new HttpException("user in not in the room", HttpStatus.FORBIDDEN);
        return this.messageService.getMessageFromRoom({
            ...params,
            where: {room_id: room_id},
            orderBy: {create_at: "asc"}
        });
    }

    async getAllRoom()
    {
        const rooms = await this.messageService.roomAll(TypeRoom.PUBLIC_ROOM);

        return rooms.map(item => {
            if (item.password && item.password?.length > 0)
                item.password = "lock";
            return (item)
        });
    }
}
