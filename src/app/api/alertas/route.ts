import { saveAlertas } from "@/services/saveAlertas";

type AlertRequest = {
    appid: number;
    name: string;
    img: string;
    targetPrice: number;
    currentPrice: number;
    userId: number;
};

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
        typeof body.userId === "number" &&
        Number.isInteger(body.userId) &&
        body.userId > 0
    );
}

export async function POST(req: Request) {
    const body: unknown = await req.json();

    if (!isAlertRequest(body)) {
        return Response.json({ error: "Dados do alerta inválidos." }, { status: 400 });
    }

    await saveAlertas(body);

    return new Response(null, { status: 201 });
}