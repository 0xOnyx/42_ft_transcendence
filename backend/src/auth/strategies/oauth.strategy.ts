import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-oauth2"

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy,"oauth") {
	constructor()
	{
		super({
			authorizationURL: `${process.env.API_OAUTH2}/oauth2/authorize`,
			tokenURL: `${process.env.API_OAUTH2}/oauth2/token`,
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: `${process.env.HOST}/auth/example/callback`,
			scope: ["public", "profile"]
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any)
	{
		console.log(profile);

	}
}