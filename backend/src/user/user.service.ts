import { Injectable } from '@nestjs/common';
import {UserService} from "../prisma/user.service";
import {Prisma, User, Friend} from "@prisma/client";


@Injectable()
export class UserServiceService {
    constructor(private userService: UserService) {
    }

    getUser(id: number) {
        return this.userService.user({id: id})
    }

    getFriend(id: number) {
        return this.userService.userSelect({id: id}, {
            id: true,
            friend: true,
        })
    }

    async addFriend(user_id: number, id: number)
    {
        const friend: Friend  | null= await this.userService.getFriend({id: id});
        if (!friend || friend.friend_id != user_id || friend.accept_at == null)
            return ;
        const to_change: Prisma.FriendUpdateInput = {
            accept_at : new Date()
        }
        await this.userService.updateFriend({id: id}, to_change);
    }

    deleteFriend(id: number, to_delete: number)
    {
        return this.userService.deleteFriend({id: id}, {id: to_delete})
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

}
