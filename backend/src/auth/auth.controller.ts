import {Controller, Post, Ip, Get, Res, UseGuards, Request} from '@nestjs/common';
import { AuthService } from './auth.service'
import { OauthGuard } from "./guards/oauth.guard";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@UseGuards(OauthGuard)
	@Get("")
	getLogin() {}

	// @ts-ignore
	@UseGuards(OauthGuard)
	@Get('callback')
	callback(@Request() req: any, @Res() res: any, @Ip() ip: String)
	{
		return this.authService.callback(req, res, ip);
	}
}
