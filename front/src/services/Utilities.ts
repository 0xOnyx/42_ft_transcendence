import {PUBLIC_API_URI} from "$env/static/public";

import { goto } from "$app/navigation";
import type { Rooms, RoomUser } from "../types/room";
import type { Socket } from "socket.io-client";
import { Status } from "../types/user";

export function imageUrl(image: string | undefined) : string
{
    if (typeof image === 'undefined') {
        return '/image/default.png';
    }

    if ((<string>image).startsWith('http://') || (<string>image).startsWith('https://')) {
        return <string>image;
    }

    return '/' + <string>image;
}

export async function getRoom( id : number, socket : Socket) : Promise<Boolean>
{
	console.log("room path");
	const res: Response = await fetch(`${PUBLIC_API_URI}/message/getDmUser/${id}`, {
		method: 'GET',
		credentials: 'include'
	});
	let rooms: (Rooms & { user: RoomUser[] }) | undefined;
	if (res.status == 204) {
		const res: Response = await fetch(`${PUBLIC_API_URI}/user/isBlockedByMe/${id}`, {
		 method: 'GET',
		credentials: 'include'
		});
		const status = await res.json();
		if (status) {
			return false;
		} else {
			socket.emit("createDm", {user_id: id}, (rooms) => {
				if (rooms)
					goto(`/rooms/dms/${rooms.id}`);
				})
		}
	}
	if (res.status == 200) {
		rooms = await res.json();
		console.log(rooms);
		if (rooms)
			await goto(`/rooms/dms/${rooms.id}`);
	}
	return true;
}

export function getColor(status: Status)
{
	if (status == Status.OFFLINE)
		return "border-zinc-600";
	else if (status == Status.HIDDEN)
		return "border-rose-600";
	else if (status == Status.ONLINE)
		return "border-green-600 text-green-600";
}
