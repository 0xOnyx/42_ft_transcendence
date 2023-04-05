import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from "./auth/guards/authenticated.guard"
import {ApiCookieAuth, ApiOperation} from "@nestjs/swagger";

@Controller()
@ApiCookieAuth()
export class AppController {
	constructor(private readonly appService: AppService) {}
	@Get()
	@ApiOperation({summary: "Hello world ping ! :)"})
	getHello(): string {
		return this.appService.getHello();
	}

}
