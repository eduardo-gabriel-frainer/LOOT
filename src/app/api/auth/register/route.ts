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
    const password = body.password;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length === 0) {
        return Response.json({ error: "Informe um email válido e uma senha." }, { status: 400 });
    }

    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
        return Response.json({ error: "Este email já está cadastrado." }, { status: 409 });
    }

    const user = await prisma.users.create({
        data: { email, password },
        select: { id: true, email: true },
    });

    return Response.json(user, { status: 201 });
}
