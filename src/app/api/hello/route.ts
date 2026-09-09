import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(
        {
            message: 'Olá estou funcionando'
        },
        {
            status: 200
        }
    )
}