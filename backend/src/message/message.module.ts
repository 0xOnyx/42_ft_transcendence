import { Module } from '@nestjs/common';
import { MessageServiceService } from './message.service';
import {MessageService} from "../prisma/message.service";
import { MessageController } from './message.controller';
import {UserService} from "../prisma/user.service";

@Module({
    controllers: [MessageController],
    providers: [MessageServiceService, UserService, MessageService, MessageService]
})
export class MessageModule {}
