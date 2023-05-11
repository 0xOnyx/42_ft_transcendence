import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {ActivitylogService} from "../prisma/activitylog.service";
import {Log} from "@prisma/client";
import * as base32 from 'thirty-two'
import * as crypto from 'crypto'
import {Prisma} from '@prisma/client'
import * as notp from 'notp';
import {UserService} from "../prisma/user.service";

@Injectable()
export class AuthService {
	constructor(private readonly activitylog: ActivitylogService, private userService: UserService) {}
	async callback(req: any, res: any, ip: String): Promise<void> {
		if (req.session.totpRequire)
			return res.redirect("/otp");
		await this.activitylog.createLog({
			user: {connect: {id: req.user.id}},
			type: Log.LOGIN,
			datas: JSON.stringify({ip_address: ip, time: new Date()})
		})
		return res.redirect(process.env.REDIRECT);
	}
	async generateToken()
	{
		const key = crypto.randomBytes(16).toString('hex');
		const encoded = base32.encode(key);
		return encoded.toString().replace(/=/g, '');
		//return `otpauth://totp/ft_transcendence?secret=${encodedForGoogle}&period=30`;
	}

	async valideTotp(where: Prisma.UserWhereUniqueInput, queryList: {token: string, code: string})
	{
		const key = base32.decode(queryList.token).toString();
		const login = notp.totp.verify(queryList.code, key)
		if (!login)
			throw new HttpException('bad token totp', HttpStatus.NOT_ACCEPTABLE)
		await this.userService.createTotp(where, key);
		return (login.delta);
	}

	async removeTotp(where: Prisma.UserWhereUniqueInput)
	{
		await this.userService.removeTotp(where);
	}
}
