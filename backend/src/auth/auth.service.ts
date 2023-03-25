import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {
	getLogin(): String {
		return 'Hello login!';
	}
}
