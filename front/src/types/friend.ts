
export type Friend = {
    id: number
    user_id: number
    friend_id: number
    request_at: Date
    accept_at: Date | null
}
