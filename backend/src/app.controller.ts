import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from "./auth/guards/authenticated.guard"

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@UseGuards(AuthenticatedGuard)
	@Get("profile")
	getProfile(@Request() req: any) {
		return req.user;
	}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

}
