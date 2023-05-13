import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaGameService } from 'src/prisma/prismagame.service';

@Module({
    controllers: [GameController],
    providers: [GameService, PrismaGameService],
})
export class GameModule {};