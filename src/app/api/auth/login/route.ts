import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const body: unknown = await request.json();

    if (
        typeof body !== "object" ||
        body === null ||
        !("email" in body) ||
        !("password" in body) ||
        typeof body.email !== "string" ||
        typeof body.password !== "string"
    ) {
        return Response.json({ error: "Email e senha são obrigatórios." }, { status: 400 });
    }

    const email = body.email.trim().toLowerCase();
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || user.password !== body.password) {
        return Response.json({ error: "Email ou senha incorretos." }, { status: 401 });
    }

    return Response.json({ id: user.id, email: user.email });
}
