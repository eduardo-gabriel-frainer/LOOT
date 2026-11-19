import { prisma } from "@/lib/prisma";

export default async function getJogo(appid: number) {
    return prisma.games.findUnique({
        where: { appid },
    });
}