import {PUBLIC_API_URI} from "$env/static/public";
import type { User } from "../types/user.js";

let userservice : UserService;

export class UserService
{
    constructor ()
    {
       
    }

    /**
     * return the status of login
     * 
     * @returns Promise<boolean> true if the user is logged
     */
    async isLogged() : Promise<boolean>
    {
        console.log("isLogged start");

        let logged: boolean;

        let res: Response = await fetch(`${PUBLIC_API_URI}/auth/islogged`, {
            method: 'GET',
            credentials: 'include'
        });

        res = await res.json();
        if (!res)
            logged = false;
        else
            logged = true;

        return Promise.resolve(logged);
    }

    async getCurrentUser() : Promise<User>
    {
        console.log("getCurrentUser start");

        let logged: boolean;

        let res: Response = await fetch(`${PUBLIC_API_URI}/user/me`, {
            method: 'GET',
            credentials: 'include'
        });

        return await res.json();
    }

}

// singleton
userservice = new UserService();

export default userservice;
