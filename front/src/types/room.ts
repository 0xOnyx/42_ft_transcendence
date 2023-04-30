import type { User } from './user.js';

export type Rooms =
{
    id: number,
    name: string,
    owner_id: number,
    type: RoomType,
    password?: string,
    last_message_id?: number,
    count_messages?: number,
    users?: Array<RoomUser>,
    messages?: Array<Messages>,
}

export enum RoomType
{
    PUBLIC_ROOM = "PUBLIC_ROOM",
    PRIVATE_ROOM = "PRIVATE_ROOM",
    SINGLE_CHAT = "SINGLE_CHAT",
    GAME_CHAT = "GAME_CHAT"
}

export type RoomUser =
{
    id: number,
    room_id: number,
    user_id: number,
    role: UserRole,
    last_message_read_id?: number,
    count_read_messages?: number,
    ban?: boolean,
    mute?: boolean,
    term_penalty?: Date,
    user?: User
}

export enum UserRole
{
    ADMIN = "ADMIN",
    USER = "USER"
}


export enum MessageRole
{
    MESSAGE = "MESSAGE",
    ADD_FRIEND = "ADD_FRIEND",
    INVITE_GAME = "INVITE_GAME"
}


export type Messages =
{
    id: number,
    room_id: number,
    user_id: number,
    message_type: MessageRole,
    content?: string,
    created_at?: string,
}
