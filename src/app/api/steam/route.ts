import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const appid = request.nextUrl.searchParams.get("appid")

    if (!appid) {
        return NextResponse.json(
            { error: "appid não informado" },
            { status: 400 }
        )
    }

    try {
        const response = await fetch(
            `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=br&l=portuguese`,
            {
                cache: "no-store",
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: "Erro ao consultar a Steam" },
                { status: response.status }
            )
        }

        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error("Erro ao buscar dados da Steam:", error)

        return NextResponse.json(
            { error: "Erro ao buscar dados da Steam" },
            { status: 500 }
        )
    }
}