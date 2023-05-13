import {PUBLIC_API_URI} from "$env/static/public";
import type { Game } from "../types/game.js";

let gameservice : GameService;

export class GameService
{
    constructor ()
    {

    }

    /**
     * create a new game
     *
     * @param user_id
     * @returns
     */
    async create(map_type: string, player_one_id: number, player_two_id: undefined | number) : Promise<number|null>
    {
        const params = {
            map_type: map_type,
            player_one_id: player_one_id,
            player_two_id: player_two_id
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

    /**
     * Get the game id
     *
     * @param game_id
     * @returns
     */
    async get (game_id : number) : Promise<Game|null>
    {
        let res: Response = await fetch(`${PUBLIC_API_URI}/games/${game_id}`, {
            method: 'GET',
            credentials: 'include',
        });

        if (res.status != 200)
        {
            console.error((await res.json()).message[0]);
            return Promise.resolve(null);
        }

        let game : Game = <Game>await res.json();
        return Promise.resolve(game);
    }

}

// singleton
gameservice = new GameService();

export default gameservice;
