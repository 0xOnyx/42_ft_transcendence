import {Controller, Ip, Query, Get, Post, Res, UseGuards, Request, Req} from '@nestjs/common';
import { AuthService } from './auth.service'
import { OauthGuard } from "./guards/oauth.guard";
import { LocalGuard } from "./guards/local.guard";

import {ApiOperation, ApiQuery} from "@nestjs/swagger";
import {TotpGuard} from "./guards/totp.guard";
import {AuthenticatedGuard} from "./guards/authenticated.guard";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	@UseGuards(OauthGuard)
	@ApiOperation({summary: "Login root only use this"})
	@Get("")
	getLogin() {}

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
		return req.isAuthenticated() && !req.session.totpRequire;
	}

	@Get("logout")
	@ApiOperation({summary: "logout"})
	async logout(@Request() req: any, @Res() res: any)
	{
		await req.session.destroy();
		return res.redirect('/');
	}

	@UseGuards(LocalGuard)
	@Post("dev/login")
	async devLogin(@Request() req: any, @Res() res: any)
	{
		return res.redirect(process.env.REDIRECT);
	}

	@UseGuards(TotpGuard)
	@Post("totp")
	async postTotp(@Request() req: any, @Res() res: any, @Ip() ip: String)
	{
		return this.authService.callback(req, res, ip);
	}

	@UseGuards(AuthenticatedGuard)
	@Get("GenerateTotp")
	async generateTotp()
	{
		return this.authService.generateToken();
	}

	@UseGuards(AuthenticatedGuard)
	@Get("ValideTotp")
	@ApiOperation({summary: "Valide totp for this user"})
	@ApiQuery({name: 'token', required: true, type: String})
	@ApiQuery({name: 'code', required: true, type: String})
	async valideTotp(@Request() req: any,
		@Query() queryList: {
			token: string,
			code: string,
	})
	{
		return this.authService.valideTotp({id: req.user.id}, queryList);
	}

	@UseGuards(AuthenticatedGuard)
	@Get("removeTotp")
	@ApiOperation({summary: "Delete totp for this user"})
	async removeTotp(@Request() req: any)
	{
		return this.authService.removeTotp({id: req.user.id});
	}

}
