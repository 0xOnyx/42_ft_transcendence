import { Injectable } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import {Prisma, StatusGame, TypeGame, type Game} from "@prisma/client";

@Injectable()
export class PrismaGameService {
    constructor(private prisma: PrismaService) {}

    /**
     * 
     * @param params specifiy ine 
     * @returns 
     */
    async find(game_id: number) {
        
        let query : Prisma.GameWhereUniqueInput = {id : game_id};
        return this.prisma.game.findUnique({
            where: query
        });

    }

    async get(
        where?: Prisma.GameWhereUniqueInput,
        include?: Prisma.GameInclude) {
        return this.prisma.game.findMany({
            where: where,
            include: include
        });
    }

    async create(map_type: TypeGame, 
                player_one_id : number,
                player_two_id? : number) {

        const input: Prisma.GameCreateInput = {
            status : StatusGame.CREATED,
            map_type : map_type,
            score_one : 0,
            score_two : 0,
            player_one : {
                connect : {
                    id : +player_one_id
                }
            },
        };

        if(player_two_id) {
            input.player_two = {
                connect : {
                    id : player_two_id
                }
            };
        }

        return this.prisma.game.create({
            data: input
        });

    }

    async delete(where: Prisma.GameWhereUniqueInput)
    {
        return this.prisma.game.delete({
            where: where
        });
    }


    async update(game: Game)
    {
        return this.prisma.game.update({
            where: { id: game.id },
            data: game
        });
    }

}
