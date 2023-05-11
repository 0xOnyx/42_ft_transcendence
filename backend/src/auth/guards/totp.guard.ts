import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class TotpGuard extends AuthGuard('totp')
{
    async canActivate(context: ExecutionContext)
    {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        if (result)
            request.session.totpRequire = false;
        await super.logIn(request);
        return (result);
    }
}