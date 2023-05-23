import {Controller, Get, Param, Query, Req, Request, UseGuards} from '@nestjs/common';
import { MessageServiceService } from "./message.service";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { ApiCookieAuth, ApiQuery, ApiOperation } from "@nestjs/swagger";
import { TypeRoom, Prisma } from '@prisma/client'

@ApiCookieAuth()
@Controller('message')
export class MessageController {
    constructor(private readonly messageServiceService: MessageServiceService) {
    }

    @UseGuards(AuthenticatedGuard)
    @Get("room/:id")
    @ApiOperation({summary: "Get room member and room information by id"})
    getRoomId(@Param("id") id: string, @Request() req: any) {
        return this.messageServiceService.getRoomId(Number(id), req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("getAllRooms")
    @ApiOperation({summary: "get all possible room"})
    getAllroom(@Request() req: any) {
        return this.messageServiceService.getAllRoom();
    }

    @UseGuards(AuthenticatedGuard)
    @Get("rooms")
    @ApiOperation({summary: "Get all channel to the current user"})
    getRoomUser(@Request() req: any) {
        return this.messageServiceService.getRoomUser(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("message/:id")
    @ApiOperation({summary: "Get all message to the room by id"})
    @ApiQuery({name: 'skip', required: false, type: Number})
    @ApiQuery({name: 'take', required: false, type: Number})
    getMessageRoom(@Param("id") id: string, @Request() req: any, @Query() queryList: {
        skip?: number,
        take?: number,
    }) {
        if (queryList.skip)
            queryList.skip = Number(queryList.skip);
        if (queryList.take)
            queryList.take = Number(queryList.take);
        return this.messageServiceService.getMessageRoom(req.user.id, Number(id), queryList);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("getDmUser/:id")
    @ApiOperation({summary: "Get dm for a user by id"})
    getDmUser(@Param("id") id: number, @Request() req: any)
    {
        return this.messageServiceService.getDmUser(req.user.id, Number(id));
    }

    @UseGuards(AuthenticatedGuard)
    @Get('getAllDm')
    @ApiOperation({summary: "get all dm the current user"})
    getAllDm(@Request() req: any)
    {
        return this.messageServiceService.getAllDm(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("search/room")
    @ApiOperation({summary: "Search room by name or other in db"})
    @ApiQuery({name: 'skip', required: false, type: Number})
    @ApiQuery({name: 'take', required: false, type: Number})
    @ApiQuery({name: 'cursor', required: false, type: Number})
    @ApiQuery({name: 'element', required: false, type: String})
    @ApiQuery({name: 'value', required: false, type: String})
    @ApiQuery({name: 'orderBy', required: false, type: String})
    async searchUser(@Request() req: any, @Query() queryList: {
        skip?: number;
        take?: number;
        cursor?: Prisma.RoomsWhereUniqueInput;
        element?: keyof Prisma.RoomsWhereInput;
        value?: any;
        orderBy?: Prisma.RoomsOrderByWithRelationInput;
    }) {
        let rooms: {
            skip?: number;
            take?: number;
            cursor?: Prisma.RoomsWhereUniqueInput;
            where: Prisma.RoomsWhereInput;
            orderBy?: Prisma.RoomsOrderByWithRelationInput;
        } = {where: {type: TypeRoom.PUBLIC_ROOM}};
        if (queryList.element === 'name' && queryList.value === '*')
            return this.messageServiceService.getSearch(rooms);
        if (queryList.skip)
            rooms.skip = Number(queryList.skip);
        if (queryList.take)
            rooms.take = Number(queryList.take);
        if (queryList.cursor)
            rooms.cursor = queryList.cursor;
        if (queryList.element == "id")
            queryList.value = Number(queryList.value)
        if (queryList.element && queryList.value) {
            rooms.where = {};
            if (rooms.where)
                rooms.where[queryList.element] = {contains: queryList.value};
        }
        return this.messageServiceService.getSearch(rooms);
    }
}
