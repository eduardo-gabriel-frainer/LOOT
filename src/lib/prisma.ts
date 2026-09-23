import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL não foi configurada");
}

const url = new URL(databaseUrl);

const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.substring(1),
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
