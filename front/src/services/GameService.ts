import {PUBLIC_API_URI} from "$env/static/public";
import type { Game } from "../types/game.js";

let gameservice : GameService;

export class GameService
{
    constructor ()
    {

    }

    async create(user_id: number) : Promise<number|null>
    {
        const params = {
            map_type: 'CLASSIC',
            player_one_id: user_id
        };

        let res: Response = await fetch(`${PUBLIC_API_URI}/games/create`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        if (res.status != 201)
        {
            console.error((await res.json()).message[0]);
            return Promise.resolve(null);
        }

        let game : Game = <Game>await res.json();
        return Promise.resolve(game.id);
    }



}

// singleton
gameservice = new GameService();

export default gameservice;
