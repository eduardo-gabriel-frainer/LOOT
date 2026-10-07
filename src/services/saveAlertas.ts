import { prisma } from "@/lib/prisma"

type alertSave = {
    appid: number
    targetPrice: number
}

export async function saveAlertas(data: alertSave) {
    await prisma.alertas.create({
        data: {
            appid: data.appid,
            targetPrice: data.targetPrice,
        }
    })
}