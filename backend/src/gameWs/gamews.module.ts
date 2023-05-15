import { Module } from '@nestjs/common';
import { GameWsGateway } from './gamews.gateway';
import { PrismaGameService } from 'src/prisma/prismagame.service';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/prisma/user.service';

@Module({
    controllers: [],
    providers: [GameWsGateway, PrismaGameService, GameService, UserService],
})
export class GameWsModule {};