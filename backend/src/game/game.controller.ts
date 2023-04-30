import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { GameService } from './game.service';

@Controller('games')
export class GameController {
    constructor(private gameService : GameService){}

    @UseGuards(AuthenticatedGuard)
    @Get() 
    all() : String
    {
        return 'all game';
    }

    @UseGuards(AuthenticatedGuard)
    @Get() 
    create() : String
    {
        return this.gameService.create();
    }
}