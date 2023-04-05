import {Controller, Ip, Get, Res, UseGuards, Request, Req} from '@nestjs/common';
import { AuthService } from './auth.service'
import { OauthGuard } from "./guards/oauth.guard";
import {ApiOperation} from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@UseGuards(OauthGuard)
	@ApiOperation({summary: "Login root only use this"})
	@Get("")
	getLogin() {}

	// @ts-ignore
	@UseGuards(OauthGuard)
	@Get('callback')
	@ApiOperation({summary: "Callback for oauth2 don't use !"})
	callback(@Request() req: any, @Res() res: any, @Ip() ip: String)
	{
		return this.authService.callback(req, res, ip);
	}

	@Get("islogged")
	@ApiOperation({summary: "test if req is auth true or false"})
	isLogged(@Request() req: any): boolean
	{
		return req.isAuthenticated();
	}
}
