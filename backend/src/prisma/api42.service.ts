import {Injectable} from '@nestjs/common';
import {UserService} from "./user.service";

type User_intra = {
    id: number,
    email: string,
    login: string,
    first_name: string,
    last_name: string,

}

@Injectable()
export class Api42Service {
    constructor(private readonly userService: UserService) {}
    async get_user(access_token: string) :  Promise<User_intra | null>
    {
        try{
            const tokenHeader = {headers: {
                    Authorization: `Bearer ${access_token}`
                }}
            const res: Response = await fetch(`${process.env.API_OAUTH2}/v2/me`, tokenHeader);
            if (res.status != 200 || !res)
                return null;
            const data: any = await res.json()
            return  {
                id: data.id, email: data.email,
                login: data.login,
                first_name: data.first_name,
                last_name: data.last_name,
            }
        }
        catch(e: any){
            return null;
        }
    }

}
