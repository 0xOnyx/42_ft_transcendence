import { Module } from '@nestjs/common';
import { GameWsGateway } from './gamews.gateway';
import { PrismaGameService } from 'src/prisma/prismagame.service';

@Module({
    controllers: [],
    providers: [GameWsGateway, PrismaGameService],
})
export class GameWsModule {};