import { deleteAlerta, getAlertas } from "@/services/getAlertas";
import { saveAlertas } from "@/services/saveAlertas";

type AlertRequest = {
    appid: number;
    name: string;
    img: string;
    targetPrice: number;
    currentPrice: number;
    userId: number;
};

type DeleteAlertRequest = {
    id: number;
    userId: number;
};

function isPositiveInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isAlertRequest(body: unknown): body is AlertRequest {
    return (
        typeof body === "object" &&
        body !== null &&
        "appid" in body &&
        "name" in body &&
        "img" in body &&
        "targetPrice" in body &&
        "currentPrice" in body &&
        "userId" in body &&
        typeof body.appid === "number" &&
        typeof body.name === "string" &&
        typeof body.img === "string" &&
        typeof body.targetPrice === "number" &&
        typeof body.currentPrice === "number" &&
        isPositiveInteger(body.userId)
    );
}

function isDeleteAlertRequest(body: unknown): body is DeleteAlertRequest {
    return (
        typeof body === "object" &&
        body !== null &&
        "id" in body &&
        "userId" in body &&
        isPositiveInteger(body.id) &&
        isPositiveInteger(body.userId)
    );
}

export async function GET(request: Request) {
    const userIdValue = new URL(request.url).searchParams.get("userId");
    const userId = userIdValue === null ? NaN : Number(userIdValue);

    if (!isPositiveInteger(userId)) {
        return Response.json({ error: "Usuário inválido." }, { status: 400 });
    }

    return Response.json(await getAlertas(userId));
}

export async function POST(req: Request) {
    const body: unknown = await req.json();

    if (!isAlertRequest(body)) {
        return Response.json({ error: "Dados do alerta inválidos." }, { status: 400 });
    }

    await saveAlertas(body);

    return new Response(null, { status: 201 });
}

export async function DELETE(request: Request) {
    const body: unknown = await request.json();

    if (!isDeleteAlertRequest(body)) {
        return Response.json({ error: "Dados do alerta inválidos." }, { status: 400 });
    }

    const deleted = await deleteAlerta(body.id, body.userId);

    if (!deleted) {
        return Response.json(
            { error: "Alerta não encontrado para este usuário." },
            { status: 404 }
        );
    }

    return new Response(null, { status: 204 });
}