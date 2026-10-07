import getJogos from "@/services/getJogos";

export async function GET() {
    const jogos = await getJogos();

    return Response.json(jogos);
}