import { prisma } from "@/lib/prisma";

export default async function getAlertas() {
    const alertas = await prisma.alertas.findMany({});
    const total = await prisma.alertas.count();
    
    return {
        alertas,
        total
    }}