import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    const messages = await prisma.motivationalMessage.findMany({
        where: { active: true },
    });

    if (messages.length === 0) {
        return NextResponse.json(null);
    }

    const message = messages[Math.floor(Math.random() * messages.length)];

    return NextResponse.json(message);
}
