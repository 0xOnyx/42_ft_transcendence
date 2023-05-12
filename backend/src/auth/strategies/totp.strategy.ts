import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from 'passport-totp';
import {UserService} from "../../prisma/user.service";
import {User, Authenticators} from "@prisma/client";

@Injectable()
export class TotpStrategy extends PassportStrategy(Strategy, "totp")
{
    constructor(private userService: UserService) {
        super({
            codeField: 'code',
            windows: 100, //time windows to check
        });
    }
    async validate(user: User)
    {
        if (!user)
            throw new UnauthorizedException()
        const authUser  = await this.userService.user({id: user.id}, {auth: true});
        if (!authUser || !authUser.auth)
            throw new UnauthorizedException();
        return [authUser.auth.secret, 30]  //time to totp 30 default
    }
}