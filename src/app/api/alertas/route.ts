import { saveAlertas } from "@/services/saveAlertas";

export async function POST(req: Request) {

    const data = await req.json();

    await saveAlertas(data);

    return new Response(null, { status: 201 });
}