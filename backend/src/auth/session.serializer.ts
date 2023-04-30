import {PassportSerializer} from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import {UserService} from "../prisma/user.service";
import {User} from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }
    serializeUser(user: any, done: Function): any {
        done(null, user.id)
    }
    deserializeUser(payload: any, done: Function): any {
        this.userService.user({id: payload}).then((user: User | null) => {
            done(null, user);
        }).catch((err)=>{done(err, null)})
    }
}