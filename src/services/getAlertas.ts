import { prisma } from "@/lib/prisma";

export default async function getAlertas() {
    return await prisma.alertas.findMany({});
}