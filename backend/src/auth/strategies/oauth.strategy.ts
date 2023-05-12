import {uniqueNamesGenerator, adjectives, colors, animals} from "unique-names-generator";
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-oauth2"
import {UserService} from "../../prisma/user.service";
import {Api42Service} from "../../prisma/api42.service";
import { Prisma, Status, Log } from '@prisma/client';
import * as jdenticon from 'jdenticon';
import * as fs from "fs"


@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy,"oauth") {
	constructor(private readonly userService: UserService, private readonly api42Service: Api42Service)
	{
		super({
			authorizationURL: `${process.env.API_OAUTH2}/oauth/authorize`,
			tokenURL: `${process.env.API_OAUTH2}/oauth/token`,
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: `${process.env.HOST}/auth/callback`,
			scope: ["public", "profile"]
		});
	}

	async validate(accessToken: string, refreshToken: string)
	{
		if (!accessToken)
			throw new UnauthorizedException()
		const data = await this.api42Service.get_user(accessToken);
		if (!data?.id)
			throw new UnauthorizedException()
		const includes = {log: true, auth: true};
		let user = await this.userService.user({oauth_42_id: data.id}, includes);
		if (!user) {
			jdenticon.configure({
				hues: [207],
				lightness: {
					color: [0.84, 0.84],
					grayscale: [0.84, 0.84]
				},
				saturation: {
					color: 0.48,
					grayscale: 0.48
				},
				backColor: "#383683"
			});
			const png = jdenticon.toPng(data.login, 100);
			const uri = `${process.env.PHOTO_PATH}/${data.login}.png`
			await fs.writeFileSync(uri, png);
			let sameName = await this.userService.user({name: data.login});
			user = await this.userService.createUser({
				name: sameName ? uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }) : data.login,
				email: data.email,
				first_name: data.first_name,
				last_name: data.last_name,
				image_url: uri,
				oauth_42_login: data.login,
				oauth_42_id: data.id,
				last_login: new Date(),
				online_status: Status.OFFLINE,
			}) as Prisma.UserGetPayload<{ include: typeof includes }>
		}
		return (user);
	}
}