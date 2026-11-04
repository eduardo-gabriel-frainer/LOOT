import { prisma } from "@/lib/prisma"

type alertSave = {
    appid: number
    name: string
    img: string
    targetPrice: number
}

export async function saveAlertas(data: alertSave) {
    await prisma.alertas.create({
        data: {
            appid: data.appid,
            name: data.name,
            img: data.img,
            targetPrice: data.targetPrice,
        }
    })
}