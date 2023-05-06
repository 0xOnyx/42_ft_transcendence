import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from 'passport-local';
import {UserService} from "../../prisma/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local"){
    constructor(private userService: UserService) {
        super();
    }

    async validate(username: string, password:string) {
        console.log(username);
        const user = this.userService.user({name: username});
        if (!user)
            throw new UnauthorizedException()
        return (user);
    }
}