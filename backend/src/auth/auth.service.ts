import { Injectable } from '@nestjs/common';
import {ActivitylogService} from "../prisma/activitylog.service";
import {Log} from "@prisma/client";


@Injectable()
export class AuthService {
	constructor(private readonly activitylog: ActivitylogService) {}
	async callback(req: any, res: any, ip: String): Promise<void> {
		await this.activitylog.createLog({
			user: {connect: {id: req.user.id}},
			type: Log.LOGIN,
			datas: JSON.stringify({ip_address: ip, time: new Date()})
		})
		return res.redirect(process.env.REDIRECT); //TODO: redirect to real home page
	}
}
