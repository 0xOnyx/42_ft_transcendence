import { Injectable } from '@nestjs/common';
import {UserService} from "../prisma/user.service";
import {Prisma, User, Friend, Game} from "@prisma/client";

@Injectable()
export class UserServiceService {
    constructor(private userService: UserService) {
    }

    async getUser(id: number, include?: Prisma.UserInclude) {
        const user = await this.userService.user({id: id}, include)
        if (user?.auth)
            user.auth.secret = "secret";
        return user;
    }

    async getFriend(id: number) {
        const friend: any = await this.userService.userSelect({id: id}, {
            id: true,
            friend: true,
            symetric_friend: true,
        })
        if (!friend)
            return {};
        return {
            id: friend.id,
            friend: [...friend.friend, ...friend.symetric_friend]
        }
    }

	async getBlockedUser(id: number) {
        const user: any = await this.userService.userSelect({id: id}, {
            id: true,
            lock_user: true,
        })
        if (!user)
            return {};
        return {
            id: user.id,
            blockedUsers: [...user.lock_user]
        }
    }

    getSearch(queryList: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        return this.userService.Users(queryList);
    }

    updateUser(id: number, data: Prisma.UserUpdateInput) {
        let to_change: Prisma.UserUpdateInput = {};
        if (data.name)
            to_change.name = data.name;
        return this.userService.updateUser({where: {id: id}, data: to_change});
    }

    async isBlockedByMe(id_user: number, id_user_check: number)
    {
        const block_user = await this.userService.getBlockUser({id: id_user}, {id: id_user_check});
        return (!!block_user.find(item=>{return(item.lock_user_id == id_user_check)}));
    }

	async getGameHistory(id_user: number)
	{
		return await this.userService.getGameHistory({id: id_user});
	}



	async getStats(id_user: number) {
		const history = await this.userService.getGameHistory({id: id_user});
		if (history)
		{
			const win = history.filter((item: Game)=>{
				return ((item.player_one_id == id_user && item.score_one > item.score_two)
				|| 	(item.player_two_id == id_user && item.score_one < item.score_two))
			}).length
			const losses = history.filter((item: Game)=>{
				return ((item.player_one_id == id_user && item.score_one < item.score_two)
				|| 	(item.player_two_id == id_user && item.score_one > item.score_two))
			}).length
			let res = {
				played : history.length,
				win: win,
				losses : losses,
				ratio: Math.floor(win / (win + losses) * 100),
				level: 1, //TODO : ADD THIS SHIT
				league: "gold"
			};
			return (res);
		}
		return (undefined);
	}
}
