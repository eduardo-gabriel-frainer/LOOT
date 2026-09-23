import { prisma } from "@/lib/prisma";

export default async function getJogos(limit?:number) {
    return await prisma.games.findMany({
        ...(limit ? { take: limit } : {})
    });
}