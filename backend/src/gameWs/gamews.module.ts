import { Module } from '@nestjs/common';
import { GameWsGateway } from './gamews.gateway';
import { PrismaGameService } from 'src/prisma/prismagame.service';
import { GameService } from 'src/game/game.service';
import {MessageService} from "../prisma/message.service";

@Module({
    controllers: [],
    providers: [GameWsGateway, PrismaGameService, GameService, MessageService],
})
export class GameWsModule {};