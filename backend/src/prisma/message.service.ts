import { Injectable } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import {Prisma, TypeMessage} from "@prisma/client";

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async room(params: {
        where: Prisma.RoomsWhereUniqueInput,
        include?: Prisma.RoomsInclude
    }): Promise<Prisma.RoomsGetPayload<{ include: typeof params.include}> | null>
    {
        return this.prisma.rooms.findUnique({
            where: params.where,
            include: params.include
        });
    }
    async rooms(
        where: Prisma.UserWhereUniqueInput)
    {
        return this.prisma.rooms.findMany({
            where: {
                user: {
                    some: {
                        user: where
                    }
                }
            }
        });
    }

    async getMessageFromRoom(params: {
        skip?: number;
        take?: number;
        where?: Prisma.MessagesWhereInput;
        orderBy?: Prisma.MessagesOrderByWithRelationInput
    })
    {
        return this.prisma.messages.findMany(params);
    }

    async createMessage(where: Prisma.UserWhereUniqueInput,
                        room: Prisma.RoomsWhereUniqueInput,
                        message_type: TypeMessage,
                        content: string)

    {
        const data: Prisma.MessagesCreateInput = {
            message_type: message_type,
            content: content,
            create_at: new Date(),
            room: {connect: room},
            user: {connect: where},
        }
        await this.prisma.messages.create({
            data
        })
    }

}
