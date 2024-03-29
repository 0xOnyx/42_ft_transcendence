import { Injectable } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import {TypeRoom, Prisma, TypeMessage, Rooms, RoomUser, RoleUser} from "@prisma/client";
import * as bcrypt from "bcrypt"
import {WsException} from "@nestjs/websockets";

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async room(params: {
        where: Prisma.RoomsWhereUniqueInput,
        include?: Prisma.RoomsInclude
    }): Promise<Prisma.RoomsGetPayload<{ include: typeof params.include }> | null> {
        return this.prisma.rooms.findUnique({
            where: params.where,
            include: params.include
        });
    }

    async rooms(
        where: Prisma.UserWhereUniqueInput,
        include?: Prisma.RoomsInclude,
        type?: TypeRoom) {
        return this.prisma.rooms.findMany({
            where: {
                user: {
                    some: {
                        user: where
                    }
                },
                type: type,
            },
            include: include
        });
    }

    async updateRoom(
        where: Prisma.UserWhereUniqueInput,
        data: {password: string}
    )
    {
        let passHash = null;
        if (data.password && data.password.length > 0)
            passHash = bcrypt.hashSync(data.password, 8);
        return this.prisma.rooms.update({
            where: where,
            data: {
                password: passHash || null,
            },
            include: {user: true}
        })
    }

    async roomAll(type: TypeRoom) {
        return this.prisma.rooms.findMany({
            where: {
                type: {
                    equals: type
                }
            }
        })
    }

    async Rooms(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.RoomsWhereUniqueInput;
        where?: Prisma.RoomsWhereInput;
        orderBy?: Prisma.RoomsOrderByWithRelationInput;
    }): Promise<Rooms[]> {
        return this.prisma.rooms.findMany(params)
    }

    async getMessageFromRoom(params: {
        skip?: number;
        take?: number;
        where?: Prisma.MessagesWhereInput;
        orderBy?: Prisma.MessagesOrderByWithRelationInput
        include?: Prisma.MessagesInclude
    }) {
        return this.prisma.messages.findMany(params);
    }

    async createMessage(where: Prisma.UserWhereUniqueInput,
                        room: Prisma.RoomsWhereUniqueInput,
                        message_type: TypeMessage,
                        content: string) {
        const data: Prisma.MessagesCreateInput = {
            message_type: message_type,
            content: content,
            create_at: new Date(),
            room: {connect: room},
            user: {connect: where},
        }
        return this.prisma.messages.create({
            data,
            include : {user: true}
        })
    }

    async createRoom(type: TypeRoom, where: Prisma.UserWhereUniqueInput, data: { name: string, password?: string }) {
        let passHash = null;
        if (data.password && data.password.length > 0)
            passHash = bcrypt.hashSync(data.password, 8);
        return this.prisma.rooms.create({
            data: {
                type: type,
                password: passHash || null,
                name: data.name,
                owner: {
                    connect: where
                }
            }
        })
    }

    async joinRoom(room_where: Prisma.RoomsWhereUniqueInput, user_where: Prisma.UserWhereUniqueInput, role: RoleUser, password?: string) {
        const room: (Rooms & { user?: RoomUser[] }) | null = await this.room({
            where: room_where,
            include: {user: true}
        });
        if (!room)
            throw new WsException("not room found");
        if (room.user && (room.user.find((element: RoomUser) => element.user_id == user_where.id))?.ban)
            throw new WsException("Your are ban to this room");
        if (room.user && room.user.find((element: RoomUser) => element.user_id == user_where.id))
            throw new WsException("already in room")
        if (room.password && !bcrypt.compareSync(password || "", room.password))
            throw new WsException("bad password")
        await this.prisma.roomUser.create({
            data: {
                role: role,
                room: {
                    connect: room_where
                },
                user: {
                    connect: user_where
                }
            }
        })
    }

    async leftRoom(room_where: Prisma.RoomsWhereUniqueInput, user_where: Prisma.UserWhereUniqueInput) {
        const room: (Rooms & { user?: RoomUser[] }) | null = await this.room({
            where: room_where,
            include: {user: true}
        });
        if (!room || !room.user)
            throw new WsException("not room found");
        const roomUser = room.user.find(element=>element.user_id == user_where.id);
        if ( roomUser && roomUser.role == RoleUser.ADMIN && (room.user.filter((element: RoomUser) => element.role == RoleUser.ADMIN)).length <= 1)
            throw new WsException("Your are the last admin you don't leave this room");
        await this.prisma.roomUser.deleteMany({
            where: {
                room: room_where,
                user: user_where
            }
        })
    }

    async getDmUser(user_where: Prisma.UserWhereUniqueInput) {
        return this.prisma.rooms.findMany({
            where: {
                type: TypeRoom.SINGLE_CHAT,
                user: {
                    some: {
                        user: user_where,
                    }
                }
            },
            include: {
                user: true
            }
        })
    }

    async createDm(user_where: Prisma.UserWhereUniqueInput, friend_id: Prisma.UserWhereUniqueInput)
    {
        return this.prisma.rooms.create({
            data: {
                type: TypeRoom.SINGLE_CHAT,
                owner: {
                    connect: user_where
                },
                user: {
                    createMany: {
                        data: [
                            {user_id: user_where.id as number},
                            {user_id: friend_id.id as number}
                        ]
                    }
                }
            },
            include : {
                user: true
            }
        })
    }

    async deleteRoom(room_where: Prisma.RoomsWhereUniqueInput)
    {

        await this.prisma.messages.deleteMany({
            where: {
                room: room_where
            }
        })
        await this.prisma.roomUser.deleteMany({
            where:{
                room: room_where
            }
        })
        await this.prisma.rooms.delete({
            where: room_where
        })
    }

    async getUserRoom(room_where: Prisma.RoomsWhereUniqueInput, user_where: Prisma.UserWhereUniqueInput)
    {
        return this.prisma.roomUser.findMany({
            where: {
                room: room_where,
                user: user_where
            }
        })
    }

    async updateUser(room_where: Prisma.RoomsWhereUniqueInput, user_where: Prisma.UserWhereUniqueInput, update: Prisma.RoomUserUpdateInput)
    {
        return this.prisma.roomUser.updateMany({
            where: {
                room: room_where,
                user: user_where,
            },
            data: update
        })
    }

    async   updateMessageInvite(message: Prisma.MessagesWhereUniqueInput, data: Prisma.MessagesUpdateInput)
    {
        return this.prisma.messages.update({
            where: message,
            data: data,
            include  : { user: true}
        })
    }

    async updateMessageGame(messageInput: Prisma.MessagesWhereInput, newMessage: string)
    {
        return this.prisma.messages.updateMany({
            where: messageInput,
            data: {
                content: newMessage,
            }
        })

    }
}
