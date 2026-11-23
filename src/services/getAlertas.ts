import { prisma } from "@/lib/prisma";

export async function getAlertas(userId: number) {
    const alertas = await prisma.alertas.findMany({
        where: { userId },
        orderBy: { id: "desc" },
    });

    return {
        alertas,
        total: alertas.length,
    };
}

export async function deleteAlerta(id: number, userId: number) {
    const result = await prisma.alertas.deleteMany({
        where: { id, userId },
    });

    return result.count > 0;
}