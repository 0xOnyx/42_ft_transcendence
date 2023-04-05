import {Controller, Get, Param, Query, Request, UseGuards} from '@nestjs/common';
import {MessageServiceService} from "./message.service";
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";

@Controller('message')
export class MessageController {
    constructor( private readonly messageServiceService: MessageServiceService) {}

    @UseGuards(AuthenticatedGuard)
    @Get("room/:id")
    getRoomId(@Param("id") id: string, @Request() req: any)
    {
        return this.messageServiceService.getRoomId(Number(id), req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("rooms")
    getRoomUser(@Request() req: any)
    {
        return this.messageServiceService.getRoomUser(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Get("message/:id")
    getMessageRoom(@Param("id") id: string, @Request() req: any, @Query() queryList: {
        skip?: number,
        take?: number,
    })
    {
        return this.messageServiceService.getMessageRoom(req.user.id, Number(id), queryList);
    }

}
