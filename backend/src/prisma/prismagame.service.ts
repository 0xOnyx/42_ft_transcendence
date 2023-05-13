import { Injectable } from '@nestjs/common';
import {PrismaService} from "./prisma.service";
import {Prisma, StatusGame, TypeGame, type Game} from "@prisma/client";

@Injectable()
export class PrismaGameService {
    constructor(private prisma: PrismaService) {}

    /**
     * get first game with id
     * 
     * @param game_id id of game
     * @returns 
     */
    async find(game_id: number) {
        
        let query : Prisma.GameWhereUniqueInput = {id : game_id};
        return this.prisma.game.findUnique({
            where: query
        });

    }

    /**
     * search any game with query
     * 
     * @param query 
     * @returns 
     */
    async search(query: Prisma.GameWhereInput) {
        
        return this.prisma.game.findMany({
            where: query
        });

    }

    /**
     * get all specified game defined with query 
     * 
     * @param where 
     * @param include 
     * @returns 
     */
    async get(
        where?: Prisma.GameWhereUniqueInput,
        include?: Prisma.GameInclude) {
        return this.prisma.game.findMany({
            where: where,
            include: include
        });
    }

    /**
     * create a new game
     * 
     * @param map_type 
     * @param player_one_id 
     * @param player_two_id 
     * @returns 
     */
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

    /**
     * delete a game
     * 
     * @param where 
     * @returns 
     */
    async delete(where: Prisma.GameWhereUniqueInput)
    {
        return this.prisma.game.delete({
            where: where
        });
    }


    /**
     * update a game 
     * 
     * @param game 
     * @returns 
     */
    async update(game: Game)
    {
        return this.prisma.game.update({
            where: { id: game.id },
            data: game
        });
    }

}
