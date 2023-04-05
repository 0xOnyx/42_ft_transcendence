import {Controller, Body, Request, Param, Post, Get, UseGuards, Query} from '@nestjs/common';
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import {UserServiceService} from "./user.service";
import {UserService} from "../prisma/user.service";
import {Prisma, User} from '@prisma/client'
import {request} from "express";
import {UnknownElementException} from "@nestjs/core/errors/exceptions";

@Controller('user')
export class UserProviderController {
    constructor(private readonly userServiceServer: UserServiceService) {}

    @UseGuards(AuthenticatedGuard)
    @Get("id/:id")
    getprofile(@Param("id") id: string, @Request() req: any) {
        if (id == "me")
            id = req.user.id;
        return this.userServiceServer.getUser(Number(id));
    }

    @UseGuards(AuthenticatedGuard)
    @Get("friend")
    getFriend(@Request() req: any)
    {
        return this.userServiceServer.getFriend(req.user.id);
    }

    @UseGuards(AuthenticatedGuard)
    @Post("friend/add/:id")
    createFriend(@Param(":id") id : string, @Request() req: any)
    {
        return this.userServiceServer.addFriend(req.user.id, Number(id));
    }

    @UseGuards(AuthenticatedGuard)
    @Post("friend/delete/:id")
    deleteFriend(@Param(":id") id: string, @Request() req: any)
    {
        return this.userServiceServer.deleteFriend(req.user.id, Number(id));
    }

    //usage exemple => /user/search?skip=0&take=1&element=name&value=salut
    @UseGuards(AuthenticatedGuard)
    @Get("search")
    async searchUser(@Query() queryList: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        element?: keyof Prisma.UserWhereInput;
        value?: any;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    })
    {
        let user: {
            skip?: number;
            take?: number;
            cursor?: Prisma.UserWhereUniqueInput;
            where?: Prisma.UserWhereInput;
            orderBy?: Prisma.UserOrderByWithRelationInput;
        } = {};
        if (queryList.skip)
            user.skip = Number(queryList.skip);
        if (queryList.take)
            user.take = Number(queryList.take);
        if (queryList.cursor)
            user.cursor = queryList.cursor;
        if (queryList.element == "id" || queryList.element == "oauth_42_id")
            queryList.value = Number(queryList.value)
        if (queryList.element && queryList.value) {
            user.where = {};
            if (user.where)
                user.where[queryList.element] = queryList.value;
        }
        console.log(queryList);
        console.log(user);
        return this.userServiceServer.getSearch(user);
    }

    @UseGuards(AuthenticatedGuard)
    @Post("me")
    postUser(@Request() req: any, @Body() body: Prisma.UserUpdateInput)
    {
        this.userServiceServer.updateUser(req.user.id, body);
    }

    @UseGuards(AuthenticatedGuard)
    @Post("block/:id")
    blockuser(@Param("id") id: string, @Request() req: any)
    {
        //this.userServiceServer.delete_friend(req.user.id, Number(id)); TODO: IMPLEMENT THIS
        this.userServiceServer.blockUser(req.user.id, Number(id));
    }

    @UseGuards(AuthenticatedGuard)
    @Post("unblock/:id")
    unblockUser(@Param("id") id: string, @Request() req: any)
    {
        this.userServiceServer.unblockuser(req.user.id, Number(id));
    }

}
