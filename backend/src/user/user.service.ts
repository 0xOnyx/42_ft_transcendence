import { Injectable } from '@nestjs/common';
import {UserService} from "../prisma/user.service";
import {Prisma, User} from "@prisma/client";


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

    addFriend(id: number, to_add: number)
    {
        return this.userService.createFriend({id: id}, {id: to_add})
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
            to_change.name;
        return this.userService.updateUser({where: {id: id}, data: to_change});
    }

    blockUser(id: number, to_block: number) {
        return this.userService.blockUser({id: id}, {id: to_block});
    }

    unblockuser(id: number, to_block: number)
    {
        return this.userService.unblockUser({user_id: id}, {lock_user_id: to_block});
    }


}
