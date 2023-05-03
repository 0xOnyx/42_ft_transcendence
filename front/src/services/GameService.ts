import {PUBLIC_API_URI} from "$env/static/public";
import type { Game } from "../types/game.js";

let gameservice : GameService;

export class GameService
{
    constructor ()
    {
       
    }

    async create(user_id: Number) : Promise<Number>
    {
        let res: Response = await fetch(`${PUBLIC_API_URI}/games/create`, {
            method: 'POST',
            credentials: 'include'
        });
        let game : Game = <Game>await res.json();
        return Promise.resolve(game.id);
    }



}

// singleton
gameservice = new GameService();

export default gameservice;
