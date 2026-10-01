export type gameSave = {
    appid: number,
    name: string,
    image?: string | null,
    description?: string | null,
    updatedAt: Date
}

export type game = {
    id: number
    appid: number,
    name: string,
    image?: string | null,
    updatedAt: Date
}
