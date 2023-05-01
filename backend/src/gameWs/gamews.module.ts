import { Module } from '@nestjs/common';
import { GameWsGateway } from './gamews.gateway';

@Module({
    controllers: [],
    providers: [GameWsGateway],
})
export class GameWsModule {};