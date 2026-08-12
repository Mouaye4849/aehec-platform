import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ numero: string }> }
) {
    const { numero } = await params;

    const result = await prisma.result.findUnique({
        where: {
            numero,
        },
    });

    if (!result) {
        return NextResponse.json(
            { message: "Résultat introuvable" },
            { status: 404 }
        );
    }

    return NextResponse.json(result);
}