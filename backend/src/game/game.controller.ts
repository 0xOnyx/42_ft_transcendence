import { Body, Controller, Get, Param, Post, UseGuards, ForbiddenException, Res, NotFoundException } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { GameService } from './game.service';
import { ApiOperation } from '@nestjs/swagger';
import { Game, StatusGame, TypeGame } from '@prisma/client';
import { CreateGameValidator } from './validators/create.validator';
import { Response } from 'express';

@Controller('games')
export class GameController {
    constructor(private gameService : GameService){}

    @UseGuards(AuthenticatedGuard)
    @ApiOperation({summary: "Get all games"})
    @Get() 
    all()
    {
        return this.gameService.get(undefined);
    }

    @UseGuards(AuthenticatedGuard)
    @ApiOperation({summary: "get a game specified by :id"})
    @Get(':id')
    async get(@Param("id") id: string)
    {
        const game = await this.gameService.find(~~id);
        if(game)
           return game;
        else
            throw new NotFoundException(`The game with id ${id} does not exist.`);
    }

    @UseGuards(AuthenticatedGuard)
    @ApiOperation({summary: "Create a new game with parameters"})
    @Post('create')
    async create(@Body() body: CreateGameValidator )
    {
        let game : Game | null = null;

        // test si il y a deja un jeu actif avec aucun partenaire
        if (!body.player_two_id) {
            let games : Array<Game> = await this.gameService.get({ status: StatusGame.READY, player_one_id: body.player_one_id, player_two: null });
            if (games.length > 0) {
                game = games[0];
                game.map_type = <TypeGame>body.map_type;
                this.gameService.update(game);
            }
        }


        if (!game) {

            game = await this.gameService.create( <TypeGame>body.map_type, 
                body.player_one_id,
                body.player_two_id);
    
            if (body.player_two_id)
                await this.gameService.sendMessageInvite(game);

        }

        if(game)
            return game;
         else
             throw new ForbiddenException(`Parameters invalid for create a game.`);
 
    }
    
    @UseGuards(AuthenticatedGuard)
    @ApiOperation({summary: "delete a game specified by :id"})
    @Get(':id/delete')
    async delete(@Param("id") id: string, @Res() res: Response)
    {
        const game = await this.gameService.delete(~~id);
        if(game)
           return game;
        else
            throw new NotFoundException(`The game with id ${id} does not exist.`);
    
    }

}