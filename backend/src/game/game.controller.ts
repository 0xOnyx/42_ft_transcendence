import { Body, Controller, Get, Param, Post, UseGuards, ForbiddenException, Res, NotFoundException } from '@nestjs/common';
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { GameService } from './game.service';
import { ApiOperation } from '@nestjs/swagger';
import { TypeGame } from '@prisma/client';
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
        return this.gameService.get();
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
        const game = await this.gameService.create( <TypeGame>body.map_type, 
            +body.player_one_id,
            body.player_two_id);

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