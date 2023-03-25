import {Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service'
import { OauthGuard } from "./guards/oauth.guard";


@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(OauthGuard)
	@Post("login")
	getLogin() :String {
		return this.authService.getLogin();
	 }

}
