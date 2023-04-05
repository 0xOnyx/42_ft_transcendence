import { Module } from '@nestjs/common';
import {WsGateway} from "./ws.gateway";
import {ActivitylogService} from "../prisma/activitylog.service";
import {UserService} from "../prisma/user.service";
import {MessageService} from "../prisma/message.service";


@Module({
    providers : [ActivitylogService, UserService, MessageService, WsGateway]
})
export class EventWsModule {}
