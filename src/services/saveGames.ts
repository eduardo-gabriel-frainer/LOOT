import { prisma } from "@/lib/prisma";
import { gameSave } from "@/types/types";

export async function saveGames(data: gameSave[]){
    await prisma.games.createMany({
        data: data.map((jogo) => ({
            appid: jogo.appid,
            name: jogo.name,
            updatedAt: new Date()
        }))
    })
}     