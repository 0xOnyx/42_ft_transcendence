import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";

@Controller('games')
export class GameController {
    constructor(){}

    @UseGuards(AuthenticatedGuard)
    @Get() 
    all() : String
    {
        return "test";
    }
}