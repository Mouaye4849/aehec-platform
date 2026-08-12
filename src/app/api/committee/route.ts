import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const members = await prisma.executiveMember.findMany({
        orderBy: { ordre: "asc" },
    });

    return NextResponse.json(members);
}
