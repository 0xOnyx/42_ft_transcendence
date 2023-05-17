import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeGame, Game, Prisma } from '@prisma/client';
import { PrismaGameService } from 'src/prisma/prismagame.service';

@Injectable()
export class GameService {
    
    constructor(private eventEmitter: EventEmitter2, private prismaGameService: PrismaGameService) {}
    
    find(id: number) 
    {
        return this.prismaGameService.find(id);
    }

    get(query: Prisma.GameWhereInput | undefined)
    {
        return this.prismaGameService.search(query);
    }
    
    async create( map_type: TypeGame, 
            player_one_id : number, 
            player_two_id? : number)
    {

        const game : Game = await this.prismaGameService.create(map_type, player_one_id, player_two_id);

        if (game)
        {
            this.eventEmitter.emit(
                'game.create',
                game,
            );
        }

        return game;
    }

    async sendMessageInvite(game: Game)
    {
        this.eventEmitter.emit('invite_to_game', game);
    }

    async delete(id: number)
    {
        const game : Game | null = await this.find(id);
     
        if (game)
        { 
            await this.prismaGameService.delete({id : game.id});
            this.eventEmitter.emit(
                'game.delete',
                {id : id},
            );
        } 

        return game;
    }

    async update(game: Game)
    {
        await this.prismaGameService.update(game);
    }
    
}